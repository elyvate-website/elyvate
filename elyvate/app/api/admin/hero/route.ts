import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthed } from '@/lib/adminAuth'

export async function PUT(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = supabaseAdmin()

  const { data: existing } = await db.from('hero_section').select('id').limit(1).maybeSingle()

  const result = existing?.id
    ? await db.from('hero_section').update(body).eq('id', existing.id).select().single()
    : await db.from('hero_section').insert(body).select().single()

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ data: result.data })
}
