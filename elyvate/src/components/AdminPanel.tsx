import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Store, ShieldAlert, LineChart, ShoppingCart, Package, Settings, MessageSquare, 
  Ticket, Users, Plus, Edit, Trash2, Copy, ToggleLeft, ToggleRight, Check, X,
  ExternalLink, Sparkles, AlertCircle, Bookmark, Eye, Mail, Palette, Layers, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Coupon, Review, CMSSettings, SiteSettings, SeoSettings } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    products, reviews, orders, coupons, cms, seo, siteSettings, contactMessages, 
    subscribers, notifications, adminTab, setAdminTab, adminLogout,
    addProduct, editProduct, deleteProduct, duplicateProduct,
    moderateReview, toggleFeatureReview, addCoupon, toggleCouponStatus, deleteCoupon,
    updateOrderStatus, updateOrderPaymentStatus, updateCms, updateSeo, updateSiteSettings,
    toggleMessageRead, clearNotification, clearAllNotifications
  } = useApp();

  // Selected sub-item for active configurations
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // New/Edit Product Form Fields
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pSlug, setPSlug] = useState('');
  const [pSku, setPSku] = useState('');
  const [pPrice, setPPrice] = useState(99.99);
  const [pSalePrice, setPSalePrice] = useState<number | undefined>(undefined);
  const [pCategory, setPCategory] = useState('Projectors');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pFeatured, setPFeatured] = useState(false);
  const [pBestSeller, setPBestSeller] = useState(false);
  const [pNewArrival, setPNewArrival] = useState(false);
  const [pStatus, setPStatus] = useState<'active' | 'draft'>('active');
  const [pImages, setPImages] = useState<string[]>(['https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800']);
  const [pFeatures, setPFeatures] = useState<string[]>(['Timer Function', 'Wireless Remote']);
  const [pColors, setPColors] = useState<{ name: string; value: string }[]>([{ name: 'Obsidian Black', value: '#111111' }]);

  // Temp single values
  const [newColorName, setNewColorName] = useState('');
  const [newColorValue, setNewColorValue] = useState('#7c3aed');
  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Coupon Form
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [cCode, setCCode] = useState('');
  const [cType, setCType] = useState<'percentage' | 'fixed'>('percentage');
  const [cValue, setCValue] = useState(10);
  const [cExpiry, setCExpiry] = useState('2027-12-31');
  const [cLimit, setCLimit] = useState(500);

  // CMS forms binding local states
  const [cmsHeroTitle, setCmsHeroTitle] = useState(cms.hero.title);
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState(cms.hero.subtitle);
  const [cmsHeroCta, setCmsHeroCta] = useState(cms.hero.ctaText);
  const [cmsHeroImg, setCmsHeroImg] = useState(cms.hero.imageUrl);

  const [cmsAboutTitle, setCmsAboutTitle] = useState(cms.about.title);
  const [cmsAboutSub, setCmsAboutSub] = useState(cms.about.subtitle);
  const [cmsAboutContent, setCmsAboutContent] = useState(cms.about.content);
  const [cmsAboutMission, setCmsAboutMission] = useState(cms.about.mission);
  const [cmsAboutVision, setCmsAboutVision] = useState(cms.about.vision);
  const [cmsAboutImage, setCmsAboutImage] = useState(cms.about.storyImage);

  const [cmsContactAddress, setCmsContactAddress] = useState(cms.contact.address);
  const [cmsContactEmail, setCmsContactEmail] = useState(cms.contact.email);
  const [cmsContactPhone, setCmsContactPhone] = useState(cms.contact.phone);

  const [cmsFooterLogo, setCmsFooterLogo] = useState(cms.footer.logoText);
  const [cmsFooterCopy, setCmsFooterCopy] = useState(cms.footer.copyrightText);

  // Theme & branding settings local
  const [brandName, setBrandName] = useState(siteSettings.brandName);
  const [accentColor, setAccentColor] = useState(siteSettings.accentColor);
  const [siteBanner, setSiteBanner] = useState(siteSettings.bannerMessage);

  // SEO local states
  const [seoTitle, setSeoTitle] = useState(seo.title);
  const [seoDesc, setSeoDesc] = useState(seo.description);
  const [seoKeys, setSeoKeys] = useState(seo.keywords);
  const [seoOgImage, setSeoOgImage] = useState(seo.ogImage);

  const [cmsSaveAlert, setCmsSaveAlert] = useState('');

  // 1. Calculations metrics
  const totalRevenue = orders.reduce((acc, curr) => curr.paymentStatus === 'paid' ? acc + curr.total : acc, 0);
  const totalOrdersCount = orders.length;
  const approvedReviewsCount = reviews.filter(r => r.status === 'approved').length;
  const subscribersCount = subscribers.length + 128; // seed padding for aesthetic SaaS density
  const totalCustomers = subscribersCount + 42;

  // Recent notifications
  const unreadNotifs = notifications.filter(n => !n.isRead);

  // Chart seed references
  // SVG analytic coordinates generator: Total sales trends for the last 6 months
  const points = [
    { m: 'Jan', val: 2400 },
    { m: 'Feb', val: 3800 },
    { m: 'Mar', val: 4200 },
    { m: 'Apr', val: 5900 },
    { m: 'May', val: 9400 },
    { m: 'Jun', val: totalRevenue || 12400 }
  ];

  // Calculate coordinates for dynamic SVG Sales graph line
  const graphWidth = 500;
  const graphHeight = 120;
  const values = points.map(p => p.val);
  const maxVal = Math.max(...values, 10000);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal;

  const linePath = points.map((p, index) => {
    const x = (index / (points.length - 1)) * graphWidth;
    const y = graphHeight - ((p.val - minVal) / range) * graphHeight;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Operations for forms
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pSku || !pDesc) return;

    const data: Omit<Product, 'id' | 'rating'> = {
      name: pName,
      slug: pSlug || pName.toLowerCase().split(' ').join('-'),
      sku: pSku,
      price: pPrice,
      salePrice: pSalePrice || undefined,
      category: pCategory,
      shortDescription: pShortDesc,
      description: pDesc,
      images: pImages,
      features: pFeatures,
      colors: pColors,
      isFeatured: pFeatured,
      isBestSeller: pBestSeller,
      isNewArrival: pNewArrival,
      status: pStatus
    };

    if (editingProduct) {
      editProduct({
        ...editingProduct,
        ...data
      });
    } else {
      addProduct(data);
    }

    // Reset Form
    setEditingProduct(null);
    setShowProductForm(false);
    resetProductFields();
  };

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setPId(prod.id);
    setPName(prod.name);
    setPSlug(prod.slug);
    setPSku(prod.sku);
    setPPrice(prod.price);
    setPSalePrice(prod.salePrice);
    setPCategory(prod.category);
    setPShortDesc(prod.shortDescription);
    setPDesc(prod.description);
    setPFeatured(prod.isFeatured);
    setPBestSeller(prod.isBestSeller);
    setPNewArrival(prod.isNewArrival);
    setPStatus(prod.status);
    setPImages(prod.images);
    setPFeatures(prod.features);
    setPColors(prod.colors);
    setShowProductForm(true);
  };

  const resetProductFields = () => {
    setPId('');
    setPName('');
    setPSlug('');
    setPSku('');
    setPPrice(99.99);
    setPSalePrice(undefined);
    setPCategory('Projectors');
    setPShortDesc('');
    setPDesc('');
    setPFeatured(false);
    setPBestSeller(false);
    setPNewArrival(false);
    setPStatus('active');
    setPImages(['https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800']);
    setPFeatures(['Timer Function', 'Wireless Remote']);
    setPColors([{ name: 'Obsidian Black', value: '#111111' }]);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode) return;
    addCoupon({
      code: cCode.toUpperCase(),
      type: cType,
      value: cValue,
      expiryDate: cExpiry,
      usageLimit: cLimit,
      status: 'active'
    });
    setCCode('');
    setShowCouponForm(false);
  };

  const handleSaveCMS = () => {
    const updatedCms: CMSSettings = {
      hero: {
        title: cmsHeroTitle,
        subtitle: cmsHeroSubtitle,
        ctaText: cmsHeroCta,
        ctaLink: '/shop',
        imageUrl: cmsHeroImg
      },
      benefits: cms.benefits, // retained
      about: {
        ...cms.about,
        title: cmsAboutTitle,
        subtitle: cmsAboutSub,
        content: cmsAboutContent,
        mission: cmsAboutMission,
        vision: cmsAboutVision,
        storyImage: cmsAboutImage
      },
      contact: {
        address: cmsContactAddress,
        email: cmsContactEmail,
        phone: cmsContactPhone
      },
      footer: {
        logoText: cmsFooterLogo,
        copyrightText: cmsFooterCopy,
        socialFacebook: cms.footer.socialFacebook,
        socialInstagram: cms.footer.socialInstagram,
        socialTwitter: cms.footer.socialTwitter,
        socialYoutube: cms.footer.socialYoutube
      }
    };

    updateCms(updatedCms);

    // Save siteSettings brand theme
    const updatedSettings: SiteSettings = {
      brandName,
      accentColor,
      bannerMessage: siteBanner
    };
    updateSiteSettings(updatedSettings);

    // Save SEO
    const updatedSeo: SeoSettings = {
      title: seoTitle,
      description: seoDesc,
      keywords: seoKeys,
      ogImage: seoOgImage
    };
    updateSeo(updatedSeo);

    setCmsSaveAlert('Interstellar variables populated immediately! Check checkout/carts.');
    setTimeout(() => {
      setCmsSaveAlert('');
    }, 4500);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col md:flex-row font-sans">
      
      {/* 1. SAAS NAVIGATION SIDEBAR LEFT */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-900 bg-neutral-950 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Admin Header Title */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-purple-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-purple-600/30">
              ⚡
            </div>
            <div>
              <span className="text-sm font-black tracking-widest text-white uppercase block">ELYVATE OS</span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-wider">COMMAND MATRIX</span>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <nav className="flex flex-col space-y-1.5 text-xs font-semibold tracking-wider uppercase text-neutral-400">
            {[
              { id: 'overview', label: 'METRICS HUB', icon: <LineChart className="h-4 w-4" /> },
              { id: 'orders', label: 'TRANSACTIONS', icon: <ShoppingCart className="h-4 w-4" /> },
              { id: 'products', label: 'GEAR CATALOG', icon: <Package className="h-4 w-4" /> },
              { id: 'cms', label: 'EDITORIALS CMS', icon: <Layers className="h-4 w-4" /> },
              { id: 'coupons', label: 'DISCOUNTS ENGINE', icon: <Ticket className="h-4 w-4" /> },
              { id: 'reviews', label: 'EXPERIENCES TICKET', icon: <MessageSquare className="h-4 w-4" /> },
              { id: 'messages', label: 'INBOUNDS & SUBS', icon: <Mail className="h-4 w-4" /> }
            ].map((tab) => {
              const isAct = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`admin-nav-${tab.id}`}
                  onClick={() => {
                    setAdminTab(tab.id as any);
                    setEditingProduct(null);
                    setShowProductForm(false);
                  }}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg text-left transition cursor-pointer ${
                    isAct 
                      ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/15' 
                      : 'hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Outer Backdoor back to customer storefront */}
        <div className="pt-8 border-t border-neutral-900 mt-8 space-y-4">
          <button
            id="admin-to-storefront"
            onClick={adminLogout}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-[10px] tracking-wider font-extrabold uppercase text-neutral-300 border border-neutral-850 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Store className="h-3.5 w-3.5" />
            <span>STORE FRONTEND</span>
          </button>
        </div>
      </aside>

      {/* 2. DYNAMIC WORKSPACE PANEL CENTER */}
      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Workspace Upper Context toolbar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-900 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.3em] font-extrabold uppercase text-purple-400">ADMIN CONTROL CENTER</span>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {adminTab === 'overview' && 'METRICS TELEMETRY'}
              {adminTab === 'orders' && 'TRANSACTION LOGS'}
              {adminTab === 'products' && 'DEVICE DIRECTORY'}
              {adminTab === 'cms' && 'WEBSITE EDITORIAL BLOCK'}
              {adminTab === 'coupons' && 'COUPON VALIDATIONS ENGINE'}
              {adminTab === 'reviews' && 'EXPERIENCE MODERATOR'}
              {adminTab === 'messages' && 'INBOUND MESSAGES'}
            </h1>
          </div>
          
          {/* Quick Stats Clock */}
          <div className="flex items-center gap-2 text-[10px] font-mono p-1 px-3.5 rounded bg-neutral-900 border border-neutral-850 select-none text-neutral-450 self-start sm:self-auto uppercase">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>LIVE DATABASE STATUS</span>
          </div>
        </div>

        {/* Notification warnings alert line if orders occur */}
        {unreadNotifs.length > 0 && (
          <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-purple-400 shrink-0" />
              <p className="text-xs text-neutral-200">
                Incoming transaction logged! <strong>{unreadNotifs[0].title}</strong>: {unreadNotifs[0].message}
              </p>
            </div>
            <button 
              id={`clear-notif-${unreadNotifs[0].id}`}
              onClick={() => clearNotification(unreadNotifs[0].id)}
              className="text-[10px] font-mono tracking-wider hover:text-white uppercase font-bold"
            >
              Mark Read
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* WORKSPACE SECTIONS OVERVIEW PANEL */}
        {/* ------------------------------------------------------------- */}

        {/* TAB A: OVERVIEW Hub */}
        {adminTab === 'overview' && (
          <div className="space-y-8">
            
            {/* 1. METRIC TILES CARDS BAR */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, desc: 'From paid transactions', color: 'text-purple-400' },
                { label: 'Authorized Orders', value: totalOrdersCount, desc: 'Logged queue rows', color: 'text-white' },
                { label: 'Storefront Visitors', value: totalCustomers, desc: 'Newsletter subscribers', color: 'text-zinc-300' },
                { label: 'Star reviews Approved', value: approvedReviewsCount, desc: 'Authentic comments', color: 'text-amber-400' }
              ].map((met, i) => (
                <div key={i} className="bg-zinc-900 border border-neutral-805 p-5 rounded-xl space-y-1.5 shadow-xl">
                  <h4 className="text-[10px] font-black text-zinc-550 uppercase tracking-widest text-zinc-500">{met.label}</h4>
                  <p className={`text-2xl font-black font-sans tracking-tight leading-none ${met.color}`}>{met.value}</p>
                  <p className="text-[10px] text-zinc-500 leading-none">{met.desc}</p>
                </div>
              ))}
            </div>

            {/* 2. ANALYTICS CHART BLOCK */}
            <div className="bg-zinc-90 w-full border border-neutral-805 rounded-xl p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-black tracking-widest text-white uppercase border-b border-neutral-900 pb-3">6-MONTH SALES ANATOMY graph</h3>
              
              {/* SVG vector graph lines plotting */}
              <div className="relative pt-6 max-w-lg">
                <svg viewBox="0 0 500 120" className="w-full h-auto overflow-visible select-none pointer-events-none">
                  {/* Grid background lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#1d1d1f" strokeDasharray="3" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#1d1d1f" strokeDasharray="3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#1d1d1f" strokeDasharray="3" />

                  {/* Shading fill */}
                  <path
                    d={`${linePath} L 500 120 L 0 120 Z`}
                    fill="url(#gradient)"
                    opacity="0.12"
                  />

                  {/* Primary Line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {points.map((p, index) => {
                    const x = (index / (points.length - 1)) * graphWidth;
                    const y = graphHeight - ((p.val - minVal) / range) * graphHeight;
                    return (
                      <g key={index}>
                        <circle cx={x} cy={y} r="5" fill="#882be2" stroke="#ffffff" strokeWidth="1.5" />
                        <text x={x} y={y - 10} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                          ${p.val}
                        </text>
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Months selectors */}
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 mt-4 px-2 select-none">
                  {points.map((p, index) => (
                    <span key={index}>{p.m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. RECENT CONSOLE LOG ACTIVITIES */}
            <div className="bg-zinc-90 w-full border border-neutral-805 rounded-xl p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-black tracking-widest text-white uppercase border-b border-neutral-900 pb-3">LIVE RECENT ACTIVITIES FEED</h3>
              <div className="space-y-3 font-mono text-xs max-h-56 overflow-y-auto">
                {orders.slice(0, 3).map((ord, idx) => (
                  <div key={idx} className="flex gap-4 items-start py-2 border-b border-neutral-900 last:border-b-0">
                    <span className="text-purple-400">✦</span>
                    <p className="text-neutral-400">
                      Order <strong className="text-white">{ord.id}</strong> received from <strong className="text-white">{ord.customerName}</strong> worth <strong className="text-white">${ord.total.toFixed(2)}</strong>. Shipment tagged: {ord.status}.
                    </p>
                  </div>
                ))}
                {contactMessages.slice(0, 2).map((msg, idx) => (
                  <div key={idx} className="flex gap-4 items-start py-2 border-b border-neutral-900 last:border-b-0">
                    <span className="text-indigo-400">✦</span>
                    <p className="text-neutral-400">
                      Contact Ticket <strong className="text-white">{msg.id}</strong> submitted by <strong className="text-white">{msg.name}</strong> on subject "{msg.subject}".
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB B: ORDERS LISTS */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            <div className="border border-neutral-805 rounded-xl bg-zinc-900/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium text-neutral-400 border-collapse">
                  <thead className="bg-zinc-900 border-b border-neutral-850 text-white font-bold text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-4">ORDER ID</th>
                      <th className="p-4">CUSTOMER REGIST</th>
                      <th className="p-4 text-center">ITEMS</th>
                      <th className="p-4">TOTAL PRICE</th>
                      <th className="p-4">PAY</th>
                      <th className="p-4">SHIP STATUS</th>
                      <th className="p-4 text-right">CONTROLS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono text-xs">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-900/40">
                        <td className="p-4 font-bold text-white">{ord.id}</td>
                        <td className="p-4 leading-relaxed font-sans">
                          <p className="font-bold text-white uppercase text-xs">{ord.customerName}</p>
                          <p className="text-zinc-500 scale-95 origin-left">{ord.customerEmail}</p>
                        </td>
                        <td className="p-4 text-center text-zinc-300 font-sans">{ord.items.reduce((acc, curr) => acc + curr.quantity, 0)}</td>
                        <td className="p-4 text-purple-400 font-black">${ord.total.toFixed(2)}</td>
                        <td className="p-4">
                          <select
                            id={`pay-status-${ord.id}`}
                            value={ord.paymentStatus}
                            onChange={(e) => updateOrderPaymentStatus(ord.id, e.target.value as any)}
                            className="bg-neutral-950 text-[10px] border border-neutral-800 rounded px-1.5 py-1 uppercase text-zinc-300"
                          >
                            <option value="paid">PAID</option>
                            <option value="unpaid">UNPAID</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            id={`ship-status-${ord.id}`}
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            className="bg-neutral-905 text-[10px] border border-neutral-800 rounded px-1.5 py-1 uppercase text-zinc-300 font-bold text-purple-400"
                          >
                            <option value="pending">PENDING</option>
                            <option value="processing">PROCESSING</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            id={`print-invoice-btn-${ord.id}`}
                            onClick={() => {
                              alert(`Invoice stream prepared for Order: ${ord.id}. Directing to Air Logistics Carrier!`);
                            }}
                            className="p-1 px-2.5 rounded bg-zinc-950 text-white hover:bg-neutral-850 transition text-[9px] font-bold"
                          >
                            PACK LBL
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB C: PRODUCT DIRECTORY */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center bg-zinc-90 w-full mb-2">
              <h3 className="text-xs font-black tracking-widest text-neutral-300 uppercase">ACTIVE DEVICES ({products.length})</h3>
              <button
                id="create-new-product-btn"
                onClick={() => {
                  resetProductFields();
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                className="px-4.5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-extrabold uppercase text-white flex items-center gap-1.5 cursor-pointer tracking-widest"
              >
                <Plus className="h-4 w-4" />
                <span>NEW PRODUCT</span>
              </button>
            </div>

            {/* INLINE PRODUCT POPUP FORM */}
            <AnimatePresence>
              {showProductForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowProductForm(false)}
                    className="absolute inset-0 bg-black/80"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-neutral-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-white space-y-6"
                  >
                    <button
                      id="product-form-close-btn"
                      onClick={() => setShowProductForm(false)}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>

                    <h2 className="text-sm font-black tracking-widest uppercase text-white">
                      {editingProduct ? `REWRITE "${editingProduct.name}" GEAR` : 'DEFINE BRAND NEW PRODUCT'}
                    </h2>
                    
                    <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-wider font-extrabold text-neutral-450 uppercase text-zinc-400 mb-1">Product Name</label>
                          <input
                            id="form-pname"
                            type="text"
                            required
                            placeholder="e.g. Elyvate Premium Star Dome"
                            value={pName}
                            onChange={(e) => {
                              setPName(e.target.value);
                              setPSlug(e.target.value.toLowerCase().split(' ').join('-'));
                            }}
                            className="w-full bg-neutral-950 px-3 py-2 border border-neutral-800 rounded-md focus:outline-none focus:border-purple-500 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-wider font-extrabold text-neutral-450 uppercase text-zinc-400 mb-1">SKU Reference</label>
                          <input
                            id="form-psku"
                            type="text"
                            required
                            placeholder="e.g. ELY-SDO-11"
                            value={pSku}
                            onChange={(e) => setPSku(e.target.value)}
                            className="w-full bg-neutral-950 px-3 py-2 border border-neutral-800 rounded-md focus:outline-none focus:border-purple-500 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-wider font-extrabold text-neutral-450 uppercase text-zinc-400 mb-1">Slug (URL Mapping)</label>
                          <input
                            id="form-pslug"
                            type="text"
                            required
                            value={pSlug}
                            onChange={(e) => setPSlug(e.target.value)}
                            className="w-full bg-neutral-950 px-3 py-2 border border-neutral-800 rounded-md text-neutral-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-wider font-extrabold text-neutral-450 uppercase text-zinc-400 mb-1">Category type</label>
                          <select
                            id="form-pcat"
                            value={pCategory}
                            onChange={(e) => setPCategory(e.target.value)}
                            className="w-full bg-neutral-950 px-3 py-2 border border-neutral-800 rounded-md uppercase focus:outline-none"
                          >
                            <option value="Projectors">Projectors</option>
                            <option value="Home Decor">Home Decor</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Bundles">Bundles</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-wider font-extrabold text-neutral-450 uppercase text-zinc-400 mb-1">Original Price ($)</label>
                          <input
                            id="form-pprice"
                            type="number"
                            required
                            step="0.01"
                            value={pPrice}
                            onChange={(e) => setPPrice(Number(e.target.value))}
                            className="w-full bg-neutral-950 px-3 py-2 border border-neutral-800 rounded-md text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-wider font-extrabold text-neutral-450 uppercase text-zinc-400 mb-1">Discount Sale Price ($)</label>
                          <input
                            id="form-psale-price"
                            type="number"
                            step="0.01"
                            placeholder="Leave empty for no sale"
                            value={pSalePrice || ''}
                            onChange={(e) => setPSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full bg-neutral-950 px-3 py-2 border border-neutral-800 rounded-md text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <label className="flex items-center gap-2.5 text-zinc-350 cursor-pointer">
                          <input
                            id="form-pfeatured"
                            type="checkbox"
                            checked={pFeatured}
                            onChange={(e) => setPFeatured(e.target.checked)}
                            className="rounded border-zinc-800 bg-neutral-950 text-purple-600 focus:ring-0 text-white"
                          />
                          <span>FEATURED BANNER</span>
                        </label>
                        <label className="flex items-center gap-2.5 text-zinc-350 cursor-pointer">
                          <input
                            id="form-pbestseller"
                            type="checkbox"
                            checked={pBestSeller}
                            onChange={(e) => setPBestSeller(e.target.checked)}
                            className="rounded border-zinc-800 bg-neutral-950 text-purple-600 focus:ring-0 text-white"
                          />
                          <span>BEST SELLER SEED</span>
                        </label>
                        <label className="flex items-center gap-2.5 text-zinc-350 cursor-pointer">
                          <input
                            id="form-pnewarrival"
                            type="checkbox"
                            checked={pNewArrival}
                            onChange={(e) => setPNewArrival(e.target.checked)}
                            className="rounded border-zinc-800 bg-neutral-950 text-purple-600 focus:ring-0 text-white"
                          />
                          <span>NEW ARRIVALS TRAJ</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-wider font-extrabold uppercase text-zinc-400 mb-1">Status</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" checked={pStatus === 'active'} onChange={() => setPStatus('active')} className="text-purple-600 focus:ring-0" />
                            <span>ACTIVE RETAIL</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" checked={pStatus === 'draft'} onChange={() => setPStatus('draft')} className="text-purple-600 focus:ring-0" />
                            <span>DRAFT SECURE</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-wider font-extrabold uppercase text-zinc-400 mb-0.5">Short Deck summary (Lighthouse Target)</label>
                        <input
                          id="form-pshortdesc"
                          type="text"
                          placeholder="Fitted with direct steppers for whisper action"
                          value={pShortDesc}
                          onChange={(e) => setPShortDesc(e.target.value)}
                          className="w-full bg-neutral-950 px-3 py-2 border border-neutral-800 rounded-md focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] tracking-wider font-extrabold uppercase text-zinc-400 mb-0.5">Full Technical Spec log</label>
                        <textarea
                          id="form-pdesc"
                          required
                          rows={4}
                          placeholder="Comprehensive features, glass coatings specifications, and packaging..."
                          value={pDesc}
                          onChange={(e) => setPDesc(e.target.value)}
                          className="w-full bg-neutral-950 px-3 py-2 border border-neutral-800 rounded-md focus:outline-none resize-none"
                        />
                      </div>

                      {/* Display image url listings */}
                      <div className="space-y-2">
                        <label className="block text-[10px] tracking-wider font-extrabold uppercase text-zinc-400">Ground image URLs cataloged</label>
                        <div className="flex gap-2">
                          <input
                            id="form-new-img-url"
                            type="text"
                            placeholder="Add unsplash url reference"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="flex-1 bg-neutral-950 px-3 py-1.5 border border-neutral-800 rounded-md"
                          />
                          <button
                            id="form-add-img-btn"
                            type="button"
                            onClick={() => {
                              if (newImageUrl) {
                                setPImages([...pImages, newImageUrl]);
                                setNewImageUrl('');
                              }
                            }}
                            className="bg-neutral-800 px-3 rounded hover:bg-neutral-700 font-bold"
                          >
                            Add URL
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-500">Active URLs lists: {pImages.join(' , ')}</p>
                      </div>

                      {/* Form Controls */}
                      <div className="pt-4 flex justify-end gap-3 font-bold border-t border-neutral-800">
                        <button
                          id="form-cancel-btn"
                          type="button"
                          onClick={() => setShowProductForm(false)}
                          className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          id="form-save-submit-btn"
                          type="submit"
                          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md uppercase"
                        >
                          Save Specifications
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* List products grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod.id} className="bg-zinc-900 border border-neutral-855 rounded-xl p-4 flex flex-col justify-between space-y-4">
                  <div className="flex gap-4">
                    <img src={prod.images[0]} alt="" className="h-14 w-14 object-cover rounded-lg shrink-0" />
                    <div>
                      <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase">SKU: {prod.sku}</span>
                      <h4 className="text-xs font-black text-white uppercase line-clamp-1 mt-0.5">{prod.name}</h4>
                      <p className="text-[10px] font-mono text-purple-400 font-bold mt-1">${prod.salePrice || prod.price}</p>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-neutral-850/60 flex items-center justify-between text-[11px] font-bold">
                    <span className={`text-[9px] px-2.5 py-0.5 rounded text-white font-mono uppercase ${prod.status === 'active' ? 'bg-green-950/40 text-green-400 border border-green-800/20' : 'bg-red-955/40 text-red-400 border border-red-800/20'}`}>
                      {prod.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        id={`edit-prod-btn-${prod.id}`}
                        onClick={() => handleEditProductClick(prod)}
                        className="p-1 px-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-purple-400 transition cursor-pointer"
                        title="Edit spec fields"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        id={`dup-prod-btn-${prod.id}`}
                        onClick={() => duplicateProduct(prod.id)}
                        className="p-1 px-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-indigo-400 transition cursor-pointer"
                        title="Duplicate spec sheet"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        id={`del-prod-btn-${prod.id}`}
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1 px-2 hover:bg-red-950/20 rounded text-neutral-500 hover:text-red-400 transition cursor-pointer"
                        title="Delete specs record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB D: EDITORIALS CMS EDITOR */}
        {adminTab === 'cms' && (
          <div className="space-y-8 max-w-4xl">
            
            <div className="bg-zinc-900 border border-neutral-805 p-6 rounded-xl space-y-6">
              <h3 className="text-xs font-black tracking-widest text-white uppercase border-b border-neutral-800 pb-3 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-purple-400" />
                <span>1. HERO LANDING CONTENT LAYOUTS</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Hero Main Title Headline</label>
                  <input
                    id="cms-hero-title-input"
                    type="text"
                    value={cmsHeroTitle}
                    onChange={(e) => setCmsHeroTitle(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Hero Subtitle</label>
                  <input
                    id="cms-hero-sub-input"
                    type="text"
                    value={cmsHeroSubtitle}
                    onChange={(e) => setCmsHeroSubtitle(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Hero CTA text</label>
                  <input
                    id="cms-hero-cta-input"
                    type="text"
                    value={cmsHeroCta}
                    onChange={(e) => setCmsHeroCta(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Hero Graphic Background Image URL</label>
                  <input
                    id="cms-hero-img-input"
                    type="text"
                    value={cmsHeroImg}
                    onChange={(e) => setCmsHeroImg(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-neutral-805 p-6 rounded-xl space-y-6">
              <h3 className="text-xs font-black tracking-widest text-white uppercase border-b border-neutral-800 pb-3 flex items-center gap-1.5">
                <Bookmark className="h-4 w-4 text-purple-400" />
                <span>2. ABOUT PAGE STORYTELLING CMS</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Story Section Main title</label>
                  <input
                    id="cms-about-title-input"
                    type="text"
                    value={cmsAboutTitle}
                    onChange={(e) => setCmsAboutTitle(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Story subtext quote</label>
                  <input
                    id="cms-about-sub-input"
                    type="text"
                    value={cmsAboutSub}
                    onChange={(e) => setCmsAboutSub(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Story Body Contents text</label>
                  <textarea
                    id="cms-about-content-textarea"
                    rows={4}
                    value={cmsAboutContent}
                    onChange={(e) => setCmsAboutContent(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Mission text</label>
                  <input
                    id="cms-about-mission-input"
                    type="text"
                    value={cmsAboutMission}
                    onChange={(e) => setCmsAboutMission(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Vision text</label>
                  <input
                    id="cms-about-vision-input"
                    type="text"
                    value={cmsAboutVision}
                    onChange={(e) => setCmsAboutVision(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Story Story Teller Image URL</label>
                  <input
                    id="cms-about-img-input"
                    type="text"
                    value={cmsAboutImage}
                    onChange={(e) => setCmsAboutImage(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-neutral-805 p-6 rounded-xl space-y-6">
              <h3 className="text-xs font-black tracking-widest text-white uppercase border-b border-neutral-800 pb-3 flex items-center gap-1.5">
                <Palette className="h-4 w-4 text-purple-400" />
                <span>3. WORKSPACE THEME & BRANDING SETTINGS</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Website Brand name</label>
                  <input
                    id="settings-brand-name-input"
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Primary Color Accent Overrides</label>
                  <input
                    id="settings-accent-color-input"
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Banner Announcement message</label>
                  <input
                    id="settings-banner-msg-input"
                    type="text"
                    value={siteBanner}
                    onChange={(e) => setSiteBanner(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-neutral-805 p-6 rounded-xl space-y-6">
              <h3 className="text-xs font-black tracking-widest text-white uppercase border-b border-neutral-800 pb-3 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-purple-400" />
                <span>4. SEO CRITERIA METRICS (LIGHTHOUSE TARGETS)</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Meta/browser tab title</label>
                  <input
                    id="seo-title-input"
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">OG cover URL image</label>
                  <input
                    id="seo-ogimg-input"
                    type="text"
                    value={seoOgImage}
                    onChange={(e) => setSeoOgImage(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Meta Descriptions tag</label>
                  <input
                    id="seo-desc-input"
                    type="text"
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-wider font-bold mb-1 uppercase text-neutral-400">Search keywords tags (comma seperated)</label>
                  <input
                    id="seo-keys-input"
                    type="text"
                    value={seoKeys}
                    onChange={(e) => setSeoKeys(e.target.value)}
                    className="w-full bg-neutral-950 text-xs px-3.5 py-2.5 rounded-lg border border-neutral-800 text-white"
                  />
                </div>
              </div>
            </div>

            {cmsSaveAlert && (
              <div className="p-4 bg-green-950/20 border border-green-800/25 text-green-400 text-xs font-semibold uppercase rounded-xl flex items-center gap-2">
                <Check className="h-4.5 w-4.5" />
                <span>{cmsSaveAlert}</span>
              </div>
            )}

            <button
              id="cms-save-trigger-btn"
              onClick={handleSaveCMS}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-500 rounded-lg text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>SYNC ALL LANDING CONTENT EDITS</span>
            </button>

          </div>
        )}

        {/* TAB E: COUPONS DISCOUNTS SYSTEM */}
        {adminTab === 'coupons' && (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center bg-zinc-90 w-full mb-2">
              <h3 className="text-xs font-black tracking-widest text-neutral-300 uppercase">ACTIVE DISCOUNTS ENGINE ({coupons.length})</h3>
              <button
                id="create-coupon-btn"
                onClick={() => setShowCouponForm(true)}
                className="px-4.5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-extrabold uppercase text-white flex items-center gap-1.5 cursor-pointer tracking-widest"
              >
                <Plus className="h-4 w-4" />
                <span>NEW DISCOUNT TICKET</span>
              </button>
            </div>

            {/* INLINE COUPON FORM */}
            <AnimatePresence>
              {showCouponForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowCouponForm(false)}
                    className="absolute inset-0 bg-black/80"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-sm rounded-xl bg-zinc-900 border border-neutral-800 p-6 shadow-2xl text-white"
                  >
                    <button
                      id="coupon-modal-close"
                      onClick={() => setShowCouponForm(false)}
                      className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>

                    <h2 className="text-sm font-black tracking-widest uppercase mb-4">CONSTITUTE DISCOUNT</h2>
                    
                    <form onSubmit={handleCreateCouponSubmit} className="space-y-4 text-xs font-semibold">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-neutral-400 mb-1">Coupon Code</label>
                        <input
                          id="coupon-code-input"
                          type="text"
                          required
                          placeholder="e.g. FLASH30"
                          value={cCode}
                          onChange={(e) => setCCode(e.target.value)}
                          className="w-full bg-neutral-950 px-3.5 py-2 rounded border border-neutral-800 focus:outline-none uppercase"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-wider uppercase text-neutral-400 mb-1">Reduction Type</label>
                          <select
                            id="coupon-type-select"
                            value={cType}
                            onChange={(e) => setCType(e.target.value as any)}
                            className="w-full bg-neutral-950 px-3.5 py-2 rounded border border-neutral-800"
                          >
                            <option value="percentage">% Percentage</option>
                            <option value="fixed">$ Fixed Price</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-wider uppercase text-neutral-400 mb-1">Discount Magnitude</label>
                          <input
                            id="coupon-val-input"
                            type="number"
                            required
                            value={cValue}
                            onChange={(e) => setCValue(Number(e.target.value))}
                            className="w-full bg-neutral-950 px-3.5 py-2 rounded border border-neutral-800 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] tracking-wider uppercase text-neutral-400 mb-1">Expiry Date</label>
                          <input
                            id="coupon-expiry-input"
                            type="date"
                            required
                            value={cExpiry}
                            onChange={(e) => setCExpiry(e.target.value)}
                            className="w-full bg-neutral-950 px-3.5 py-2 rounded border border-neutral-800 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-wider uppercase text-neutral-400 mb-1 text-purple-400">Redeem Bounds</label>
                          <input
                            id="coupon-limit-input"
                            type="number"
                            required
                            value={cLimit}
                            onChange={(e) => setCLimit(Number(e.target.value))}
                            className="w-full bg-neutral-950 px-3.5 py-2 rounded border border-neutral-800 text-white"
                          />
                        </div>
                      </div>

                      <button
                        id="coupon-save-submit"
                        type="submit"
                        className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded text-center text-xs tracking-widest font-black uppercase text-white cursor-pointer"
                      >
                        ENGRAVE DISCOUNT TICKET
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <div className="border border-neutral-805 bg-zinc-900/40 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-400 border-collapse">
                  <thead className="bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-4">DISCOUNT CODE</th>
                      <th className="p-4">DEDUCTION VALUE</th>
                      <th className="p-4">EXPIRY BOUNDS</th>
                      <th className="p-4 text-center">USAGE RATIOS</th>
                      <th className="p-4">STATE</th>
                      <th className="p-4 text-right">CONTROLS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono text-xs">
                    {coupons.map((cop) => (
                      <tr key={cop.id} className="hover:bg-neutral-900/40">
                        <td className="p-4 text-white font-black">{cop.code}</td>
                        <td className="p-4 text-purple-400 font-bold">{cop.type === 'percentage' ? `${cop.value}%` : `$${cop.value}`}</td>
                        <td className="p-4">{new Date(cop.expiryDate).toLocaleDateString()}</td>
                        <td className="p-4 text-center">{cop.usedCount} / {cop.usageLimit}</td>
                        <td className="p-4">
                          <button
                            id={`toggle-cop-status-${cop.id}`}
                            onClick={() => toggleCouponStatus(cop.id)}
                            className="p-1 focus:outline-none"
                          >
                            {cop.status === 'active' ? (
                              <span className="text-[9px] font-black text-green-400 bg-green-950/40 border border-green-800/30 px-2 py-0.5 rounded uppercase">ACTIVE</span>
                            ) : (
                              <span className="text-[9px] font-black text-red-450 bg-red-955/40 border border-red-800/30 px-2 py-0.5 rounded uppercase">INACTIVE</span>
                            )}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            id={`del-cop-btn-${cop.id}`}
                            onClick={() => deleteCoupon(cop.id)}
                            className="p-1.5 hover:bg-neutral-800 rounded text-neutral-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB F: REVIEWS TICKETS */}
        {adminTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="text-xs font-black tracking-widest text-neutral-300 uppercase">EXPERIENCES MODERATION PANEL ({reviews.length})</h3>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-zinc-900 border border-neutral-855 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-baseline gap-2 text-xs flex-wrap">
                      <span className="font-bold text-white uppercase text-xs">{rev.customerName}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      <span className="text-[10px] text-purple-400 border border-purple-800/30 font-bold px-1.5 py-0.5 rounded uppercase">
                        {rev.productName}
                      </span>
                    </div>

                    <p className="text-neutral-300 text-xs italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-xs">
                    
                    {/* Status check tag */}
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                      rev.status === 'approved' ? 'bg-green-950/20 text-green-400 border border-green-800/30' :
                      rev.status === 'rejected' ? 'bg-red-955/20 text-red-500 border border-red-800/30' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {rev.status}
                    </span>

                    {/* Toggle feature */}
                    <button
                      id={`feature-rev-btn-${rev.id}`}
                      onClick={() => toggleFeatureReview(rev.id)}
                      className={`p-1 px-2.5 rounded text-[10px] font-bold border transition ${
                        rev.isFeatured 
                          ? 'bg-amber-950/20 text-amber-400 border-amber-800/30' 
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      ★ {rev.isFeatured ? 'FEATURED' : 'FEATURE'}
                    </button>

                    {/* Approval toggle */}
                    {rev.status !== 'approved' && (
                      <button
                        id={`approve-rev-btn-${rev.id}`}
                        onClick={() => moderateReview(rev.id, 'approved')}
                        className="p-1 px-2 text-[10px] font-bold rounded bg-green-900 hover:bg-green-800 text-white flex items-center justify-center cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        id={`reject-rev-btn-${rev.id}`}
                        onClick={() => moderateReview(rev.id, 'rejected')}
                        className="p-1 px-2 text-[10px] font-bold rounded bg-red-950 hover:bg-red-900 text-red-400 flex items-center justify-center cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB G: INBOX MESSAGES & SUBS */}
        {adminTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* L: SUPPORT TICKETS LISTS (COLUMN 7) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xs font-black tracking-widest text-neutral-350 uppercase">SUPPORT DISPATCH MESSAGES ({contactMessages.length})</h3>
              
              <div className="space-y-4">
                {contactMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-5 rounded-xl border transition ${
                      msg.isRead ? 'border-neutral-900 bg-neutral-900/10 opacity-75' : 'border-neutral-805 bg-zinc-900'
                    }`}
                  >
                    <div className="flex justify-between items-baseline gap-4 flex-wrap text-xs">
                      <div>
                        <h4 className="font-bold text-white uppercase text-xs">{msg.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-500">{msg.email}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-3.5 space-y-2">
                      <p className="text-xs font-bold text-white uppercase">SUB: "{msg.subject}"</p>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {msg.message}
                      </p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-neutral-850/60 flex justify-end">
                      <button
                        id={`toggle-msg-read-${msg.id}`}
                        onClick={() => toggleMessageRead(msg.id)}
                        className={`text-[9px] font-mono tracking-wider font-extrabold px-3 py-1 bg-neutral-950 text-white rounded hover:bg-neutral-800 uppercase ${
                          msg.isRead ? 'text-zinc-500' : 'text-purple-400'
                        }`}
                      >
                        {msg.isRead ? 'Mark Unread' : 'Mark Inbound Read'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* R: NEWSLETTER SUBSCRIBERS (COLUMN 5) */}
            <div className="lg:col-span-5 bg-zinc-900 border border-neutral-805 p-5 rounded-xl space-y-6">
              <h3 className="text-xs font-black tracking-widest text-white uppercase border-b border-neutral-800 pb-3 block">SUBSCRIBERS EMAIL STREAM ({subscribers.length})</h3>
              
              <div className="space-y-2.5 font-mono text-xs max-h-96 overflow-y-auto pr-1">
                {subscribers.map((s, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-neutral-900 last:border-b-0">
                    <span className="text-neutral-300">{s.email}</span>
                    <span className="text-[10px] text-zinc-650 text-zinc-500">{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {subscribers.length === 0 && (
                  <div className="py-8 text-center text-zinc-600 text-[10px]">
                    <p>NO DIRECT SUBSCRIBER REGISTERS DISPATCHED TODAY IN LOCAL STATE.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
