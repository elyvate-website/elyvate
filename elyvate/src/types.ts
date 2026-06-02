export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  sku: string;
  images: string[];
  category: string;
  colors: { name: string; value: string }[];
  features: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  status: 'active' | 'draft';
  rating: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedColor: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'inactive';
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export interface CMSSettings {
  hero: HeroSettings;
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  about: {
    title: string;
    subtitle: string;
    content: string;
    storyImage: string;
    mission: string;
    vision: string;
    values: string;
    stats: { label: string; value: string }[];
  };
  contact: {
    address: string;
    email: string;
    phone: string;
  };
  footer: {
    logoText: string;
    copyrightText: string;
    socialFacebook: string;
    socialInstagram: string;
    socialTwitter: string;
    socialYoutube: string;
  };
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface SiteSettings {
  brandName: string;
  accentColor: string;
  bannerMessage: string;
  logoUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'review' | 'contact' | 'system';
  isRead: boolean;
  createdAt: string;
}
