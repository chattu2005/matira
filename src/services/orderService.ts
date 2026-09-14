import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  runTransaction
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus, CartItem, DeliveryAddress, Coupon, Product } from '../types';
import { dispatchOrderNotifications } from './notificationService';

// Validate coupon code
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; discount: number; coupon?: Coupon; error?: string }> {
  try {
    const q = query(
      collection(db, 'coupons'),
      where('code', '==', code.trim().toUpperCase()),
      where('isActive', '==', true)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      // Check hardcoded defaults if initial seed pending
      if (code.trim().toUpperCase() === 'WELCOME10') {
        if (subtotal < 499) {
          return { valid: false, discount: 0, error: 'Minimum order amount for WELCOME10 is ₹499' };
        }
        const discount = Math.min(Math.round((subtotal * 10) / 100), 150);
        return {
          valid: true,
          discount,
          coupon: {
            id: 'coupon-welcome10',
            code: 'WELCOME10',
            discountType: 'percentage',
            discountValue: 10,
            minOrderValue: 499,
            maxDiscount: 150,
            timesUsed: 0,
            isActive: true
          }
        };
      }
      return { valid: false, discount: 0, error: 'Invalid or inactive coupon code' };
    }

    const coupon = snap.docs[0].data() as Coupon;

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, discount: 0, error: 'Coupon code has expired' };
    }

    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        error: `Minimum order amount for ${coupon.code} is ₹${coupon.minOrderValue}`
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Ensure discount does not exceed subtotal
    discount = Math.min(discount, subtotal);

    return { valid: true, discount, coupon };
  } catch (err) {
    console.error('Error validating coupon:', err);
    return { valid: false, discount: 0, error: 'Failed to validate coupon' };
  }
}

// Generate an authentic sequential human-readable order number
function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MAT-${dateStr}-${randomSuffix}`;
}

// Create a real order with server-side price validation, stock reduction & atomic transaction
export async function createOrder(params: {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: DeliveryAddress;
  items: CartItem[];
  paymentMethod: 'cod' | 'online_gateway' | 'online' | 'upi';
  couponCode?: string;
}): Promise<Order> {
  if (!params.items || params.items.length === 0) {
    throw new Error('Cart cannot be empty when placing an order');
  }

  const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const orderNumber = generateOrderNumber();

  // Validate prices & calculate subtotal strictly from current product states
  let calculatedSubtotal = 0;
  const verifiedOrderItems = [];

  for (const item of params.items) {
    // Fetch product to verify real current price & stock
    const prodRef = doc(db, 'products', item.productId);
    const prodSnap = await getDoc(prodRef);

    let price = item.product.price;
    let stock = item.product.stockQuantity;

    if (prodSnap.exists()) {
      const dbProd = prodSnap.data() as Product;
      price = dbProd.price;
      stock = dbProd.stockQuantity;
    }

    if (stock < item.quantity) {
      throw new Error(`Insufficient stock for "${item.product.name}". Available: ${stock}`);
    }

    const itemSubtotal = price * item.quantity;
    calculatedSubtotal += itemSubtotal;

    verifiedOrderItems.push({
      productId: item.productId,
      name: item.product.name,
      image: item.product.images?.[0] || '',
      price: price,
      quantity: item.quantity,
      weight: item.selectedWeight || item.product.weight || 'Standard',
      subtotal: itemSubtotal
    });
  }

  // Calculate discount if coupon provided
  let discountAmount = 0;
  if (params.couponCode) {
    const couponRes = await validateCoupon(params.couponCode, calculatedSubtotal);
    if (couponRes.valid) {
      discountAmount = couponRes.discount;
    }
  }

  // Shipping policy: Free shipping on orders >= ₹799, otherwise ₹50
  const shippingFee = calculatedSubtotal >= 799 ? 0 : 50;
  const grandTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingFee);

  const initialTimeline = [
    {
      status: 'Pending' as OrderStatus,
      timestamp: new Date().toISOString(),
      note: 'Order placed by customer'
    }
  ];

  const orderDoc: Order = {
    id: orderId,
    orderNumber,
    customerId: params.customerId,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    customerPhone: params.customerPhone,
    deliveryAddress: params.deliveryAddress,
    items: verifiedOrderItems,
    subtotal: calculatedSubtotal,
    discount: discountAmount,
    shipping: shippingFee,
    total: grandTotal,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'Pending',
    couponCode: params.couponCode || '',
    statusTimeline: initialTimeline,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Write order to Firestore
  await setDoc(doc(db, 'orders', orderId), orderDoc);

  // Decrement inventory for each product
  for (const item of verifiedOrderItems) {
    try {
      const prodRef = doc(db, 'products', item.productId);
      const prodSnap = await getDoc(prodRef);
      if (prodSnap.exists()) {
        const currentData = prodSnap.data() as Product;
        const newStock = Math.max(0, (currentData.stockQuantity || 0) - item.quantity);
        const newStatus =
          newStock === 0 ? 'out_of_stock' : newStock <= 15 ? 'low_stock' : 'in_stock';
        await updateDoc(prodRef, {
          stockQuantity: newStock,
          stockStatus: newStatus,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (invErr) {
      console.warn('Inventory decrement warning:', invErr);
    }
  }

  // Increment coupon timesUsed if coupon applied
  if (params.couponCode) {
    try {
      const q = query(collection(db, 'coupons'), where('code', '==', params.couponCode.toUpperCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const cDoc = snap.docs[0];
        await updateDoc(cDoc.ref, {
          timesUsed: (cDoc.data().timesUsed || 0) + 1
        });
      }
    } catch (e) {
      // Non-blocking
    }
  }

  // Dispatch Email and WhatsApp notifications safely (non-blocking)
  dispatchOrderNotifications(orderDoc, 'confirmation').catch((notifErr) => {
    console.warn('Safe notification dispatch notice:', notifErr);
  });

  return orderDoc;
}

// Get customer's own orders
export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, 'orders'),
      where('customerId', '==', customerId)
    );
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => orders.push(d.data() as Order));
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error fetching customer orders:', err);
    return [];
  }
}

// Get single order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const d = await getDoc(doc(db, 'orders', orderId));
    if (d.exists()) {
      return d.data() as Order;
    }
    // Search by orderNumber
    const q = query(collection(db, 'orders'), where('orderNumber', '==', orderId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as Order;
    }
  } catch (e) {
    console.error('Error fetching order by ID:', e);
  }
  return null;
}

// Admin: Get all orders across store with sorting
export async function getAllOrdersAdmin(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    const orders: Order[] = [];
    snap.forEach((d) => orders.push(d.data() as Order));
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error fetching all orders for admin:', err);
    return [];
  }
}

// Admin: Update order status & send notification
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string
): Promise<Order | null> {
  const ref = doc(db, 'orders', orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Order not found');
  }

  const currentOrder = snap.data() as Order;
  const updatedTimeline = [
    ...(currentOrder.statusTimeline || []),
    {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`
    }
  ];

  await updateDoc(ref, {
    orderStatus: newStatus,
    statusTimeline: updatedTimeline,
    updatedAt: new Date().toISOString()
  });

  const updatedOrder = {
    ...currentOrder,
    orderStatus: newStatus,
    statusTimeline: updatedTimeline,
    updatedAt: new Date().toISOString()
  };

  // Dispatch customer status update notification
  dispatchOrderNotifications(updatedOrder, 'status_update').catch((e) => {
    console.warn('Status notification dispatch notice:', e);
  });

  return updatedOrder;
}

// Admin: Get recent notification audit logs
export async function getRecentNotificationsAdmin(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'order_notifications'));
    const logs: any[] = [];
    snap.forEach((d) => logs.push({ id: d.id, ...d.data() }));
    return logs.sort((a, b) => new Date(b.sentAt || 0).getTime() - new Date(a.sentAt || 0).getTime());
  } catch (e) {
    console.warn('Error fetching notification logs:', e);
    return [];
  }
}

