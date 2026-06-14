import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendAdminOrderNotification, sendCustomerConfirmation } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 2Checkout sends order reference and custom fields
    const orderId = body.ORDERFLD_orderId || body.orderId
    const ref     = body.REFNO || body.reference

    if (!orderId) return NextResponse.json({ ok: false }, { status: 400 })

    const db = supabaseAdmin()

    // Update order payment status
    const { data: order, error } = await db
      .from('orders')
      .update({
        payment_status:   'paid',
        order_status:     'processing',
        twocheckout_ref:  ref ?? null,
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error || !order) throw error || new Error('Order not found')

    // Send both emails
    await Promise.all([
      sendAdminOrderNotification(order),
      sendCustomerConfirmation(order),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
