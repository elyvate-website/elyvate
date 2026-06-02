// db.ts — Supabase data layer
// All functions gracefully fall back to local state if Supabase is not configured.
import { supabase } from './supabase';
import type { Product, Order, Review, ContactMessage, NewsletterSubscriber, Coupon } from '../types';

// ─── PRODUCTS ───────────────────────────────────────────────
export async function fetchProducts(): Promise<Product[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchProducts:', error); return null; }
  return data.map(mapProduct);
}

export async function upsertProduct(p: Product): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('products').upsert(mapProductOut(p));
  if (error) console.error('upsertProduct:', error);
}

export async function deleteProductDb(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) console.error('deleteProduct:', error);
}

// ─── ORDERS ─────────────────────────────────────────────────
export async function fetchOrders(): Promise<Order[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchOrders:', error); return null; }
  return data.map(mapOrder);
}

export async function insertOrder(o: Order): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('orders').insert(mapOrderOut(o));
  if (error) console.error('insertOrder:', error);
}

export async function updateOrderStatusDb(id: string, status: Order['status']): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) console.error('updateOrderStatus:', error);
}

export async function updateOrderPaymentDb(id: string, payment_status: Order['paymentStatus']): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('orders').update({ payment_status }).eq('id', id);
  if (error) console.error('updateOrderPayment:', error);
}

// ─── REVIEWS ────────────────────────────────────────────────
export async function fetchReviews(): Promise<Review[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchReviews:', error); return null; }
  return data.map(mapReview);
}

export async function insertReview(r: Review): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('reviews').insert({
    id: r.id, product_id: r.productId, product_name: r.productName,
    customer_name: r.customerName, rating: r.rating, comment: r.comment,
    image: r.image, status: r.status, is_featured: r.isFeatured
  });
  if (error) console.error('insertReview:', error);
}

export async function updateReviewStatus(id: string, status: Review['status']): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
  if (error) console.error('updateReviewStatus:', error);
}

// ─── CONTACT MESSAGES ───────────────────────────────────────
export async function fetchMessages(): Promise<ContactMessage[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchMessages:', error); return null; }
  return data.map(m => ({ id: m.id, name: m.name, email: m.email, subject: m.subject, message: m.message, isRead: m.is_read, createdAt: m.created_at }));
}

export async function insertMessage(m: ContactMessage): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('contact_messages').insert({
    id: m.id, name: m.name, email: m.email, subject: m.subject, message: m.message, is_read: false
  });
  if (error) console.error('insertMessage:', error);
}

export async function toggleMessageReadDb(id: string, isRead: boolean): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('contact_messages').update({ is_read: !isRead }).eq('id', id);
  if (error) console.error('toggleMessageRead:', error);
}

// ─── SUBSCRIBERS ────────────────────────────────────────────
export async function insertSubscriber(s: NewsletterSubscriber): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('subscribers').insert({ id: s.id, email: s.email });
  if (error && error.code !== '23505') console.error('insertSubscriber:', error);
}

// ─── COUPONS ────────────────────────────────────────────────
export async function fetchCoupons(): Promise<Coupon[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('coupons').select('*');
  if (error) { console.error('fetchCoupons:', error); return null; }
  return data.map(c => ({
    id: c.id, code: c.code, type: c.type, value: c.value,
    expiryDate: c.expiry_date, usageLimit: c.usage_limit, usedCount: c.used_count, status: c.status
  }));
}

export async function upsertCoupon(c: Coupon): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('coupons').upsert({
    id: c.id, code: c.code, type: c.type, value: c.value,
    expiry_date: c.expiryDate, usage_limit: c.usageLimit, used_count: c.usedCount, status: c.status
  });
  if (error) console.error('upsertCoupon:', error);
}

export async function deleteCouponDb(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) console.error('deleteCoupon:', error);
}

// ─── SEND ORDER EMAIL via Supabase Edge Function ────────────
export async function sendOrderEmail(order: Order): Promise<void> {
  if (!supabase) return;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  try {
    await fetch(`${supabaseUrl}/functions/v1/send-order-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(order),
    });
  } catch (err) {
    console.error('sendOrderEmail failed:', err);
  }
}

// ─── MAPPERS ────────────────────────────────────────────────
function mapProduct(r: any): Product {
  return {
    id: r.id, name: r.name, slug: r.slug, sku: r.sku,
    description: r.description, shortDescription: r.short_description,
    price: r.price, salePrice: r.sale_price, category: r.category,
    isFeatured: r.is_featured, isBestSeller: r.is_best_seller, isNewArrival: r.is_new_arrival,
    status: r.status, rating: r.rating,
    images: r.images ?? [], colors: r.colors ?? [], features: r.features ?? []
  };
}

function mapProductOut(p: Product) {
  return {
    id: p.id, name: p.name, slug: p.slug, sku: p.sku,
    description: p.description, short_description: p.shortDescription,
    price: p.price, sale_price: p.salePrice, category: p.category,
    is_featured: p.isFeatured, is_best_seller: p.isBestSeller, is_new_arrival: p.isNewArrival,
    status: p.status, rating: p.rating,
    images: p.images, colors: p.colors, features: p.features
  };
}

function mapOrder(r: any): Order {
  return {
    id: r.id, customerName: r.customer_name, customerEmail: r.customer_email,
    customerPhone: r.customer_phone, shippingAddress: r.shipping_address,
    items: r.items, subtotal: r.subtotal, discount: r.discount,
    couponCode: r.coupon_code, shipping: r.shipping, total: r.total,
    status: r.status, paymentStatus: r.payment_status, createdAt: r.created_at
  };
}

function mapOrderOut(o: Order) {
  return {
    id: o.id, customer_name: o.customerName, customer_email: o.customerEmail,
    customer_phone: o.customerPhone, shipping_address: o.shippingAddress,
    items: o.items, subtotal: o.subtotal, discount: o.discount,
    coupon_code: o.couponCode, shipping: o.shipping, total: o.total,
    status: o.status, payment_status: o.paymentStatus
  };
}

function mapReview(r: any): Review {
  return {
    id: r.id, productId: r.product_id, productName: r.product_name,
    customerName: r.customer_name, rating: r.rating, comment: r.comment,
    image: r.image, status: r.status, isFeatured: r.is_featured, createdAt: r.created_at
  };
}
