'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase, Product } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X, Upload, Star, GripVertical, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

const EMPTY: Partial<Product> = {
  name: '', slug: '', description: '', bullet_points: [],
  price: 0, compare_price: null, images: [], category: '',
  stock_status: 'in_stock', is_featured: false, rating: 0, review_count: 0,
}

export default function AdminProducts() {
  const [products, setProducts]   = useState<Product[]>([])
  const [modal, setModal]         = useState(false)
  const [editing, setEditing]     = useState<Partial<Product>>(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [newBullet, setNewBullet] = useState('')
  const fileRef    = useRef<HTMLInputElement>(null)
  const bulletRef  = useRef<HTMLInputElement>(null)

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data ?? [])
  }

  useEffect(() => { load() }, [])

  function openNew() { setEditing(EMPTY); setNewBullet(''); setModal(true) }
  function openEdit(p: Product) { setEditing({ ...p, bullet_points: p.bullet_points ?? [] }); setNewBullet(''); setModal(true) }

  // ── Bullet helpers ────────────────────────────────────────────
  function addBullet() {
    const text = newBullet.trim()
    if (!text) return
    setEditing(e => ({ ...e, bullet_points: [...(e.bullet_points ?? []), text] }))
    setNewBullet('')
    bulletRef.current?.focus()
  }

  function removeBullet(idx: number) {
    setEditing(e => ({ ...e, bullet_points: (e.bullet_points ?? []).filter((_, i) => i !== idx) }))
  }

  function editBullet(idx: number, val: string) {
    setEditing(e => {
      const arr = [...(e.bullet_points ?? [])]
      arr[idx] = val
      return { ...e, bullet_points: arr }
    })
  }

  function moveBullet(idx: number, dir: -1 | 1) {
    setEditing(e => {
      const arr = [...(e.bullet_points ?? [])]
      const swap = idx + dir
      if (swap < 0 || swap >= arr.length) return e;
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]]
      return { ...e, bullet_points: arr }
    })
  }

  // ── Image upload ──────────────────────────────────────────────
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    formData.append('folder', 'products')
    try {
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setEditing(prev => ({ ...prev, images: [...(prev.images ?? []), ...data.urls] }))
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally { setUploading(false) }
  }

  function removeImage(idx: number) {
    setEditing(e => ({ ...e, images: (e.images ?? []).filter((_, i) => i !== idx) }))
  }

  // ── Save ──────────────────────────────────────────────────────
  async function handleSave() {
    if (!editing.name || !editing.slug || !editing.price) {
      toast.error('Name, slug and price are required'); return
    }
    try {
      const isEdit = !!editing.id
      const res = await fetch('/api/admin/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, bullet_points: editing.bullet_points ?? [] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.success(isEdit ? 'Product updated!' : 'Product added!')
      setModal(false); load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    try {
      const res  = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      toast.success('Deleted'); load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  function slugify(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const bullets = editing.bullet_points ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {products.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-ink-muted text-sm">No products yet. Add your first product!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50">
                <tr>
                  {['Product', 'Price', 'Category', 'Stock', 'Featured', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] && (
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-surface-100 shrink-0">
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-ink-primary">{p.name}</p>
                          <p className="text-ink-muted text-xs">{p.slug}</p>
                          {(p.bullet_points?.length ?? 0) > 0 && (
                            <p className="text-xs text-brand-600 mt-0.5">{p.bullet_points.length} bullet point{p.bullet_points.length !== 1 ? 's' : ''}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold">${p.price.toFixed(2)}</td>
                    <td className="px-5 py-3 text-ink-secondary capitalize">{p.category || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-medium ${p.stock_status === 'in_stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {p.is_featured && <Star size={14} className="text-amber-400 fill-amber-400" />}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-xl hover:bg-surface-100 text-ink-secondary hover:text-ink-primary transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl hover:bg-red-50 text-ink-secondary hover:text-red-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-surface-200 sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="font-display text-xl font-semibold">{editing.id ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-surface-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Images */}
              <div>
                <label className="label">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {(editing.images ?? []).map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface-100 group">
                      <Image src={img} alt="" fill className="object-cover" />
                      <button onClick={() => removeImage(i)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="w-20 h-20 rounded-2xl border-2 border-dashed border-surface-300 flex flex-col items-center justify-center hover:border-brand-500 transition-colors text-ink-muted hover:text-brand-600"
                  >
                    {uploading ? <span className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
                    <span className="text-xs mt-1">Upload</span>
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
              </div>

              {/* Basic fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Product Name *</label>
                  <input
                    className="input" placeholder="NebulaBot X8"
                    value={editing.name ?? ''}
                    onChange={e => setEditing(p => ({ ...p, name: e.target.value, slug: p.slug || slugify(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="label">Slug *</label>
                  <input
                    className="input" placeholder="nebulabot-x8"
                    value={editing.slug ?? ''}
                    onChange={e => setEditing(p => ({ ...p, slug: slugify(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="label">Price (USD) *</label>
                  <input
                    type="number" className="input" placeholder="49.99" min="0" step="0.01"
                    value={editing.price ?? ''}
                    onChange={e => setEditing(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="label">Compare Price (optional)</label>
                  <input
                    type="number" className="input" placeholder="69.99" min="0" step="0.01"
                    value={editing.compare_price ?? ''}
                    onChange={e => setEditing(p => ({ ...p, compare_price: parseFloat(e.target.value) || null }))}
                  />
                </div>
                <div>
                  <label className="label">Category</label>
                  <input
                    className="input" placeholder="Home Gadgets"
                    value={editing.category ?? ''}
                    onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Stock Status</label>
                  <select
                    className="input"
                    value={editing.stock_status ?? 'in_stock'}
                    onChange={e => setEditing(p => ({ ...p, stock_status: e.target.value as Product['stock_status'] }))}
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="label">Rating (0–5)</label>
                  <input
                    type="number" className="input" min="0" max="5" step="0.1"
                    value={editing.rating ?? 0}
                    onChange={e => setEditing(p => ({ ...p, rating: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="label">Review Count</label>
                  <input
                    type="number" className="input" min="0"
                    value={editing.review_count ?? 0}
                    onChange={e => setEditing(p => ({ ...p, review_count: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input min-h-[100px] resize-y"
                  placeholder="Write a short overview of the product..."
                  value={editing.description ?? ''}
                  onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              {/* ── BULLET POINTS ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Key Features (Bullet Points)</label>
                  <span className="text-xs text-ink-muted">{bullets.length} point{bullets.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Existing bullets */}
                {bullets.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {bullets.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => moveBullet(i, -1)}
                            disabled={i === 0}
                            className="w-5 h-4 flex items-center justify-center text-ink-muted hover:text-ink-primary disabled:opacity-30 text-[10px]"
                          >▲</button>
                          <button
                            onClick={() => moveBullet(i, 1)}
                            disabled={i === bullets.length - 1}
                            className="w-5 h-4 flex items-center justify-center text-ink-muted hover:text-ink-primary disabled:opacity-30 text-[10px]"
                          >▼</button>
                        </div>

                        <GripVertical size={14} className="text-surface-300 shrink-0" />

                        {/* Bullet icon */}
                        <CheckCircle2 size={14} className="text-brand-500 shrink-0" />

                        {/* Editable text */}
                        <input
                          className="flex-1 text-sm border border-surface-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-surface-50 hover:bg-white transition-colors"
                          value={b}
                          onChange={e => editBullet(i, e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && bulletRef.current?.focus()}
                        />

                        {/* Delete */}
                        <button
                          onClick={() => removeBullet(i)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-ink-muted hover:text-red-500 transition-colors shrink-0"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new bullet */}
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 border border-dashed border-brand-300 bg-brand-50/50 rounded-xl px-3 py-2 focus-within:border-brand-500 focus-within:bg-white transition-colors">
                    <Plus size={14} className="text-brand-500 shrink-0" />
                    <input
                      ref={bulletRef}
                      type="text"
                      className="flex-1 text-sm bg-transparent outline-none placeholder:text-ink-muted"
                      placeholder="Add a feature e.g. 8 Projection Modes"
                      value={newBullet}
                      onChange={e => setNewBullet(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBullet() } }}
                    />
                  </div>
                  <button
                    onClick={addBullet}
                    disabled={!newBullet.trim()}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-ink-muted mt-1.5">Press Enter or click Add · Click any bullet to edit it · Use ▲▼ to reorder</p>
              </div>

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-brand-600"
                  checked={editing.is_featured ?? false}
                  onChange={e => setEditing(p => ({ ...p, is_featured: e.target.checked }))}
                />
                <span className="text-sm font-medium text-ink-primary">Feature this product on homepage</span>
              </label>
            </div>

            <div className="p-6 border-t border-surface-200 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary">
                {editing.id ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
