import React, { useState, useRef } from 'react';
import { useApp } from '../AppContext';
import {
  LayoutDashboard, ShoppingCart, Package, Image, Tag, Star,
  MessageSquare, Mail, Settings, LogOut, Plus, Edit2, Trash2,
  Copy, Check, X, ChevronDown, ChevronUp, Eye, EyeOff,
  TrendingUp, DollarSign, Users, AlertCircle, ExternalLink,
  Upload, Link, Sparkles, Save, RotateCcw, ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Coupon, CMSSettings, SiteSettings, SeoSettings } from '../types';

// ─── tiny helpers ────────────────────────────────────────────────────────────
const Input = ({ label, id, ...p }: any) => (
  <div>
    {label && <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{label}</label>}
    <input id={id} {...p} className={`w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition ${p.className||''}`} />
  </div>
);
const Textarea = ({ label, id, ...p }: any) => (
  <div>
    {label && <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{label}</label>}
    <textarea id={id} {...p} className={`w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 resize-none transition ${p.className||''}`} />
  </div>
);
const Select = ({ label, id, children, ...p }: any) => (
  <div>
    {label && <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{label}</label>}
    <select id={id} {...p} className={`w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition ${p.className||''}`}>
      {children}
    </select>
  </div>
);
const Badge = ({ children, color = 'zinc' }: { children: React.ReactNode; color?: string }) => {
  const map: Record<string, string> = {
    green: 'bg-green-900/40 text-green-400 border-green-800/30',
    red: 'bg-red-900/40 text-red-400 border-red-800/30',
    amber: 'bg-amber-900/40 text-amber-400 border-amber-800/30',
    purple: 'bg-purple-900/40 text-purple-400 border-purple-800/30',
    zinc: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    blue: 'bg-blue-900/40 text-blue-400 border-blue-800/30',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${map[color]}`}>{children}</span>;
};

// PRODUCT FORM DEFAULTS
const emptyProduct = () => ({
  id: '', name: '', slug: '', sku: '', price: 99.99, salePrice: undefined as number | undefined,
  category: 'Projectors', shortDescription: '', description: '',
  isFeatured: false, isBestSeller: false, isNewArrival: false, status: 'active' as 'active' | 'draft',
  images: [] as string[], features: [] as string[], colors: [] as { name: string; value: string }[], rating: 5,
});

export const AdminPanel: React.FC = () => {
  const {
    products, reviews, orders, coupons, cms, seo, siteSettings,
    contactMessages, subscribers, notifications, adminTab, setAdminTab, adminLogout,
    addProduct, editProduct, deleteProduct, duplicateProduct,
    moderateReview, toggleFeatureReview, addCoupon, toggleCouponStatus, deleteCoupon,
    updateOrderStatus, updateOrderPaymentStatus, updateCms, updateSeo, updateSiteSettings,
    toggleMessageRead, clearNotification, clearAllNotifications,
  } = useApp();

  // ─── UI State ───────────────────────────────────────────────
  const [productModal, setProductModal] = useState<'closed' | 'new' | 'edit'>('closed');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pf, setPf] = useState(emptyProduct());
  const [newImg, setNewImg] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorVal, setNewColorVal] = useState('#7c3aed');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // CMS state
  const [hero, setHero] = useState({ ...cms.hero });
  const [about, setAbout] = useState({ ...cms.about });
  const [contact, setContact] = useState({ ...cms.contact });
  const [footer, setFooter] = useState({ ...cms.footer });
  const [siteSt, setSiteSt] = useState({ ...siteSettings });
  const [seoSt, setSeoSt] = useState({ ...seo });
  const [cmsSaved, setCmsSaved] = useState(false);

  // Coupon form
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [cf, setCf] = useState({ code: '', type: 'percentage' as 'percentage' | 'fixed', value: 10, expiry: '2027-12-31', limit: 500 });

  // ─── Metrics ────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => o.paymentStatus === 'paid' ? s + o.total : s, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const unread = notifications.filter(n => !n.isRead);

  // ─── Product form handlers ───────────────────────────────────
  const openNew = () => { setPf(emptyProduct()); setEditingId(null); setProductModal('new'); };
  const openEdit = (p: Product) => {
    setPf({ ...p, salePrice: p.salePrice });
    setEditingId(p.id);
    setProductModal('edit');
  };
  const closeModal = () => { setProductModal('closed'); setEditingId(null); };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: pf.name, slug: pf.slug || pf.name.toLowerCase().replace(/\s+/g, '-'),
      sku: pf.sku, price: pf.price, salePrice: pf.salePrice || undefined,
      category: pf.category, shortDescription: pf.shortDescription, description: pf.description,
      images: pf.images, features: pf.features, colors: pf.colors,
      isFeatured: pf.isFeatured, isBestSeller: pf.isBestSeller, isNewArrival: pf.isNewArrival,
      status: pf.status, rating: pf.rating,
    };
    if (editingId) {
      editProduct({ ...data, id: editingId, rating: pf.rating });
    } else {
      addProduct(data);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) { deleteProduct(id); setDeleteConfirm(null); }
    else { setDeleteConfirm(id); setTimeout(() => setDeleteConfirm(null), 3000); }
  };

  // ─── CMS save ───────────────────────────────────────────────
  const handleSaveCms = () => {
    const updatedCms: CMSSettings = {
      hero, benefits: cms.benefits, about, contact,
      footer: { ...cms.footer, ...footer },
    };
    updateCms(updatedCms);
    updateSiteSettings(siteSt);
    updateSeo(seoSt);
    setCmsSaved(true);
    setTimeout(() => setCmsSaved(false), 2500);
  };

  // ─── NAV items ──────────────────────────────────────────────
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: pendingOrders || null },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'cms', label: 'Site Editor', icon: Image },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'messages', label: 'Messages', icon: Mail, badge: contactMessages.filter(m => !m.isRead).length || null },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans">

      {/* ── SIDEBAR ── */}
      <aside className="w-60 shrink-0 bg-zinc-950 border-r border-zinc-800/60 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black tracking-widest text-white">ELYVATE</p>
              <p className="text-[9px] text-zinc-500 tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setAdminTab(id as any)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                adminTab === id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              {badge ? (
                <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800/60 space-y-1.5">
          <button
            onClick={() => window.open('/', '_blank')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Storefront
          </button>
          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-red-900/10 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/60 px-8 py-4 flex items-center justify-between">
          <h1 className="text-base font-bold text-white">
            {navItems.find(n => n.id === adminTab)?.label}
          </h1>
          {unread.length > 0 && (
            <div className="flex items-center gap-2 bg-purple-900/30 border border-purple-700/30 rounded-lg px-3 py-1.5 text-xs text-purple-300">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{unread[0].message}</span>
              <button onClick={() => clearNotification(unread[0].id)} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
            </div>
          )}
        </div>

        <div className="p-8">

          {/* ═══ OVERVIEW ═══ */}
          {adminTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-900/20' },
                  { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-900/20' },
                  { label: 'Active Products', value: activeProducts, icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
                  { label: 'Subscribers', value: subscribers.length, icon: Users, color: 'text-amber-400', bg: 'bg-amber-900/20' },
                ].map((s, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
                    <div className={`h-8 w-8 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800/60 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">Recent Orders</h2>
                  <button onClick={() => setAdminTab('orders')} className="text-xs text-purple-400 hover:text-purple-300">View all →</button>
                </div>
                {orders.length === 0 ? (
                  <div className="px-6 py-10 text-center text-zinc-500 text-sm">No orders yet.</div>
                ) : (
                  <div className="divide-y divide-zinc-800/60">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="px-6 py-3.5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{o.customerName}</p>
                          <p className="text-xs text-zinc-500">{o.id} · {new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-purple-400">${o.total.toFixed(2)}</span>
                          <Badge color={o.status === 'delivered' ? 'green' : o.status === 'shipped' ? 'blue' : o.status === 'processing' ? 'amber' : 'zinc'}>{o.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ ORDERS ═══ */}
          {adminTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl px-6 py-16 text-center">
                  <ShoppingCart className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400">No orders yet.</p>
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-zinc-800/60">
                        <tr className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          <th className="px-5 py-3.5 text-left">Order</th>
                          <th className="px-5 py-3.5 text-left">Customer</th>
                          <th className="px-5 py-3.5 text-left">Items</th>
                          <th className="px-5 py-3.5 text-left">Total</th>
                          <th className="px-5 py-3.5 text-left">Payment</th>
                          <th className="px-5 py-3.5 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {orders.map(o => (
                          <tr key={o.id} className="hover:bg-zinc-800/30 transition">
                            <td className="px-5 py-3.5 font-mono text-xs text-purple-400 font-bold">{o.id}</td>
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-white text-xs">{o.customerName}</p>
                              <p className="text-zinc-500 text-xs">{o.customerEmail}</p>
                            </td>
                            <td className="px-5 py-3.5 text-zinc-300 text-xs">{o.items.reduce((s, i) => s + i.quantity, 0)} item(s)</td>
                            <td className="px-5 py-3.5 font-bold text-white">${o.total.toFixed(2)}</td>
                            <td className="px-5 py-3.5">
                              <select
                                value={o.paymentStatus}
                                onChange={e => updateOrderPaymentStatus(o.id, e.target.value as any)}
                                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                              >
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                              </select>
                            </td>
                            <td className="px-5 py-3.5">
                              <select
                                value={o.status}
                                onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                                className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ PRODUCTS ═══ */}
          {adminTab === 'products' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">{products.length} products total · {activeProducts} active</p>
                <button
                  onClick={openNew}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </div>

              {/* Product grid */}
              {products.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl px-6 py-20 text-center">
                  <Package className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400 mb-4">No products yet. Add your first one!</p>
                  <button onClick={openNew} className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(prod => (
                    <div key={prod.id} className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-square bg-zinc-800 overflow-hidden">
                        {prod.images[0] ? (
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-zinc-700" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                          <Badge color={prod.status === 'active' ? 'green' : 'zinc'}>{prod.status}</Badge>
                          {prod.isFeatured && <Badge color="purple">Featured</Badge>}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3.5 flex flex-col flex-1">
                        <p className="text-[10px] text-zinc-500 font-mono mb-0.5">{prod.category} · {prod.sku}</p>
                        <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 mb-2">{prod.name}</h3>
                        <div className="flex items-center gap-2 mt-auto">
                          {prod.salePrice ? (
                            <>
                              <span className="font-bold text-purple-400">${prod.salePrice}</span>
                              <span className="text-zinc-600 line-through text-xs">${prod.price}</span>
                            </>
                          ) : (
                            <span className="font-bold text-white">${prod.price}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-3.5 pb-3.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => openEdit(prod)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => duplicateProduct(prod.id)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                            title="Duplicate"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${deleteConfirm === prod.id ? 'bg-red-900/40 text-red-400' : 'text-zinc-500 hover:text-red-400 hover:bg-red-900/20'}`}
                            title={deleteConfirm === prod.id ? 'Click again to confirm delete' : 'Delete'}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ CMS / SITE EDITOR ═══ */}
          {adminTab === 'cms' && (
            <div className="space-y-6 max-w-3xl">

              {/* Save button sticky */}
              <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800/60 rounded-xl px-5 py-3.5">
                <p className="text-sm text-zinc-400">All changes save instantly to your store.</p>
                <button
                  onClick={handleSaveCms}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                    cmsSaved ? 'bg-green-600 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {cmsSaved ? <><Check className="h-4 w-4" />Saved!</> : <><Save className="h-4 w-4" />Save Changes</>}
                </button>
              </div>

              {/* ── HERO SECTION ── */}
              <Section title="Hero Section" subtitle="The big banner customers see first">
                <div className="space-y-4">
                  <Input label="Headline (main title)" value={hero.title} onChange={(e: any) => setHero({ ...hero, title: e.target.value })} placeholder="TRANSFORM YOUR ROOM INTO A GALAXY" />
                  <Input label="Subtitle" value={hero.subtitle} onChange={(e: any) => setHero({ ...hero, subtitle: e.target.value })} placeholder="Short tagline below the title" />
                  <Input label="Button text" value={hero.ctaText} onChange={(e: any) => setHero({ ...hero, ctaText: e.target.value })} placeholder="Shop Now" />

                  {/* Hero Image — most important part */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Hero Product Image</label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Input
                          value={hero.imageUrl}
                          onChange={(e: any) => setHero({ ...hero, imageUrl: e.target.value })}
                          placeholder="Paste image URL here (Unsplash, CDN, etc.)"
                        />
                        <Link className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
                      </div>
                    </div>
                    {/* Live preview */}
                    {hero.imageUrl && (
                      <div className="mt-3 relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-800 aspect-video max-w-sm">
                        <img
                          src={hero.imageUrl}
                          alt="Hero preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs hidden">Invalid URL</div>
                        <div className="absolute bottom-2 left-2">
                          <Badge color="purple">Live Preview</Badge>
                        </div>
                        <button
                          onClick={() => setHero({ ...hero, imageUrl: '' })}
                          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1 text-white transition cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    {!hero.imageUrl && (
                      <div className="mt-3 rounded-xl border-2 border-dashed border-zinc-800 aspect-video max-w-sm flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="h-8 w-8 text-zinc-700" />
                        <p className="text-xs text-zinc-600">No image set. Paste a URL above.</p>
                      </div>
                    )}
                  </div>
                </div>
              </Section>

              {/* ── BANNER ── */}
              <Section title="Promo Banner" subtitle="Top bar announcement (leave empty to hide)">
                <Input
                  label="Banner message"
                  value={siteSt.bannerMessage}
                  onChange={(e: any) => setSiteSt({ ...siteSt, bannerMessage: e.target.value })}
                  placeholder="🚀 Free shipping on all orders over $99"
                />
              </Section>

              {/* ── ABOUT ── */}
              <Section title="About Page">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Title" value={about.title} onChange={(e: any) => setAbout({ ...about, title: e.target.value })} />
                    <Input label="Subtitle" value={about.subtitle} onChange={(e: any) => setAbout({ ...about, subtitle: e.target.value })} />
                  </div>
                  <Textarea label="Content" rows={4} value={about.content} onChange={(e: any) => setAbout({ ...about, content: e.target.value })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Mission" value={about.mission} onChange={(e: any) => setAbout({ ...about, mission: e.target.value })} />
                    <Input label="Vision" value={about.vision} onChange={(e: any) => setAbout({ ...about, vision: e.target.value })} />
                  </div>
                  <Input label="Story image URL" value={about.storyImage} onChange={(e: any) => setAbout({ ...about, storyImage: e.target.value })} />
                </div>
              </Section>

              {/* ── CONTACT ── */}
              <Section title="Contact Info">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Address" value={contact.address} onChange={(e: any) => setContact({ ...contact, address: e.target.value })} />
                  <Input label="Email" value={contact.email} onChange={(e: any) => setContact({ ...contact, email: e.target.value })} />
                  <Input label="Phone" value={contact.phone} onChange={(e: any) => setContact({ ...contact, phone: e.target.value })} />
                </div>
              </Section>

              {/* ── BRAND ── */}
              <Section title="Brand & SEO">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Brand name" value={siteSt.brandName} onChange={(e: any) => setSiteSt({ ...siteSt, brandName: e.target.value })} />
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Accent color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={siteSt.accentColor}
                          onChange={(e) => setSiteSt({ ...siteSt, accentColor: e.target.value })}
                          className="h-9 w-14 bg-zinc-950 border border-zinc-800 rounded cursor-pointer"
                        />
                        <span className="text-xs font-mono text-zinc-400">{siteSt.accentColor}</span>
                      </div>
                    </div>
                  </div>
                  <Input label="SEO page title" value={seoSt.title} onChange={(e: any) => setSeoSt({ ...seoSt, title: e.target.value })} />
                  <Textarea label="SEO meta description" rows={2} value={seoSt.description} onChange={(e: any) => setSeoSt({ ...seoSt, description: e.target.value })} />
                  <Input label="Keywords (comma separated)" value={seoSt.keywords} onChange={(e: any) => setSeoSt({ ...seoSt, keywords: e.target.value })} />
                </div>
              </Section>

            </div>
          )}

          {/* ═══ COUPONS ═══ */}
          {adminTab === 'coupons' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  New Coupon
                </button>
              </div>

              <AnimatePresence>
                {showCouponForm && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!cf.code) return;
                      addCoupon({ code: cf.code.toUpperCase(), type: cf.type, value: cf.value, expiryDate: cf.expiry, usageLimit: cf.limit, status: 'active' });
                      setCf({ code: '', type: 'percentage', value: 10, expiry: '2027-12-31', limit: 500 });
                      setShowCouponForm(false);
                    }}
                    className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 space-y-4"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <Input label="Coupon code" required placeholder="SAVE20" value={cf.code} onChange={(e: any) => setCf({ ...cf, code: e.target.value })} />
                      <Select label="Type" value={cf.type} onChange={(e: any) => setCf({ ...cf, type: e.target.value })}>
                        <option value="percentage">Percentage %</option>
                        <option value="fixed">Fixed $ off</option>
                      </Select>
                      <Input label="Value" type="number" min={1} value={cf.value} onChange={(e: any) => setCf({ ...cf, value: Number(e.target.value) })} />
                      <Input label="Expiry date" type="date" value={cf.expiry} onChange={(e: any) => setCf({ ...cf, expiry: e.target.value })} />
                      <Input label="Usage limit" type="number" value={cf.limit} onChange={(e: any) => setCf({ ...cf, limit: Number(e.target.value) })} />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition cursor-pointer">Create</button>
                      <button type="button" onClick={() => setShowCouponForm(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition cursor-pointer">Cancel</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
                {coupons.length === 0 ? (
                  <div className="px-6 py-12 text-center text-zinc-500">No coupons yet.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="border-b border-zinc-800/60">
                      <tr className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <th className="px-5 py-3.5 text-left">Code</th>
                        <th className="px-5 py-3.5 text-left">Discount</th>
                        <th className="px-5 py-3.5 text-left">Used</th>
                        <th className="px-5 py-3.5 text-left">Expiry</th>
                        <th className="px-5 py-3.5 text-left">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {coupons.map(c => (
                        <tr key={c.id} className="hover:bg-zinc-800/30 transition">
                          <td className="px-5 py-3.5 font-mono font-bold text-purple-400">{c.code}</td>
                          <td className="px-5 py-3.5 text-white">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
                          <td className="px-5 py-3.5 text-zinc-400">{c.usedCount} / {c.usageLimit}</td>
                          <td className="px-5 py-3.5 text-zinc-400">{c.expiryDate}</td>
                          <td className="px-5 py-3.5"><Badge color={c.status === 'active' ? 'green' : 'zinc'}>{c.status}</Badge></td>
                          <td className="px-5 py-3.5 text-right flex justify-end gap-2">
                            <button onClick={() => toggleCouponStatus(c.id)} className="p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-amber-900/20 rounded transition cursor-pointer" title="Toggle">
                              {c.status === 'active' ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                            <button onClick={() => deleteCoupon(c.id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-900/20 rounded transition cursor-pointer" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ═══ REVIEWS ═══ */}
          {adminTab === 'reviews' && (
            <div className="space-y-4 max-w-3xl">
              {reviews.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl px-6 py-12 text-center text-zinc-500">No reviews submitted yet.</div>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-sm">{r.customerName}</span>
                          <Badge color={r.status === 'approved' ? 'green' : r.status === 'rejected' ? 'red' : 'amber'}>{r.status}</Badge>
                          {r.isFeatured && <Badge color="purple">Featured</Badge>}
                        </div>
                        <p className="text-xs text-zinc-500 mb-2">{r.productName} · {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                        <p className="text-sm text-zinc-300">{r.comment}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {r.status !== 'approved' && (
                          <button onClick={() => moderateReview(r.id, 'approved')} className="p-1.5 text-zinc-500 hover:text-green-400 hover:bg-green-900/20 rounded transition cursor-pointer" title="Approve">
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button onClick={() => moderateReview(r.id, 'rejected')} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-900/20 rounded transition cursor-pointer" title="Reject">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => toggleFeatureReview(r.id)} className="p-1.5 text-zinc-500 hover:text-purple-400 hover:bg-purple-900/20 rounded transition cursor-pointer" title="Toggle featured">
                          <Star className={`h-4 w-4 ${r.isFeatured ? 'fill-purple-400 text-purple-400' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ═══ MESSAGES ═══ */}
          {adminTab === 'messages' && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-zinc-400">{contactMessages.filter(m => !m.isRead).length} unread · {subscribers.length} subscribers</p>
              </div>

              {contactMessages.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl px-6 py-12 text-center text-zinc-500">No messages yet.</div>
              ) : (
                contactMessages.map(m => (
                  <div key={m.id} className={`bg-zinc-900 border rounded-xl p-5 transition ${m.isRead ? 'border-zinc-800/60' : 'border-purple-700/40 bg-purple-900/5'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-white text-sm">{m.name}</span>
                          {!m.isRead && <Badge color="purple">New</Badge>}
                        </div>
                        <p className="text-xs text-zinc-500 mb-2">{m.email} · {m.subject}</p>
                        <p className="text-sm text-zinc-300">{m.message}</p>
                      </div>
                      <button
                        onClick={() => toggleMessageRead(m.id)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition cursor-pointer shrink-0"
                        title={m.isRead ? 'Mark unread' : 'Mark read'}
                      >
                        {m.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))
              )}

              {subscribers.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-white mb-3">Newsletter Subscribers ({subscribers.length})</h3>
                  <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
                    <div className="divide-y divide-zinc-800/60">
                      {subscribers.map(s => (
                        <div key={s.id} className="px-5 py-3 text-sm text-zinc-400 font-mono">{s.email}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ═══ PRODUCT MODAL ═══ */}
      <AnimatePresence>
        {productModal !== 'closed' && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="relative w-full max-w-2xl my-8 bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
                <h2 className="font-bold text-white">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={closeModal} className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="overflow-y-auto max-h-[75vh]">
                <div className="p-6 space-y-6">

                  {/* Basic info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Product name *" required placeholder="e.g. Elyvate Nova" value={pf.name} onChange={(e: any) => { const n = e.target.value; setPf({ ...pf, name: n, slug: n.toLowerCase().replace(/\s+/g, '-') }); }} />
                    <Input label="SKU *" required placeholder="ELY-NOV-01" value={pf.sku} onChange={(e: any) => setPf({ ...pf, sku: e.target.value })} />
                    <Input label="Slug (URL)" required placeholder="elyvate-nova" value={pf.slug} onChange={(e: any) => setPf({ ...pf, slug: e.target.value })} />
                    <Select label="Category" value={pf.category} onChange={(e: any) => setPf({ ...pf, category: e.target.value })}>
                      <option>Projectors</option>
                      <option>Home Decor</option>
                      <option>Electronics</option>
                      <option>Accessories</option>
                      <option>Bundles</option>
                    </Select>
                    <Input label="Price ($) *" required type="number" step="0.01" min="0" value={pf.price} onChange={(e: any) => setPf({ ...pf, price: Number(e.target.value) })} />
                    <Input label="Sale price ($)" type="number" step="0.01" min="0" placeholder="Leave empty for no sale" value={pf.salePrice || ''} onChange={(e: any) => setPf({ ...pf, salePrice: e.target.value ? Number(e.target.value) : undefined })} />
                  </div>

                  {/* Descriptions */}
                  <Input label="Short description" placeholder="One-line summary shown in shop grid" value={pf.shortDescription} onChange={(e: any) => setPf({ ...pf, shortDescription: e.target.value })} />
                  <Textarea label="Full description *" required rows={4} placeholder="Detailed product description..." value={pf.description} onChange={(e: any) => setPf({ ...pf, description: e.target.value })} />

                  {/* Status & flags */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Status & Labels</label>
                    <div className="flex flex-wrap gap-4">
                      <Select value={pf.status} onChange={(e: any) => setPf({ ...pf, status: e.target.value })}>
                        <option value="active">Active (visible in store)</option>
                        <option value="draft">Draft (hidden)</option>
                      </Select>
                      <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                        <input type="checkbox" checked={pf.isFeatured} onChange={(e) => setPf({ ...pf, isFeatured: e.target.checked })} className="rounded border-zinc-700 bg-zinc-950 text-purple-600 focus:ring-0" />
                        Featured
                      </label>
                      <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                        <input type="checkbox" checked={pf.isBestSeller} onChange={(e) => setPf({ ...pf, isBestSeller: e.target.checked })} className="rounded border-zinc-700 bg-zinc-950 text-purple-600 focus:ring-0" />
                        Best Seller
                      </label>
                      <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                        <input type="checkbox" checked={pf.isNewArrival} onChange={(e) => setPf({ ...pf, isNewArrival: e.target.checked })} className="rounded border-zinc-700 bg-zinc-950 text-purple-600 focus:ring-0" />
                        New Arrival
                      </label>
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Product Images</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Paste image URL (Unsplash, CDN link, etc.)"
                        value={newImg}
                        onChange={(e) => setNewImg(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => { if (newImg.trim()) { setPf({ ...pf, images: [...pf.images, newImg.trim()] }); setNewImg(''); } }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    {pf.images.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {pf.images.map((img, i) => (
                          <div key={i} className="relative group">
                            <img src={img} alt="" className="h-16 w-16 object-cover rounded-lg border border-zinc-700" />
                            <button
                              type="button"
                              onClick={() => setPf({ ...pf, images: pf.images.filter((_, idx) => idx !== i) })}
                              className="absolute -top-1.5 -right-1.5 bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                              <X className="h-2.5 w-2.5 text-white" />
                            </button>
                            {i === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-[8px] text-white px-1 rounded">Main</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-600">No images added yet. Add at least one image URL above.</p>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Features / Specs</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="e.g. Bluetooth Remote"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (newFeature.trim()) { setPf({ ...pf, features: [...pf.features, newFeature.trim()] }); setNewFeature(''); } } }}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500"
                      />
                      <button type="button" onClick={() => { if (newFeature.trim()) { setPf({ ...pf, features: [...pf.features, newFeature.trim()] }); setNewFeature(''); } }} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pf.features.map((f, i) => (
                        <span key={i} className="flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-lg">
                          {f}
                          <button type="button" onClick={() => setPf({ ...pf, features: pf.features.filter((_, idx) => idx !== i) })} className="text-zinc-500 hover:text-red-400 cursor-pointer"><X className="h-2.5 w-2.5" /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Color Variants</label>
                    <div className="flex gap-2 mb-2">
                      <input type="text" placeholder="Color name" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500" />
                      <input type="color" value={newColorVal} onChange={(e) => setNewColorVal(e.target.value)} className="h-10 w-14 bg-zinc-950 border border-zinc-800 rounded cursor-pointer" />
                      <button
                        type="button"
                        onClick={() => { if (newColorName.trim()) { setPf({ ...pf, colors: [...pf.colors, { name: newColorName.trim(), value: newColorVal }] }); setNewColorName(''); } }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pf.colors.map((c, i) => (
                        <span key={i} className="flex items-center gap-1.5 bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-lg">
                          <span className="h-3 w-3 rounded-full border border-zinc-600" style={{ background: c.value }} />
                          {c.name}
                          <button type="button" onClick={() => setPf({ ...pf, colors: pf.colors.filter((_, idx) => idx !== i) })} className="text-zinc-500 hover:text-red-400 cursor-pointer"><X className="h-2.5 w-2.5" /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Modal footer */}
                <div className="px-6 py-4 border-t border-zinc-800/60 flex justify-end gap-3 bg-zinc-900/80">
                  <button type="button" onClick={closeModal} className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-lg transition cursor-pointer">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-lg transition cursor-pointer">
                    {editingId ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// ─── Section wrapper component ────────────────────────────────
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/60">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
