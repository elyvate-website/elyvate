'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, HeroSection } from '@/lib/supabase'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function AdminHero() {
  const [hero, setHero] = useState<Partial<HeroSection>>({})
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('hero_section').select('*').single()
      .then(({ data }) => { if (data) setHero(data) })
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `hero/${Date.now()}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      setHero(h => ({ ...h, bg_image: publicUrl }))
      toast.success('Image uploaded!')
    } else toast.error('Upload failed')
    setUploading(false)
  }

  async function handleSave() {
    setSaving(true)
    const { data: existing } = await supabase.from('hero_section').select('id').single()
    if (existing?.id) {
      await supabase.from('hero_section').update(hero).eq('id', existing.id)
    } else {
      await supabase.from('hero_section').insert(hero)
    }
    setSaving(false)
    toast.success('Hero section saved!')
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Hero Section</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <div>
            <label className="label">Headline</label>
            <input
              className="input" placeholder="Elevate Your Space"
              value={hero.headline ?? ''}
              onChange={e => setHero(h => ({ ...h, headline: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Subheadline</label>
            <textarea
              className="input resize-none min-h-[80px]"
              placeholder="Premium ambient lighting..."
              value={hero.subheadline ?? ''}
              onChange={e => setHero(h => ({ ...h, subheadline: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">CTA Button Text</label>
              <input
                className="input" placeholder="Shop Now"
                value={hero.cta_text ?? ''}
                onChange={e => setHero(h => ({ ...h, cta_text: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">CTA Link</label>
              <input
                className="input" placeholder="/products"
                value={hero.cta_link ?? ''}
                onChange={e => setHero(h => ({ ...h, cta_link: e.target.value }))}
              />
            </div>
          </div>

          {/* Background image */}
          <div>
            <label className="label">Background Image</label>
            {hero.bg_image && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-3 bg-surface-100">
                <Image src={hero.bg_image} alt="Hero background" fill className="object-cover" />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              {uploading
                ? <span className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                : <Upload size={16} />
              }
              {hero.bg_image ? 'Replace Image' : 'Upload Image'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>

        {/* Preview */}
        <div>
          <p className="label mb-3">Live Preview</p>
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#070a0f] flex items-center">
            {hero.bg_image && (
              <Image src={hero.bg_image} alt="" fill className="object-cover opacity-70" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="relative z-10 p-6">
              <p className="text-brand-400 text-xs font-semibold tracking-widest uppercase mb-2">New Collection</p>
              <h2 className="font-display text-xl font-bold text-white mb-2">{hero.headline || 'Elevate Your Space'}</h2>
              <p className="text-white/70 text-xs mb-4 max-w-xs">{hero.subheadline || 'Your subheadline here...'}</p>
              <span className="bg-brand-600 text-white text-xs px-4 py-2 rounded-xl font-medium">
                {hero.cta_text || 'Shop Now'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
