import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product, Review, Order, Coupon, CMSSettings, SiteSettings, SeoSettings,
  ContactMessage, NewsletterSubscriber, AppNotification
} from './types';
import {
  ALL_PRODUCTS as INITIAL_PRODUCTS, INITIAL_REVIEWS, DEFAULT_CMS, DEFAULT_SEO,
  DEFAULT_SITE_SETTINGS, INITIAL_COUPONS
} from './data';
import {
  fetchProducts, upsertProduct, deleteProductDb,
  fetchOrders, insertOrder, updateOrderStatusDb, updateOrderPaymentDb,
  fetchReviews, insertReview, updateReviewStatus,
  fetchMessages, insertMessage, toggleMessageReadDb,
  insertSubscriber, fetchCoupons, upsertCoupon, deleteCouponDb,
  sendOrderEmail
} from './lib/db';
import { isSupabaseEnabled } from './lib/supabase';

interface CartItem { product: Product; quantity: number; selectedColor: string; }

interface AppContextType {
  products: Product[]; reviews: Review[]; orders: Order[]; coupons: Coupon[];
  cms: CMSSettings; seo: SeoSettings; siteSettings: SiteSettings;
  contactMessages: ContactMessage[]; subscribers: NewsletterSubscriber[];
  notifications: AppNotification[]; wishlist: string[]; cart: CartItem[];
  activeCoupon: Coupon | null;
  currentCustomer: { name: string; email: string; phone: string } | null;
  isAdmin: boolean; isDbConnected: boolean;
  currentView: 'customer' | 'admin';
  customerTab: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'about' | 'contact' | 'dashboard' | 'reviews_list';
  selectedProductSlug: string | null;
  adminTab: 'overview' | 'orders' | 'products' | 'cms' | 'coupons' | 'reviews' | 'messages' | 'settings';
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  setView: (view: 'customer' | 'admin') => void;
  setCustomerTab: (tab: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'about' | 'contact' | 'dashboard' | 'reviews_list') => void;
  setSelectedProductSlug: (slug: string | null) => void;
  setAdminTab: (tab: 'overview' | 'orders' | 'products' | 'cms' | 'coupons' | 'reviews' | 'messages' | 'settings') => void;
  customerLogin: (email: string, name: string, phone?: string) => void;
  customerLogout: () => void;
  adminLogin: () => boolean;
  adminLogout: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  addReview: (productId: string, productName: string, customerName: string, rating: number, comment: string, image?: string) => void;
  moderateReview: (id: string, status: 'approved' | 'rejected') => void;
  toggleFeatureReview: (id: string) => void;
  addToCart: (product: Product, quantity: number, selectedColor: string) => void;
  updateCartQuantity: (productId: string, selectedColor: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;
  placeOrder: (shippingAddress: Order['shippingAddress'], customerInfo: { name: string; email: string; phone: string }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderPaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  updateCms: (cms: CMSSettings) => void;
  updateSeo: (seo: SeoSettings) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  addContactMessage: (name: string, email: string, subject: string, message: string) => void;
  toggleMessageRead: (id: string) => void;
  addSubscriber: (email: string) => { success: boolean; message: string };
  addNotification: (title: string, message: string, type: AppNotification['type']) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  toggleWishlist: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const loadState = <T,>(key: string, fallback: T): T => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
};
const saveState = <T,>(key: string, value: T) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => loadState('ely_products', INITIAL_PRODUCTS));
  const [reviews, setReviews] = useState<Review[]>(() => loadState('ely_reviews', INITIAL_REVIEWS));
  const [orders, setOrders] = useState<Order[]>(() => loadState('ely_orders', []));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadState('ely_coupons', INITIAL_COUPONS));
  const [cms, setCms] = useState<CMSSettings>(() => loadState('ely_cms', DEFAULT_CMS));
  const [seo, setSeo] = useState<SeoSettings>(() => loadState('ely_seo', DEFAULT_SEO));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => loadState('ely_site_settings', DEFAULT_SITE_SETTINGS));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => loadState('ely_contact_messages', []));
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => loadState('ely_subscribers', []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadState('ely_notifications', []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadState('ely_wishlist', []));
  const [cart, setCart] = useState<CartItem[]>(() => loadState('ely_cart', []));
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<{ name: string; email: string; phone: string } | null>(() => loadState('ely_customer', null));
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [customerTab, setCustomerTabState] = useState<AppContextType['customerTab']>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<AppContextType['adminTab']>('overview');
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(() => loadState('ely_theme', 'light'));

  // Load from Supabase on mount
  useEffect(() => {
    if (!isSupabaseEnabled) return;
    (async () => {
      const [dbProducts, dbOrders, dbReviews, dbMessages, dbCoupons] = await Promise.all([
        fetchProducts(), fetchOrders(), fetchReviews(), fetchMessages(), fetchCoupons()
      ]);
      if (dbProducts) { setProducts(dbProducts); setIsDbConnected(true); }
      if (dbOrders) setOrders(dbOrders);
      if (dbReviews) setReviews(dbReviews);
      if (dbMessages) setContactMessages(dbMessages);
      if (dbCoupons) setCoupons(dbCoupons);
    })();
  }, []);

  const handleSetThemeMode = (mode: 'light' | 'dark') => {
    setThemeModeState(mode);
    saveState('ely_theme', mode);
  };

  const setView = (view: 'customer' | 'admin') => setCurrentView(view);
  const setCustomerTab = (tab: AppContextType['customerTab']) => setCustomerTabState(tab);

  const customerLogin = (email: string, name: string, phone = '') => {
    const c = { email, name, phone };
    setCurrentCustomer(c);
    saveState('ely_customer', c);
  };
  const customerLogout = () => { setCurrentCustomer(null); saveState('ely_customer', null); };
  const adminLogin = () => { setIsAdmin(true); setCurrentView('admin'); return true; };
  const adminLogout = () => { setIsAdmin(false); setCurrentView('customer'); };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const p = { ...product, id: 'p-' + Date.now().toString() } as Product;
    const updated = [p, ...products];
    setProducts(updated); saveState('ely_products', updated);
    upsertProduct(p);
  };
  const editProduct = (product: Product) => {
    const updated = products.map(p => p.id === product.id ? product : p);
    setProducts(updated); saveState('ely_products', updated);
    upsertProduct(product);
  };
  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated); saveState('ely_products', updated);
    deleteProductDb(id);
  };
  const duplicateProduct = (id: string) => {
    const src = products.find(p => p.id === id);
    if (!src) return;
    const dup: Product = { ...src, id: 'p-' + Date.now(), name: src.name + ' (Copy)', slug: src.slug + '-copy-' + Date.now(), status: 'draft' };
    const updated = [dup, ...products];
    setProducts(updated); saveState('ely_products', updated);
    upsertProduct(dup);
  };

  const addReview = (productId: string, productName: string, customerName: string, rating: number, comment: string, image?: string) => {
    const r: Review = { id: 'rev-' + Date.now(), productId, productName, customerName, rating, comment, image, status: 'pending', isFeatured: false, createdAt: new Date().toISOString() };
    const updated = [r, ...reviews];
    setReviews(updated); saveState('ely_reviews', updated);
    insertReview(r);
  };
  const moderateReview = (id: string, status: 'approved' | 'rejected') => {
    const updated = reviews.map(r => r.id === id ? { ...r, status } : r);
    setReviews(updated); saveState('ely_reviews', updated);
    updateReviewStatus(id, status);
  };
  const toggleFeatureReview = (id: string) => {
    const updated = reviews.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r);
    setReviews(updated); saveState('ely_reviews', updated);
  };

  const addToCart = (product: Product, quantity: number, selectedColor: string) => {
    const existing = cart.find(c => c.product.id === product.id && c.selectedColor === selectedColor);
    const updated = existing
      ? cart.map(c => c.product.id === product.id && c.selectedColor === selectedColor ? { ...c, quantity: c.quantity + quantity } : c)
      : [...cart, { product, quantity, selectedColor }];
    setCart(updated); saveState('ely_cart', updated);
  };
  const updateCartQuantity = (productId: string, selectedColor: string, quantity: number) => {
    const updated = quantity <= 0
      ? cart.filter(c => !(c.product.id === productId && c.selectedColor === selectedColor))
      : cart.map(c => c.product.id === productId && c.selectedColor === selectedColor ? { ...c, quantity } : c);
    setCart(updated); saveState('ely_cart', updated);
  };
  const removeFromCart = (productId: string, selectedColor: string) => {
    const updated = cart.filter(c => !(c.product.id === productId && c.selectedColor === selectedColor));
    setCart(updated); saveState('ely_cart', updated);
  };
  const clearCart = () => { setCart([]); saveState('ely_cart', []); };

  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.status === 'active');
    if (!coupon) return { success: false, message: 'Invalid or expired coupon code' };
    if (new Date(coupon.expiryDate) < new Date()) return { success: false, message: 'This coupon has expired' };
    if (coupon.usedCount >= coupon.usageLimit) return { success: false, message: 'Coupon usage limit reached' };
    setActiveCoupon(coupon);
    return { success: true, message: `Coupon applied! ${coupon.type === 'percentage' ? coupon.value + '% off' : '$' + coupon.value + ' off'}` };
  };
  const removeCoupon = () => setActiveCoupon(null);
  const addCoupon = (coupon: Omit<Coupon, 'id' | 'usedCount'>) => {
    const c: Coupon = { ...coupon, id: 'cp-' + Date.now(), usedCount: 0 };
    const updated = [c, ...coupons];
    setCoupons(updated); saveState('ely_coupons', updated);
    upsertCoupon(c);
  };
  const toggleCouponStatus = (id: string) => {
    const updated = coupons.map(c => c.id === id ? { ...c, status: (c.status === 'active' ? 'inactive' : 'active') as Coupon['status'] } : c);
    setCoupons(updated); saveState('ely_coupons', updated);
    const c = updated.find(x => x.id === id);
    if (c) upsertCoupon(c);
  };
  const deleteCoupon = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    setCoupons(updated); saveState('ely_coupons', updated);
    deleteCouponDb(id);
  };

  const placeOrder = (shippingAddress: Order['shippingAddress'], customerInfo: { name: string; email: string; phone: string }) => {
    const subtotal = cart.reduce((acc, c) => acc + (c.product.salePrice || c.product.price) * c.quantity, 0);
    let discount = 0;
    if (activeCoupon) {
      discount = activeCoupon.type === 'percentage'
        ? Number((subtotal * (activeCoupon.value / 100)).toFixed(2))
        : Math.min(activeCoupon.value, subtotal);
    }
    const total = Number((subtotal - discount).toFixed(2));
    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customerName: customerInfo.name, customerEmail: customerInfo.email, customerPhone: customerInfo.phone,
      shippingAddress, items: cart.map((c, i) => ({
        id: `oi-${Date.now()}-${i}`, productId: c.product.id, productName: c.product.name,
        productImage: c.product.images[0], price: c.product.salePrice || c.product.price,
        quantity: c.quantity, selectedColor: c.selectedColor
      })),
      subtotal, discount, couponCode: activeCoupon?.code, shipping: 0, total,
      status: 'pending', paymentStatus: 'paid', createdAt: new Date().toISOString()
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders); saveState('ely_orders', updatedOrders);
    if (activeCoupon) {
      const updatedCoupons = coupons.map(c => c.id === activeCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c);
      setCoupons(updatedCoupons); saveState('ely_coupons', updatedCoupons);
    }
    addNotification('New Order Received', `${customerInfo.name} placed order ${newOrder.id} for $${total}`, 'order');
    clearCart();
    // Persist to DB + send email notification
    insertOrder(newOrder);
    sendOrderEmail(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated); saveState('ely_orders', updated);
    updateOrderStatusDb(orderId, status);
  };
  const updateOrderPaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o);
    setOrders(updated); saveState('ely_orders', updated);
    updateOrderPaymentDb(orderId, status);
  };

  const updateCms = (updatedCms: CMSSettings) => { setCms(updatedCms); saveState('ely_cms', updatedCms); addNotification('CMS Updated', 'Website content updated.', 'system'); };
  const updateSeo = (updatedSeo: SeoSettings) => { setSeo(updatedSeo); saveState('ely_seo', updatedSeo); };
  const updateSiteSettings = (s: SiteSettings) => { setSiteSettings(s); saveState('ely_site_settings', s); };

  const addContactMessage = (name: string, email: string, subject: string, message: string) => {
    const entry: ContactMessage = { id: 'msg-' + Date.now().toString().slice(-6), name, email, subject, message, createdAt: new Date().toISOString(), isRead: false };
    const updated = [entry, ...contactMessages];
    setContactMessages(updated); saveState('ely_contact_messages', updated);
    insertMessage(entry);
    addNotification('New Message', `${name} sent: "${subject}"`, 'contact');
  };
  const toggleMessageRead = (id: string) => {
    const msg = contactMessages.find(m => m.id === id);
    const updated = contactMessages.map(m => m.id === id ? { ...m, isRead: !m.isRead } : m);
    setContactMessages(updated); saveState('ely_contact_messages', updated);
    if (msg) toggleMessageReadDb(id, msg.isRead);
  };
  const addSubscriber = (email: string) => {
    const fmt = email.toLowerCase().trim();
    if (subscribers.some(s => s.email === fmt)) return { success: false, message: 'Already subscribed!' };
    const s: NewsletterSubscriber = { id: 'sub-' + Date.now().toString().slice(-6), email: fmt, createdAt: new Date().toISOString() };
    const updated = [...subscribers, s];
    setSubscribers(updated); saveState('ely_subscribers', updated);
    insertSubscriber(s);
    return { success: true, message: 'Welcome aboard! 🎉' };
  };

  const addNotification = (title: string, message: string, type: AppNotification['type']) => {
    const n: AppNotification = { id: 'notif-' + Date.now().toString().slice(-6), title, message, type, isRead: false, createdAt: new Date().toISOString() };
    const updated = [n, ...notifications];
    setNotifications(updated); saveState('ely_notifications', updated);
  };
  const clearNotification = (id: string) => { const u = notifications.filter(n => n.id !== id); setNotifications(u); saveState('ely_notifications', u); };
  const clearAllNotifications = () => { setNotifications([]); saveState('ely_notifications', []); };
  const toggleWishlist = (productId: string) => {
    const updated = wishlist.includes(productId) ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    setWishlist(updated); saveState('ely_wishlist', updated);
  };

  return (
    <AppContext.Provider value={{
      products, reviews, orders, coupons, cms, seo, siteSettings,
      contactMessages, subscribers, notifications, wishlist, cart, activeCoupon,
      currentCustomer, isAdmin, isDbConnected, currentView, customerTab, selectedProductSlug,
      adminTab, themeMode, setThemeMode: handleSetThemeMode,
      setView, setCustomerTab, setSelectedProductSlug, setAdminTab,
      customerLogin, customerLogout, adminLogin, adminLogout,
      addProduct, editProduct, deleteProduct, duplicateProduct,
      addReview, moderateReview, toggleFeatureReview,
      addToCart, updateCartQuantity, removeFromCart, clearCart,
      applyCoupon, removeCoupon, addCoupon, toggleCouponStatus, deleteCoupon,
      placeOrder, updateOrderStatus, updateOrderPaymentStatus,
      updateCms, updateSeo, updateSiteSettings,
      addContactMessage, toggleMessageRead, addSubscriber,
      addNotification, clearNotification, clearAllNotifications, toggleWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
