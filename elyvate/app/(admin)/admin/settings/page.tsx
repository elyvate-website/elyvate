'use client'
import { useEffect, useState } from 'react'
import { supabase, SiteSettings } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').single()
      .then(({ data }) => { if (data) setSettings(data) })
  }, [])

  async function handleSave() {
    setSaving(true)
    const { data: existing } = await supabase.from('site_settings').select('id').single()
    if (existing?.id) {
      await supabase.from('site_settings').update(settings).eq('id', existing.id)
    } else {
      await supabase.from('site_settings').insert(settings)
    }
    setSaving(false)
    toast.success('Settings saved!')
  }

  const update = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings(s => ({ ...s, [k]: e.target.value }))

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Settings</h1>

      <div className="bg-white rounded-2xl shadow-card p-6 max-w-2xl space-y-6">
        {/* Store */}
        <div>
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Store</p>
          <div className="space-y-4">
            <div>
              <label className="label">Store Name</label>
              <input className="input" value={settings.store_name ?? ''} onChange={update('store_name')} placeholder="Elyvate" />
            </div>
            <div>
              <label className="label">Logo URL (optional)</label>
              <input className="input" value={settings.logo_url ?? ''} onChange={update('logo_url')} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Announcement */}
        <div className="border-t border-surface-200 pt-6">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Announcement Bar</p>
          <div className="space-y-4">
            <div>
              <label className="label">Announcement Text</label>
              <input className="input" value={settings.announcement_text ?? ''} onChange={update('announcement_text')} placeholder="Free shipping on all orders! 🚀" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-brand-600"
                checked={settings.announcement_active ?? false}
                onChange={e => setSettings(s => ({ ...s, announcement_active: e.target.checked }))}
              />
              <span className="text-sm font-medium text-ink-primary">Show announcement bar</span>
            </label>
          </div>
        </div>

        {/* Social */}
        <div className="border-t border-surface-200 pt-6">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Social Links</p>
          <div className="space-y-4">
            <div>
              <label className="label">Instagram URL</label>
              <input className="input" value={settings.instagram_url ?? ''} onChange={update('instagram_url')} placeholder="https://instagram.com/elyvate" />
            </div>
            <div>
              <label className="label">TikTok URL</label>
              <input className="input" value={settings.tiktok_url ?? ''} onChange={update('tiktok_url')} placeholder="https://tiktok.com/@elyvate" />
            </div>
            <div>
              <label className="label">Facebook URL</label>
              <input className="input" value={settings.facebook_url ?? ''} onChange={update('facebook_url')} placeholder="https://facebook.com/elyvate" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
