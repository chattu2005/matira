import express, { Request, Response } from 'express';
import { BUSINESS_INFO, generateOrderEmailHtml } from '../services/notificationService';

export const apiRouter = express.Router();
apiRouter.use(express.json());

// Server health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'MATIRA Natural Foods',
    service: 'Pure Indian Grocery & Spices E-Commerce API',
    timestamp: new Date().toISOString()
  });
});

// Server-side coupon verification
apiRouter.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    res.status(400).json({ valid: false, error: 'Coupon code is required' });
    return;
  }

  const cleanCode = String(code).trim().toUpperCase();
  const orderSubtotal = Number(subtotal) || 0;

  if (cleanCode === 'WELCOME10') {
    if (orderSubtotal < 499) {
      res.json({ valid: false, error: 'Minimum order amount for WELCOME10 is ₹499' });
      return;
    }
    const discount = Math.min(Math.round((orderSubtotal * 10) / 100), 150);
    res.json({
      valid: true,
      discount,
      code: 'WELCOME10',
      message: '10% discount applied (up to ₹150)'
    });
    return;
  }

  if (cleanCode === 'MATIRA100') {
    if (orderSubtotal < 999) {
      res.json({ valid: false, error: 'Minimum order amount for MATIRA100 is ₹999' });
      return;
    }
    res.json({
      valid: true,
      discount: 100,
      code: 'MATIRA100',
      message: 'Flat ₹100 discount applied'
    });
    return;
  }

  res.json({ valid: false, error: 'Invalid or expired coupon code' });
});

// Server-side notification dispatcher (Mailjet, Bird Email & WhatsApp Cloud API)
apiRouter.post('/notifications/dispatch', async (req: Request, res: Response) => {
  try {
    const { order, type } = req.body;
    
    if (!order || !order.id) {
      res.status(400).json({ success: false, error: 'Missing order details' });
      return;
    }

    const mailjetKey = process.env.MAILJET_API_KEY;
    const mailjetSecret = process.env.MAILJET_SECRET_KEY;
    const emailApiKey = process.env.EMAIL_SERVICE_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'orders@matira.in';
    const adminNotificationEmail = process.env.EMAIL_NOTIFICATION_TO || BUSINESS_INFO.adminEmail;
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    const results: {
      customerEmail?: { status: string; error?: string };
      adminEmail?: { status: string; error?: string };
      adminWhatsApp?: { status: string; error?: string };
    } = {};

    const emailHtml = generateOrderEmailHtml(order, type || 'confirmation');
    const adminEmailHtml = generateOrderEmailHtml(order, 'admin_alert');

  // Helper to send email via Mailjet v3.1
  const sendViaMailjet = async (toEmail: string, toName: string, subject: string, html: string) => {
    const authHeader = 'Basic ' + Buffer.from(`${mailjetKey}:${mailjetSecret}`).toString('base64');
    const res = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: emailFrom, Name: 'MATIRA Pure Indian Grocery & Spices' },
            To: [{ Email: toEmail, Name: toName }],
            Subject: subject,
            HTMLPart: html
          }
        ]
      })
    });
    return res;
  };

  // 1. Send customer email (Mailjet or Bird)
  if (order.customerEmail) {
    if (mailjetKey && mailjetSecret) {
      try {
        const mjRes = await sendViaMailjet(
          order.customerEmail,
          order.customerName || 'Customer',
          `MATIRA Order ${order.orderNumber} Confirmation`,
          emailHtml
        );
        if (mjRes.ok) {
          results.customerEmail = { status: 'sent' };
        } else {
          const errText = await mjRes.text();
          results.customerEmail = { status: 'failed', error: errText };
        }
      } catch (e: any) {
        results.customerEmail = { status: 'failed', error: e.message };
      }
    } else if (emailApiKey) {
      try {
        const birdRes = await fetch('https://api.bird.com/workspaces/current/channels/email/messages', {
          method: 'POST',
          headers: {
            'Authorization': `AccessKey ${emailApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            receiver: { contacts: [{ identifierValue: order.customerEmail }] },
            body: {
              type: 'html',
              html: {
                text: emailHtml,
                subject: `MATIRA Order ${order.orderNumber} Confirmation`
              }
            },
            from: emailFrom
          })
        });
        if (birdRes.ok) {
          results.customerEmail = { status: 'sent' };
        } else {
          const errText = await birdRes.text();
          results.customerEmail = { status: 'failed', error: errText };
        }
      } catch (e: any) {
        results.customerEmail = { status: 'failed', error: e.message };
      }
    } else {
      results.customerEmail = {
        status: 'unconfigured',
        error: 'MAILJET_API_KEY/SECRET or EMAIL_SERVICE_API_KEY not set (optional)'
      };
    }
  }

  // 2. Send admin alert email (Mailjet or Bird)
  if (mailjetKey && mailjetSecret) {
    try {
      const mjAdminRes = await sendViaMailjet(
        adminNotificationEmail,
        'MATIRA Store Admin',
        `[ADMIN ALERT] New MATIRA Order ${order.orderNumber} (₹${order.total})`,
        adminEmailHtml
      );
      if (mjAdminRes.ok) {
        results.adminEmail = { status: 'sent' };
      } else {
        const errText = await mjAdminRes.text();
        results.adminEmail = { status: 'failed', error: errText };
      }
    } catch (e: any) {
      results.adminEmail = { status: 'failed', error: e.message };
    }
  } else if (emailApiKey) {
    try {
      const birdAdminRes = await fetch('https://api.bird.com/workspaces/current/channels/email/messages', {
        method: 'POST',
        headers: {
          'Authorization': `AccessKey ${emailApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver: { contacts: [{ identifierValue: adminNotificationEmail }] },
          body: {
            type: 'html',
            html: {
              text: adminEmailHtml,
              subject: `[ADMIN ALERT] New MATIRA Order ${order.orderNumber} (₹${order.total})`
            }
          },
          from: emailFrom
        })
      });

      if (birdAdminRes.ok) {
        results.adminEmail = { status: 'sent' };
      } else {
        const errText = await birdAdminRes.text();
        results.adminEmail = { status: 'failed', error: errText };
      }
    } catch (e: any) {
      results.adminEmail = { status: 'failed', error: e.message };
    }
  } else {
    results.adminEmail = {
      status: 'unconfigured',
      error: 'MAILJET_API_KEY/SECRET or EMAIL_SERVICE_API_KEY not set (optional)'
    };
  }

  // 3. Send WhatsApp Alert via Meta WhatsApp Cloud API if configured
  if (whatsappToken && whatsappPhoneId) {
    try {
      const whatsappBody = `*New MATIRA Order ${order.orderNumber}*\nCustomer: ${order.customerName}\nTotal: ₹${order.total}\nPayment: ${order.paymentMethod.toUpperCase()}\nItems: ${order.items.length}\nDeliver to: ${order.deliveryAddress.city}, ${order.deliveryAddress.state}`;

      const waRes = await fetch(`https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: '919330713861',
          type: 'text',
          text: { body: whatsappBody }
        })
      });

      if (waRes.ok) {
        results.adminWhatsApp = { status: 'sent' };
      } else {
        const errText = await waRes.text();
        results.adminWhatsApp = { status: 'failed', error: errText };
      }
    } catch (e: any) {
      results.adminWhatsApp = { status: 'failed', error: e.message };
    }
  } else {
    results.adminWhatsApp = {
      status: 'unconfigured',
      error: 'WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set'
    };
  }

    // Safe response: notification failures never crash the order!
    res.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      notifications: results
    });
  } catch (err: any) {
    console.error('[MATIRA Server] Notification dispatch handler error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Notification dispatch error' });
  }
});

// Admin verification endpoint
apiRouter.post('/admin/verify', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ authorized: false, error: 'Email is required' });
    return;
  }

  const isAuthorized = String(email).trim().toLowerCase() === BUSINESS_INFO.adminEmail.toLowerCase();
  res.json({
    authorized: isAuthorized,
    email: email,
    role: isAuthorized ? 'super_admin' : 'customer'
  });
});
