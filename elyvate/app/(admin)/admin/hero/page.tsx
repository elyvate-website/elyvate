'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, HeroSection } from '@/lib/supabase'
import { Upload, Monitor, Smartphone, Video } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function AdminHero() {
  const [hero, setHero] = useState<Partial<HeroSection>>({})
  const [uploadingDesktop, setUploadingDesktop] = useState(false)
  const [uploadingMobile, setUploadingMobile] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const fileRefMobile = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('hero_section').select('*').single()
      .then(({ data }) => { if (data) setHero(data) })
  }, [])

  async function uploadImage(file: File, field: 'bg_image' | 'bg_image_mobile') {
    const setUploading = field === 'bg_image' ? setUploadingDesktop : setUploadingMobile
    setUploading(true)

    const formData = new FormData()
    formData.append('files', file)
    formData.append('folder', 'hero')

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setHero(h => ({ ...h, [field]: data.urls[0] }))
      toast.success('Image uploaded!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function handleDesktopUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadImage(file, 'bg_image')
  }

  function handleMobileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadImage(file, 'bg_image_mobile')
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.success('Hero section saved!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Hero Section</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {/* Desktop Background */}
          <div className="border-t border-surface-200 pt-5">
            <label className="label flex items-center gap-2">
              <Monitor size={14} />
              Desktop / Laptop Banner
            </label>

            {hero.bg_image && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-3 bg-surface-100">
                <Image src={hero.bg_image} alt="Desktop hero background" fill className="object-cover" />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingDesktop}
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              {uploadingDesktop
                ? <span className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                : <Upload size={16} />
              }
              {hero.bg_image ? 'Replace Image' : 'Upload Image'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleDesktopUpload} />
            <p className="text-xs text-ink-muted mt-1.5 mb-3">Recommended: 1920×1080px or larger, landscape</p>

            {/* Desktop video URL */}
            <label className="label flex items-center gap-2 mt-3">
              <Video size={14} />
              Video URL (optional)
            </label>
            <input
              className="input" placeholder="https://example.com/banner.mp4"
              value={hero.bg_video ?? ''}
              onChange={e => setHero(h => ({ ...h, bg_video: e.target.value }))}
            />
            <p className="text-xs text-ink-muted mt-1.5">
              If set, this video plays instead of the image above. Use a direct .mp4 link (e.g. from Supabase Storage or a CDN). The image above is used as a poster/fallback.
            </p>
          </div>

          {/* Mobile Background */}
          <div className="border-t border-surface-200 pt-5">
            <label className="label flex items-center gap-2">
              <Smartphone size={14} />
              Mobile Banner
            </label>

            {hero.bg_image_mobile && (
              <div className="relative w-full max-w-[180px] aspect-[9/16] rounded-2xl overflow-hidden mb-3 bg-surface-100">
                <Image src={hero.bg_image_mobile} alt="Mobile hero background" fill className="object-cover" />
              </div>
            )}
            <button
              onClick={() => fileRefMobile.current?.click()}
              disabled={uploadingMobile}
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              {uploadingMobile
                ? <span className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                : <Upload size={16} />
              }
              {hero.bg_image_mobile ? 'Replace Image' : 'Upload Image'}
            </button>
            <input ref={fileRefMobile} type="file" accept="image/*" className="hidden" onChange={handleMobileUpload} />
            <p className="text-xs text-ink-muted mt-1.5 mb-3">Recommended: 1080×1920px (9:16), subject centered. Falls back to desktop image if not set.</p>

            {/* Mobile video URL */}
            <label className="label flex items-center gap-2 mt-3">
              <Video size={14} />
              Video URL (optional)
            </label>
            <input
              className="input" placeholder="https://example.com/banner-mobile.mp4"
              value={hero.bg_video_mobile ?? ''}
              onChange={e => setHero(h => ({ ...h, bg_video_mobile: e.target.value }))}
            />
            <p className="text-xs text-ink-muted mt-1.5">
              Falls back to the desktop video if not set.
            </p>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Desktop preview */}
          <div>
            <p className="label mb-3 flex items-center gap-2">
              <Monitor size={14} />
              Desktop Preview
            </p>
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#070a0f] flex items-center">
              {hero.bg_video ? (
                <video
                  src={hero.bg_video}
                  poster={hero.bg_image || undefined}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
              ) : hero.bg_image ? (
                <Image src={hero.bg_image} alt="" fill className="object-cover opacity-70" />
              ) : null}
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

          {/* Mobile preview */}
          <div>
            <p className="label mb-3 flex items-center gap-2">
              <Smartphone size={14} />
              Mobile Preview
            </p>
            <div className="relative rounded-2xl overflow-hidden aspect-[9/16] max-w-[220px] bg-[#070a0f] flex items-end">
              {(hero.bg_video_mobile || hero.bg_video) ? (
                <video
                  src={(hero.bg_video_mobile || hero.bg_video) as string}
                  poster={(hero.bg_image_mobile || hero.bg_image) || undefined}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
              ) : (hero.bg_image_mobile || hero.bg_image) ? (
                <Image src={(hero.bg_image_mobile || hero.bg_image) as string} alt="" fill className="object-cover opacity-70" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 p-4 pb-8">
                <p className="text-brand-400 text-[10px] font-semibold tracking-widest uppercase mb-1.5">New Collection</p>
                <h2 className="font-display text-base font-bold text-white mb-1.5 leading-tight">{hero.headline || 'Elevate Your Space'}</h2>
                <span className="inline-block bg-brand-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-medium">
                  {hero.cta_text || 'Shop Now'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
