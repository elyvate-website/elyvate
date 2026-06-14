import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { form, items, total, couponCode, discountAmount } = await req.json()

    const productName = items.map((i: { name: string; quantity: number }) =>
      `${i.name} × ${i.quantity}`
    ).join(', ')

    const db = supabaseAdmin()

    // Save order to Supabase
    const { data: order, error } = await db
      .from('orders')
      .insert({
        customer_name:    form.name,
        customer_email:   form.email,
        customer_phone:   form.phone,
        customer_address: form.address,
        customer_city:    form.city,
        customer_country: form.country,
        customer_zip:     form.zip,
        product_id:       items[0]?.id ?? 'multi',
        product_name:     productName,
        quantity:         items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0),
        total_price:      total,
        payment_status:   'pending',
        order_status:     'processing',
        coupon_code:      couponCode ?? null,
        discount_amount:  discountAmount ?? 0,
      })
      .select()
      .single()

    if (error) throw error

    // Increment coupon usage count if a coupon was applied
    if (couponCode) {
      const { data: coupon } = await db
        .from('coupons')
        .select('usage_count')
        .eq('code', couponCode.toUpperCase())
        .single()

      if (coupon) {
        await db
          .from('coupons')
          .update({ usage_count: coupon.usage_count + 1 })
          .eq('code', couponCode.toUpperCase())
      }
    }

    // Build 2Checkout redirect URL
    const sellerId  = process.env.TWOCHECKOUT_SELLER_ID
    const appUrl    = process.env.NEXT_PUBLIC_APP_URL
    const returnUrl = encodeURIComponent(`${appUrl}/order-success?order=${order.id}`)
    const cancelUrl = encodeURIComponent(`${appUrl}/checkout`)

    const paymentUrl =
      `https://secure.2checkout.com/order/checkout.php` +
      `?PRODS=` + items.map((i: { id: string }) => i.id).join(',') +
      `&QTY=` + items.map((i: { quantity: number }) => i.quantity).join(',') +
      `&COUPON=&CART=1&CARD=1` +
      `&BACK_REF=${returnUrl}` +
      `&CANCEL_URL=${cancelUrl}` +
      `&ORDERFLD_orderId=${order.id}` +
      `&CURRENCY=USD` +
      `&LANGUAGE=en` +
      `&SID=${sellerId}`

    return NextResponse.json({ paymentUrl, orderId: order.id })
  } catch (err: unknown) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}
