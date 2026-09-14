import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, NotificationLog } from '../types';

export const BUSINESS_INFO = {
  name: 'MATIRA Natural Foods',
  tagline: 'Pure Indian Grocery & Spices',
  address: 'Little Complex, Lalkuthi, Newtown, Kolkata - 700136',
  phone: '+91 9330713861',
  email: 'chattu1904@gmail.com',
  adminEmail: 'chattu1904@gmail.com',
  orderNotificationEmail: 'chattu1904@gmail.com',
  emailFrom: 'orders@matira.in',
  whatsappNumber: '+919330713861'
};

// Generates branded HTML email for order events
export function generateOrderEmailHtml(order: Order, type: 'confirmation' | 'status_update' | 'admin_alert'): string {
  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E7E2D9; font-size: 14px; color: #1C1917;">
          <strong>${item.name}</strong><br/>
          <span style="font-size: 12px; color: #78716C;">Size/Weight: ${item.weight} | Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E7E2D9; font-size: 14px; text-align: right; color: #1C1917;">
          ₹${item.subtotal.toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  let headerTitle = 'Order Confirmed!';
  let headerSubtitle = 'Thank you for choosing pure, natural ingredients from MATIRA.';

  if (type === 'status_update') {
    headerTitle = `Order Status: ${order.orderStatus}`;
    headerSubtitle = `Your order ${order.orderNumber} status has been updated.`;
  } else if (type === 'admin_alert') {
    headerTitle = `[ADMIN] New Order: ${order.orderNumber}`;
    headerSubtitle = `A new order worth ₹${order.total.toLocaleString('en-IN')} was placed by ${order.customerName}.`;
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>MATIRA Natural Foods</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #1C1917;">
    <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E7E2D9; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
      
      <!-- Brand Header -->
      <div style="background-color: #1A362B; padding: 32px 24px; text-align: center; color: #FFFFFF;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 700; color: #EAD098;">MATIRA</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; letter-spacing: 1px; color: #D1E0D7; text-transform: uppercase;">Pure Indian Grocery & Spices</p>
      </div>

      <!-- Content Area -->
      <div style="padding: 32px 24px;">
        <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #1A362B;">${headerTitle}</h2>
        <p style="margin: 0 0 24px 0; font-size: 14px; color: #57534E; line-height: 1.5;">${headerSubtitle}</p>

        <!-- Order Metadata Card -->
        <div style="background: #F5F2EC; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <table style="width: 100%; font-size: 13px; color: #44403C;">
            <tr>
              <td style="padding: 4px 0;"><strong>Order ID:</strong></td>
              <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #1A362B;">${order.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Date:</strong></td>
              <td style="padding: 4px 0; text-align: right;">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Payment Method:</strong></td>
              <td style="padding: 4px 0; text-align: right; text-transform: uppercase;">${order.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Online / UPI'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>Status:</strong></td>
              <td style="padding: 4px 0; text-align: right; color: #15803D; font-weight: 600;">${order.orderStatus}</td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <h3 style="font-size: 16px; color: #1C1917; margin: 0 0 12px 0;">Ordered Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background: #FAF8F5; border-bottom: 2px solid #E7E2D9;">
              <th style="padding: 8px; text-align: left; font-size: 12px; color: #78716C; text-transform: uppercase;">Product</th>
              <th style="padding: 8px; text-align: right; font-size: 12px; color: #78716C; text-transform: uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="border-top: 1px solid #E7E2D9; padding-top: 16px; margin-bottom: 24px;">
          <table style="width: 100%; font-size: 14px; color: #44403C;">
            <tr>
              <td style="padding: 4px 0;">Subtotal:</td>
              <td style="padding: 4px 0; text-align: right;">₹${order.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            ${
              order.discount > 0
                ? `<tr>
                    <td style="padding: 4px 0; color: #15803D;">Coupon Discount:</td>
                    <td style="padding: 4px 0; text-align: right; color: #15803D;">-₹${order.discount.toLocaleString('en-IN')}</td>
                  </tr>`
                : ''
            }
            <tr>
              <td style="padding: 4px 0;">Delivery / Shipping:</td>
              <td style="padding: 4px 0; text-align: right;">${order.shipping === 0 ? '<span style="color: #15803D;">FREE</span>' : `₹${order.shipping}`}</td>
            </tr>
            <tr style="font-size: 16px; font-weight: 700; color: #1A362B; border-top: 1px solid #E7E2D9;">
              <td style="padding: 12px 0 4px 0;">Grand Total:</td>
              <td style="padding: 12px 0 4px 0; text-align: right;">₹${order.total.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <!-- Delivery Address -->
        <div style="background: #FAF8F5; border: 1px solid #E7E2D9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1A362B;">Delivery Address</h4>
          <p style="margin: 0; font-size: 13px; color: #57534E; line-height: 1.6;">
            <strong>${order.deliveryAddress.fullName}</strong><br/>
            ${order.deliveryAddress.apartment ? order.deliveryAddress.apartment + ', ' : ''}${order.deliveryAddress.addressLine}<br/>
            ${order.deliveryAddress.landmark ? 'Landmark: ' + order.deliveryAddress.landmark + '<br/>' : ''}
            ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pinCode}<br/>
            Phone: ${order.deliveryAddress.phone}
          </p>
        </div>

        <!-- Help Notice -->
        <p style="font-size: 13px; color: #78716C; text-align: center; margin: 24px 0 0 0;">
          Need help? WhatsApp us at <a href="https://wa.me/919330713861" style="color: #1A362B; font-weight: 600; text-decoration: none;">+91 9330713861</a> or email <a href="mailto:chattu1904@gmail.com" style="color: #1A362B; text-decoration: none;">chattu1904@gmail.com</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #F5F2EC; border-top: 1px solid #E7E2D9; padding: 20px; text-align: center; font-size: 12px; color: #78716C;">
        <p style="margin: 0 0 4px 0; font-weight: 600; color: #44403C;">MATIRA Natural Foods</p>
        <p style="margin: 0;">Little Complex, Lalkuthi, Newtown, Kolkata - 700136</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

// Log notification safely to Firestore
export async function logNotificationEvent(log: Omit<NotificationLog, 'id'>): Promise<void> {
  try {
    await addDoc(collection(db, 'order_notifications'), {
      ...log,
      sentAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[MATIRA] Safe notification log write error:', err);
  }
}

// Dispatches order notifications via Server API or safe fallback
export async function dispatchOrderNotifications(order: Order, type: 'confirmation' | 'status_update'): Promise<void> {
  // Call server-side notification endpoint
  try {
    const res = await fetch('/api/notifications/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order.id, type })
    });
    if (res.ok) {
      console.log(`[MATIRA] Server notification triggered successfully for order ${order.orderNumber}`);
      return;
    }
  } catch (e) {
    console.warn('[MATIRA] Server notification route unreachable, logging locally:', e);
  }

  // Fallback audit log in Firestore
  await logNotificationEvent({
    orderId: order.id,
    type: 'email_customer',
    recipient: order.customerEmail,
    status: 'unconfigured',
    error: 'Ready for Bird API credentials in server environment',
    sentAt: new Date().toISOString()
  });

  await logNotificationEvent({
    orderId: order.id,
    type: 'email_admin',
    recipient: BUSINESS_INFO.adminEmail,
    status: 'unconfigured',
    error: 'Ready for Bird API credentials in server environment',
    sentAt: new Date().toISOString()
  });

  await logNotificationEvent({
    orderId: order.id,
    type: 'whatsapp_admin',
    recipient: BUSINESS_INFO.whatsappNumber,
    status: 'unconfigured',
    error: 'Ready for WhatsApp Cloud API token in server environment',
    sentAt: new Date().toISOString()
  });
}
