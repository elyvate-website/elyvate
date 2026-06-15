import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthed } from '@/lib/adminAuth'
import { Resend } from 'resend'

function unauth() { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return unauth()

  try {
    const { orderId, tracking_number, tracking_carrier, supplier_order_id, notes, customerEmail, customerName, productName } = await req.json()
    if (!orderId || !tracking_number) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const db = supabaseAdmin()

    await db.from('orders').update({
      order_status:      'shipped',
      tracking_number:   tracking_number.trim(),
      tracking_carrier:  tracking_carrier || null,
      supplier_order_id: supplier_order_id || null,
      notes:             notes || null,
      fulfilled_at:      new Date().toISOString(),
    }).eq('id', orderId)

    // Email customer with tracking info
    if (customerEmail && process.env.RESEND_API_KEY) {
      const resend   = new Resend(process.env.RESEND_API_KEY)
      const appUrl   = process.env.NEXT_PUBLIC_APP_URL
      const shortId  = orderId.slice(0, 8).toUpperCase()
      const trackUrl = `${appUrl}/track-order`

      await resend.emails.send({
        from:    `Elyvate <orders@${process.env.RESEND_DOMAIN ?? 'elyvate.com'}>`,
        to:      customerEmail,
        subject: `Your order #${shortId} has shipped! 📦`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
            <h1 style="font-size:24px;color:#1a1a1a;margin-bottom:8px">Your order is on its way! 🚀</h1>
            <p style="color:#666;margin-bottom:24px">Hi ${customerName}, great news — your order has been shipped!</p>

            <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">Order #${shortId}</p>
              <p style="margin:0;font-weight:600;font-size:16px;color:#1a1a1a">${productName}</p>
            </div>

            <div style="background:#eff6ff;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #dbeafe">
              <p style="margin:0 0 4px;color:#1e40af;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Tracking Number</p>
              <p style="margin:0;font-family:monospace;font-size:20px;font-weight:700;color:#1d4ed8">${tracking_number}</p>
              ${tracking_carrier ? `<p style="margin:4px 0 0;color:#3b82f6;font-size:13px">via ${tracking_carrier}</p>` : ''}
            </div>

            <a href="${trackUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:24px">
              Track My Order
            </a>

            <p style="color:#999;font-size:13px">Estimated delivery: 7–14 business days. If you have any questions, reply to this email or visit our <a href="${appUrl}/contact" style="color:#4f46e5">contact page</a>.</p>
            <p style="color:#ccc;font-size:12px;margin-top:32px">© ${new Date().getFullYear()} Elyvate · <a href="${appUrl}" style="color:#ccc">elyvate.com</a></p>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Fulfill error:', err)
    return NextResponse.json({ error: 'Failed to fulfill order' }, { status: 500 })
  }
}
