import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthed } from '@/lib/adminAuth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const files = formData.getAll('files') as File[]
  const folder = (formData.get('folder') as string) || 'products'

  if (!files.length) return NextResponse.json({ error: 'No files provided' }, { status: 400 })

  const db = supabaseAdmin()
  const urls: string[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await db.storage.from('product-images').upload(path, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    })

    if (error) {
      return NextResponse.json(
        { error: `Upload failed: ${error.message}. Make sure a Storage bucket named "product-images" exists in Supabase (Storage → New Bucket → set Public ON).` },
        { status: 500 }
      )
    }

    const { data } = db.storage.from('product-images').getPublicUrl(path)
    urls.push(data.publicUrl)
  }

  return NextResponse.json({ urls })
}
