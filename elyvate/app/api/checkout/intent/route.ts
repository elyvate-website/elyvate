import { NextRequest, NextResponse } from 'next/server'
import { sendCheckoutIntentNotification } from '@/lib/resend'

// Fires when a customer clicks "Checkout" on the cart page —
// fire-and-forget: never blocks the customer from proceeding to checkout.
export async function POST(req: NextRequest) {
  try {
    const { items, total, customerEmail } = await req.json()

    if (!Array.isArray(items) || items.length === 0 || typeof total !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    await sendCheckoutIntentNotification({ items, total, customerEmail: customerEmail ?? null })

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Log but never fail the request — this should never block checkout
    console.error('Checkout intent email failed:', err)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
