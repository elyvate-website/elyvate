import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { name, email, orderId, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (process.env.RESEND_API_KEY) {
      const resend  = new Resend(process.env.RESEND_API_KEY)
      const appUrl  = process.env.NEXT_PUBLIC_APP_URL

      // Email to you (store owner)
      await resend.emails.send({
        from:    `Elyvate Contact <onboarding@resend.dev>`,
        to:      process.env.ADMIN_EMAIL ?? 'support@elyvate.com',
        subject: `New Contact Message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
            <h2 style="color:#1a1a1a">New Contact Message</h2>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:8px;color:#666;width:120px">Name</td><td style="padding:8px;font-weight:600">${name}</td></tr>
              <tr style="background:#f8f8f8"><td style="padding:8px;color:#666">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
              ${orderId ? `<tr><td style="padding:8px;color:#666">Order ID</td><td style="padding:8px;font-family:monospace">#${orderId.toUpperCase()}</td></tr>` : ''}
              <tr style="background:#f8f8f8"><td style="padding:8px;color:#666;vertical-align:top">Message</td><td style="padding:8px">${message.replace(/\n/g, '<br/>')}</td></tr>
            </table>
            <a href="mailto:${email}?subject=Re: Your Elyvate enquiry" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Reply to ${name}</a>
          </div>
        `,
      })

      // Auto-reply to customer
      await resend.emails.send({
        from:    `Elyvate Support <onboarding@resend.dev>`,
        to:      email,
        subject: `We received your message — Elyvate`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
            <h2 style="color:#1a1a1a">Thanks for reaching out, ${name}!</h2>
            <p style="color:#666">We've received your message and will get back to you within 24 hours.</p>
            <div style="background:#f8f8f8;border-radius:12px;padding:16px;margin:20px 0">
              <p style="margin:0;color:#888;font-size:13px">Your message:</p>
              <p style="margin:8px 0 0;color:#333">${message.replace(/\n/g, '<br/>')}</p>
            </div>
            <p style="color:#999;font-size:13px">— The Elyvate Team</p>
            <p style="color:#ccc;font-size:12px;margin-top:32px">© ${new Date().getFullYear()} Elyvate · <a href="${appUrl}" style="color:#ccc">elyvate.com</a></p>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
