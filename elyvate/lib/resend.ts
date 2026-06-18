import { Resend } from 'resend'
import { Order } from './supabase'

// Lazily create the client inside each call instead of at module load time.
// Creating it at the top of the file can run before Vercel's env vars are
// guaranteed to be attached, causing silent auth failures.
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is missing — check Vercel Environment Variables')
  }
  return new Resend(apiKey)
}

export async function sendAdminOrderNotification(order: Order) {
  const resend = getResendClient()
  const fromEmail  = process.env.RESEND_FROM_EMAIL
  const adminEmail = process.env.ADMIN_EMAIL

  if (!fromEmail) throw new Error('RESEND_FROM_EMAIL is missing in env vars')
  if (!adminEmail) throw new Error('ADMIN_EMAIL is missing in env vars')

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
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

  if (error) {
    console.error('Resend failed to send admin notification:', error)
    throw new Error(error.message)
  }
  return data
}

export async function sendCustomerConfirmation(order: Order) {
  const resend = getResendClient()
  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!fromEmail) throw new Error('RESEND_FROM_EMAIL is missing in env vars')

  const { data, error } = await resend.emails.send({
    from: fromEmail,
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

  if (error) {
    console.error('Resend failed to send customer confirmation:', error)
    throw new Error(error.message)
  }
  return data
}

// ─── NEW: Checkout Intent Notification ─────────────────────────────────────
// Fires the moment a customer clicks "Checkout" on the cart page —
// before they've filled in any details or paid. Lets you know someone
// is actively about to buy, in real time.
type CheckoutIntentPayload = {
  items: { name: string; price: number; quantity: number }[]
  total: number
  customerEmail?: string | null // only available if the user is logged in
}

export async function sendCheckoutIntentNotification(payload: CheckoutIntentPayload) {
  const resend = getResendClient()
  const fromEmail  = process.env.RESEND_FROM_EMAIL
  const adminEmail = process.env.ADMIN_EMAIL
  if (!fromEmail) throw new Error('RESEND_FROM_EMAIL is missing in env vars')
  if (!adminEmail) throw new Error('ADMIN_EMAIL is missing in env vars')

  const itemsHtml = payload.items.map(i => `
    <tr style="border-bottom:1px solid #eee;">
      <td style="padding:8px 0;">${i.name} × ${i.quantity}</td>
      <td style="padding:8px 0; text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `👀 Someone is checking out right now — $${payload.total.toFixed(2)}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A4DDE;">🔥 Live Checkout Started</h2>
        <p>A visitor just clicked <strong>Checkout</strong> on your store. They haven't paid yet, but here's what's in their cart:</p>

        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          ${itemsHtml}
          <tr>
            <td style="padding:10px 0; font-weight:bold;">Total</td>
            <td style="padding:10px 0; text-align:right; font-weight:bold;">$${payload.total.toFixed(2)}</td>
          </tr>
        </table>

        ${payload.customerEmail ? `<p style="color:#555;">Logged in as: <strong>${payload.customerEmail}</strong></p>` : `<p style="color:#999; font-size:13px;">Visitor is browsing as a guest — no email yet until they complete the form.</p>`}

        <p style="background:#eef2ff; padding:12px; border-radius:8px; color:#4A4DDE; font-size:13px;">
          This is just a heads-up — no action needed unless they complete the order.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error('Resend failed to send checkout intent notification:', error)
    throw new Error(error.message)
  }
  return data
}
