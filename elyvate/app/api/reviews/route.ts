import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) return NextResponse.json([], { status: 400 })
  const db = supabaseAdmin()
  const { data } = await db.from('reviews').select('*').eq('product_id', productId).eq('is_approved', true).order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  try {
    const { productId, authorName, rating, body } = await req.json()
    if (!productId || !authorName || !rating || !body) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    const db = supabaseAdmin()
    const { data, error } = await db.from('reviews').insert({
      product_id: productId,
      author_name: authorName.trim(),
      rating: parseInt(rating),
      body: body.trim(),
      is_approved: false, // admin approves
    }).select().single()
    if (error) throw error
    return NextResponse.json({ ok: true, id: data.id })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
