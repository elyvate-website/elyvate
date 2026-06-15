import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id    = searchParams.get('id')?.trim()
  const email = searchParams.get('email')?.trim().toLowerCase()

  if (!id || !email) return NextResponse.json({ error: 'Missing id or email' }, { status: 400 })

  const db = supabaseAdmin()

  // Try full UUID first, then short ID prefix match
  let query = db.from('orders').select(
    'id,customer_name,product_name,quantity,total_price,order_status,payment_status,tracking_number,tracking_carrier,created_at,fulfilled_at,customer_address,customer_city,customer_country,customer_zip'
  ).ilike('customer_email', email)

  // If looks like short ID (8 chars), search by prefix
  const isShortId = id.length <= 8
  const { data, error } = isShortId
    ? await query.ilike('id', `${id}%`)
    : await query.eq('id', id)

  if (error || !data || data.length === 0) {
    return NextResponse.json({ order: null }, { status: 404 })
  }

  return NextResponse.json({ order: data[0] })
}
