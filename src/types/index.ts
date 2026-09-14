export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  price: number; // e.g. 500 for Cumin per kg
  compareAtPrice?: number;
  discountPercentage?: number;
  weight: string; // e.g. "1 kg", "500g", "250g"
  sku: string;
  stockQuantity: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew?: boolean;
  isActive: boolean;
  ingredients?: string;
  benefits?: string[];
  storageInfo?: string;
  storageInstructions?: string;
  description?: string;
  usageInfo?: string;
  shippingInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryAddress {
  id?: string;
  customerId?: string;
  fullName: string;
  phone?: string;
  phoneNumber?: string;
  addressLine?: string;
  addressLine1?: string;
  addressLine2?: string;
  apartment?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedWeight?: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  weight: string;
  subtotal?: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  couponDiscount?: number;
  appliedCoupon?: Coupon;
  shipping?: number;
  shippingFee?: number;
  total: number;
  grandTotal?: number;
  paymentMethod: 'cod' | 'online_gateway' | 'online' | 'upi';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  orderStatus?: OrderStatus;
  status?: OrderStatus;
  trackingNumber?: string;
  couponCode?: string;
  statusTimeline?: OrderTimelineEvent[];
  orderNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  timesUsed?: number;
  usageCount?: number;
  isActive: boolean;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt?: string;
}

export interface SiteContent {
  id: string;
  announcementText: string;
  heroHeading: string;
  heroSubheading: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  whatsappNumber: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  updatedAt?: string;
}

export interface NotificationLog {
  id: string;
  orderId: string;
  type: 'email_customer' | 'email_admin' | 'whatsapp_customer' | 'whatsapp_admin';
  recipient: string;
  status: 'sent' | 'failed' | 'unconfigured';
  error?: string;
  sentAt: string;
}
