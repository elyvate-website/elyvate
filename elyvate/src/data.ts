import { Product, Review, CMSSettings, SiteSettings, Coupon, SeoSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [];
export const HOME_DECOR_PRODUCTS: Product[] = [];
export const ELECTRONICS_PRODUCTS: Product[] = [];
export const ALL_PRODUCTS: Product[] = [];
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    productName: 'Elyvate Nova',
    customerName: 'Sarah K.',
    rating: 5,
    comment: 'Absolutely spectacular projection quality! I’ve tried other cheap star globes, but nothing beats Elyvate’s clarity. It feels like I am looking into a live Hubble telescope feed. The sleep timer is super helpful.',
    status: 'approved',
    isFeatured: true,
    createdAt: '2026-05-15T09:24:00Z'
  },
  {
    id: 'r2',
    productId: 'p1',
    productName: 'Elyvate Nova',
    customerName: 'Marcus T.',
    rating: 5,
    comment: 'The perfect ambient light for our music room and gaming setup. Solid build, high fidelity bluetooth sound, and transitions are beautifully fluid. Worth every single dollar!',
    status: 'approved',
    isFeatured: true,
    createdAt: '2026-05-18T14:45:00Z'
  },
  {
    id: 'r3',
    productId: 'p2',
    productName: 'Elyvate Astro',
    customerName: 'David L.',
    rating: 5,
    comment: 'My daughter is obsessed with stars now! The astronaut looks adorable standing on her nightstand. The fact that the head magnetically revolves in any direction has made alignment so straightforward. Excellent design!',
    status: 'approved',
    isFeatured: true,
    createdAt: '2026-05-20T21:10:00Z'
  },
  {
    id: 'r4',
    productId: 'p3',
    productName: 'Elyvate Cube',
    customerName: 'Jennifer G.',
    rating: 4,
    comment: 'The lasers are incredibly robust and have amazing patterns. The App synchronization takes a minute to configure, but once running, you have infinite custom color curves. Delivery was fast!',
    status: 'approved',
    isFeatured: false,
    createdAt: '2026-05-24T06:33:00Z'
  }
];

export const DEFAULT_CMS: CMSSettings = {
  hero: {
    title: 'TRANSFORM YOUR ROOM INTO A GALAXY',
    subtitle: 'Immerse yourself in a universe of nebulae, stars and endless possibilities.',
    ctaText: 'SHOP NOW',
    ctaLink: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1600&auto=format&fit=crop&q=90'
  },
  benefits: [
    { title: 'FREE SHIPPING', description: 'Worldwide on orders over $50', icon: 'Truck' },
    { title: '30-DAY RETURNS', description: 'Love it or return it hassle-free', icon: 'RotateCcw' },
    { title: '2-YEAR WARRANTY', description: 'Premium quality you can trust', icon: 'ShieldCheck' },
    { title: 'SECURE PAYMENT', description: '100% safe & encrypted checkout', icon: 'Lock' }
  ],
  about: {
    title: 'DESIGNING SPACES THAT INSPIRE',
    subtitle: 'Our Journey into the Stars',
    content: 'At Elyvate, we believe in the power of light to transform your surroundings and elevate your everyday. Our galaxy projectors are crafted to bring the universe closer to you, creating an atmosphere of calm, wonder, and inspiration. Designed for stargazers, peaceful dreamers, and custom ambient creators alike.',
    storyImage: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=1200&auto=format&fit=crop&q=80',
    mission: 'Inspire wonder through clean design, revolutionary projection lenses, and fluid user-centric products.',
    vision: 'Illuminate every space with cosmos-grade stardust beauty, crafting personal cosmic sanctuaries globally.',
    values: 'Uncompromised optical authenticity, customer integrity, minimalist engineering, and sustainable manufacturing.',
    stats: [
      { label: 'Happy Customers', value: '50K+' },
      { label: 'Products Sold', value: '100K+' },
      { label: 'Countries Served', value: '120+' },
      { label: 'Customer Rating', value: '4.9 ★' }
    ]
  },
  contact: {
    address: '123 Galaxy Road, New York, NY 10001',
    email: 'hello@elyvate.com',
    phone: '+1 (234) 567-8900'
  },
  footer: {
    logoText: 'ELYVATE',
    copyrightText: '© 2026 ELYVATE. All cosmic rights reserved.',
    socialFacebook: 'https://facebook.com/elyvate',
    socialInstagram: 'https://instagram.com/elyvate',
    socialTwitter: 'https://twitter.com/elyvate',
    socialYoutube: 'https://youtube.com/elyvate'
  }
};

export const DEFAULT_SEO: SeoSettings = {
  title: 'ELYVATE | Premium Galaxy Projectors & Cosmic Ambiance',
  description: 'Immerse your space in beautiful real-time stellar nebulae. Shop premium certified galaxy laser projectors designed of Dyson & Apple standards.',
  keywords: 'galaxy projector, space light, star ceiling projector, aurora lights, bedroom starry sky, ELYVATE',
  ogImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80'
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'ELYVATE',
  accentColor: '#8A2BE2', // Neon Violet / Purple
  bannerMessage: '🌌 SPECIAL MID-YEAR SALE OFFER: SAVE UP TO 45% + GET FREE SHIPPING GLOBALLY!'
};

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    usedCount: 142,
    status: 'active'
  },
  {
    id: 'c2',
    code: 'ELYVATE50',
    type: 'fixed',
    value: 50,
    expiryDate: '2027-06-30',
    usageLimit: 50,
    usedCount: 18,
    status: 'active'
  },
  {
    id: 'c3',
    code: 'STAR20',
    type: 'percentage',
    value: 20,
    expiryDate: '2027-08-31',
    usageLimit: 500,
    usedCount: 89,
    status: 'active'
  }
];
