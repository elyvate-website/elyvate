import { Resend } from 'resend'
import { Order } from './supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAdminOrderNotification(order: Order) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.ADMIN_EMAIL!,
    subject: `🛒 New Order #${order.id.slice(0, 8).toUpperCase()} — ${order.product_name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A4DDE;">New Order Received — Elyvate</h2>
        <p>You have a new order that needs to be fulfilled on CJ Dropshipping.</p>

        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background:#f5f5f5;">
            <td style="padding:10px; font-weight:bold;">Order ID</td>
            <td style="padding:10px;">#${order.id.slice(0, 8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding:10px; font-weight:bold;">Product</td>
            <td style="padding:10px;">${order.product_name}</td>
          </tr>
          <tr style="background:#f5f5f5;">
            <td style="padding:10px; font-weight:bold;">Quantity</td>
            <td style="padding:10px;">${order.quantity}</td>
          </tr>
          <tr>
            <td style="padding:10px; font-weight:bold;">Total Paid</td>
            <td style="padding:10px;">$${order.total_price.toFixed(2)}</td>
          </tr>
        </table>

        <h3 style="color: #333;">📦 Ship To:</h3>
        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background:#f5f5f5;">
            <td style="padding:10px; font-weight:bold;">Name</td>
            <td style="padding:10px;">${order.customer_name}</td>
          </tr>
          <tr>
            <td style="padding:10px; font-weight:bold;">Email</td>
            <td style="padding:10px;">${order.customer_email}</td>
          </tr>
          <tr style="background:#f5f5f5;">
            <td style="padding:10px; font-weight:bold;">Phone</td>
            <td style="padding:10px;">${order.customer_phone}</td>
          </tr>
          <tr>
            <td style="padding:10px; font-weight:bold;">Address</td>
            <td style="padding:10px;">${order.customer_address}</td>
          </tr>
          <tr style="background:#f5f5f5;">
            <td style="padding:10px; font-weight:bold;">City</td>
            <td style="padding:10px;">${order.customer_city}</td>
          </tr>
          <tr>
            <td style="padding:10px; font-weight:bold;">Country</td>
            <td style="padding:10px;">${order.customer_country}</td>
          </tr>
          <tr style="background:#f5f5f5;">
            <td style="padding:10px; font-weight:bold;">ZIP</td>
            <td style="padding:10px;">${order.customer_zip}</td>
          </tr>
        </table>

        <p style="background:#fff3cd; padding:12px; border-radius:8px;">
          ⚡ <strong>Action Required:</strong> Log into CJ Dropshipping and place this order manually using the customer address above.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders" 
           style="display:inline-block; background:#4A4DDE; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; margin-top:10px;">
          View in Admin Panel
        </a>
      </div>
    `,
  })
}

export async function sendCustomerConfirmation(order: Order) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: order.customer_email,
    subject: `✨ Order Confirmed — Elyvate #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A4DDE;">Thank you for your order, ${order.customer_name}!</h2>
        <p>We've received your order and it's being processed. You'll receive a shipping update soon.</p>

        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background:#f5f5f5;">
            <td style="padding:10px; font-weight:bold;">Order ID</td>
            <td style="padding:10px;">#${order.id.slice(0, 8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding:10px; font-weight:bold;">Product</td>
            <td style="padding:10px;">${order.product_name}</td>
          </tr>
          <tr style="background:#f5f5f5;">
            <td style="padding:10px; font-weight:bold;">Quantity</td>
            <td style="padding:10px;">${order.quantity}</td>
          </tr>
          <tr>
            <td style="padding:10px; font-weight:bold;">Total</td>
            <td style="padding:10px;">$${order.total_price.toFixed(2)}</td>
          </tr>
        </table>

        <p>Estimated delivery: <strong>7–14 business days</strong></p>
        <p style="color:#555;">If you have any questions, reply to this email and we'll help you out.</p>

        <p style="margin-top:30px; color:#999; font-size:12px;">
          © ${new Date().getFullYear()} Elyvate. All rights reserved.
        </p>
      </div>
    `,
  })
}
