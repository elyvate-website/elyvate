import { Product, Review, CMSSettings, SiteSettings, Coupon, SeoSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Elyvate Nova',
    slug: 'elyvate-nova',
    sku: 'ELY-NOV-01',
    description: 'Bring the wonders of the cosmos into your space with Elyvate Nova. Featuring ultra-clear projection, adjustable brightness, and dynamic nebula effects, it creates the perfect ambience for relaxation, sleep, or inspiration. Packed with 12 lighting modes, smart app connectivity, and bluetooth speaker capability.',
    shortDescription: 'Ultra HD galaxy projection on walls and ceiling with stunning clarity and realistic nebula effects.',
    price: 129.99,
    salePrice: 89.99,
    category: 'Projectors',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    status: 'active',
    rating: 4.9,
    colors: [
      { name: 'Midnight Black', value: '#0a0a0a' },
      { name: 'Aurora White', value: '#f4f4f5' },
      { name: 'Nebula Blue', value: '#1d4ed8' },
    ],
    features: ['Timer Function', 'Wireless Remote', 'Bluetooth Speaker', 'Adjustable Stand', 'Portable Design'],
    images: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p2',
    name: 'Elyvate Astro',
    slug: 'elyvate-astro',
    sku: 'ELY-AST-02',
    description: 'Transform your bedroom into an outer space adventure with Elyvate Astro. This adorable astronaut-shaped projector projects beautiful nebulae and sharp stars. The head is magnetically attached and rotates 360 degrees for seamless projection layout.',
    shortDescription: '360° magnetic rotation astronaut nebula projector for kids and adults alike.',
    price: 149.99,
    salePrice: 109.99,
    category: 'Projectors',
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    status: 'active',
    rating: 4.8,
    colors: [
      { name: 'Classic White', value: '#ffffff' },
      { name: 'Cosmic Grey', value: '#71717a' },
    ],
    features: ['360° Magnetic Rotation', 'Wireless Remote Control', 'Dual Nebulae Effects', '8 Dynamic Star Modes'],
    images: [
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p3',
    name: 'Elyvate Cube',
    slug: 'elyvate-cube',
    sku: 'ELY-CUB-03',
    description: 'Our most compact, advanced laser projector yet. The Elyvate Cube packs a powerful green laser array paired with dual-lens organic RGB LED emitters. Designed for dynamic ambient party lighting, professional gaming background set-ups, and modern sleep therapy rooms.',
    shortDescription: 'Ultra compact dual-lens laser galaxy light with sound synchronization modes.',
    price: 179.99,
    salePrice: 129.99,
    category: 'Projectors',
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    status: 'active',
    rating: 4.7,
    colors: [
      { name: 'Interstellar Purple', value: '#581c87' },
      { name: 'Deep Metal', value: '#27272a' }
    ],
    features: ['Sound Sync React Mode', 'Smart App Integrations', 'Dual-lens Lasers', 'Dual Nebulae'],
    images: [
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p4',
    name: 'Elyvate Dome',
    slug: 'elyvate-dome',
    sku: 'ELY-DOM-04',
    description: 'A stylish circular tabletop hemisphere galaxy ball that illuminates 180 degrees of wall and ceiling surface. Perfect for living rooms, larger media spaces, and ambient backdrops behind your smart TV.',
    shortDescription: 'Sleek tabletop dome projector with wide-angle coverage and 16 colorful nebula blends.',
    price: 99.99,
    salePrice: 79.99,
    category: 'Projectors',
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    status: 'active',
    rating: 4.6,
    colors: [
      { name: 'Sleek Obsidian', value: '#18181b' },
      { name: 'Luminous Pearl', value: '#f4f4f5' }
    ],
    features: ['Wide-Angle 180° Dome', 'Touch Slider Control', 'Whisper Quiet Engine'],
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p5',
    name: 'Galaxy Lamp Stand',
    slug: 'galaxy-lamp-stand',
    sku: 'ELY-STD-05',
    description: 'An adjustable premium metal tripod stand that adapts Elyvate Nova or Elyvate Dome to project at higher altitudes. Equipped with non-slip silicone pads and an extendable lock mechanism.',
    shortDescription: 'Adjustable, premium metal stand designed for perfect alignment and projection height.',
    price: 24.99,
    salePrice: 18.99,
    category: 'Accessories',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    status: 'active',
    rating: 4.5,
    colors: [
      { name: 'Matte Charcoal', value: '#4b5563' }
    ],
    features: ['Extendable Altitude', 'Stable Tripod Base', 'Universal Mounting Swivel'],
    images: [
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p6',
    name: 'Nebula Diffuser',
    slug: 'nebula-diffuser',
    sku: 'ELY-DIF-06',
    description: 'Combine calming starry illumination with continuous aromatic steam. The Nebula Diffuser moisturizes clean air while diffusing essential lavender or peppermint oils with a simulated flame/nebula-lit mist.',
    shortDescription: 'Aromatic mist humidifier lit with customized, glowing RGB nebula colors.',
    price: 34.99,
    salePrice: 24.99,
    category: 'Accessories',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    status: 'active',
    rating: 4.7,
    colors: [
      { name: 'Deep Space', value: '#18181b' }
    ],
    features: ['Aromatic Mist Exhaust', 'Auto Shut-off Sensor', 'Glowing LED Mist Tube'],
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p7',
    name: 'Remote Control Replacement',
    slug: 'remote-control',
    sku: 'ELY-REM-07',
    description: 'Loss of a remote control shouldn’t disrupt your constellation journeys. This replacement provides complete access to speed controls, timer setting triggers, laser pulse states, and RGB gradients.',
    shortDescription: 'Universal replacement remote supporting all ELYVATE projector generations.',
    price: 19.99,
    salePrice: 14.99,
    category: 'Accessories',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    status: 'active',
    rating: 4.4,
    colors: [
      { name: 'Tactile Black', value: '#171717' }
    ],
    features: ['Quick-Link Signal', 'Dedicated Palette Keys', 'AAA Battery Compartment'],
    images: [
      'https://images.unsplash.com/photo-1522273400909-fd1a8f77637e?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p8',
    name: 'Star Projector Light USB',
    slug: 'star-projector-light-usb',
    sku: 'ELY-USB-08',
    description: 'Transform any vehicle console, notebook deck, or power brick into an ambient celestial launch pad. Just plug it in, twist the rotating metal cap to adapt patterns, and enjoy a vibrant starlit blanket.',
    shortDescription: 'Super portable USB plug-and-play star dot projector with flexible gooseneck.',
    price: 69.99,
    salePrice: 58.99,
    category: 'Accessories',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    status: 'active',
    rating: 4.5,
    colors: [
      { name: 'Cosmic Red', value: '#dc2626' },
      { name: 'Galactic Amethyst', value: '#7c3aed' }
    ],
    features: ['Gooseneck Flexible Arm', 'Rotating Grid Lens', 'USB Universal Port'],
    images: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p9',
    name: 'Ceiling Mount Kit',
    slug: 'ceiling-mount-kit',
    sku: 'ELY-MNT-09',
    description: 'Achieve zero shadows and ultimate wider projection field angles by fixing your Elyvate Nova directly to the ceiling structure. Includes heavy-duty drywall toggle bolts and a simple slide-lock plate.',
    shortDescription: 'Reinforced mount kit for ceiling and plasterboard flush installations.',
    price: 20.00,
    salePrice: 15.99,
    category: 'Accessories',
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    status: 'active',
    rating: 4.3,
    colors: [
      { name: 'Alabaster White', value: '#fafafa' }
    ],
    features: ['Heavy-Duty Screws', 'Level Slide Bracket', 'Paintable Coating Protection'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'p10',
    name: 'Astral Power Bundle',
    slug: 'astral-power-bundle',
    sku: 'ELY-BUN-01',
    description: 'Combine ELYVATE’s premier projectors and high-altitude attachments. The Astral Power Bundle packages the signature Elyvate Nova, the Metal Adjustable Stand, and a Nebula Aromatic Mist Diffuser at a massive discount.',
    shortDescription: 'Save 30% with ELYVATE’s signature projector, premium stand, and aroma diffuser bundle.',
    price: 189.99,
    salePrice: 129.99,
    category: 'Bundles',
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    status: 'active',
    rating: 5.0,
    colors: [
      { name: 'Elite Synergy Pack', value: '#8b5cf6' }
    ],
    features: ['Includes Elyvate Nova', 'Includes Adjustable Stand', 'Includes Nebula Diffuser', 'Premium Packaging Giftbox'],
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80'
    ]
  }
];

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

// ─── HOME DECOR PRODUCTS ─────────────────────────────────────
export const HOME_DECOR_PRODUCTS: Product[] = [
  {
    id: 'hd1',
    name: 'Aurora Wall Clock',
    slug: 'aurora-wall-clock',
    sku: 'ELY-HD-01',
    description: 'A silent-sweep minimalist wall clock with a glowing LED rim in adjustable warm/cool tones. The frameless floating-disk design integrates seamlessly into any modern interior. Powered by 2x AA batteries with auto-dimming night sensor.',
    shortDescription: 'Silent-sweep LED rim floating disk wall clock with adjustable glow.',
    price: 59.99,
    salePrice: 44.99,
    category: 'Home Decor',
    isFeatured: true, isBestSeller: true, isNewArrival: false, status: 'active', rating: 4.8,
    colors: [{ name: 'Matte Black', value: '#111111' }, { name: 'Brushed Gold', value: '#C9A84C' }],
    features: ['Silent sweep motor', 'LED ambient ring', 'Auto-dim sensor', 'Battery powered'],
    images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80',
             'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80']
  },
  {
    id: 'hd2',
    name: 'Zen Diffuser Lamp',
    slug: 'zen-diffuser-lamp',
    sku: 'ELY-HD-02',
    description: 'A 3-in-1 ultrasonic aromatherapy diffuser, humidifier and ambient mood lamp in carved wood grain finish. 7-color LED cycle, auto shut-off timer, ultra-quiet 30dB operation.',
    shortDescription: '3-in-1 ultrasonic aroma diffuser, humidifier and 7-color mood lamp.',
    price: 79.99,
    salePrice: 59.99,
    category: 'Home Decor',
    isFeatured: true, isBestSeller: false, isNewArrival: true, status: 'active', rating: 4.9,
    colors: [{ name: 'Natural Wood', value: '#A0785A' }, { name: 'White Pearl', value: '#F5F0E8' }],
    features: ['Ultrasonic mist', '7-color LED', 'Auto shut-off', 'Whisper quiet'],
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
             'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80']
  },
  {
    id: 'hd3',
    name: 'Velvet Throw Bundle',
    slug: 'velvet-throw-bundle',
    sku: 'ELY-HD-03',
    description: 'Ultra-soft 350-GSM microvelvet throw blanket with matching lumbar cushion cover. Pre-washed for instant softness, machine-washable, suitable for sofas, beds and reading nooks.',
    shortDescription: '350-GSM microvelvet throw + matching lumbar cushion cover.',
    price: 49.99,
    salePrice: 39.99,
    category: 'Home Decor',
    isFeatured: false, isBestSeller: true, isNewArrival: false, status: 'active', rating: 4.7,
    colors: [{ name: 'Deep Teal', value: '#0F4C5C' }, { name: 'Blush Rose', value: '#E8A598' }, { name: 'Charcoal', value: '#2C2C2C' }],
    features: ['350-GSM microvelvet', 'Machine washable', 'Pre-washed softness', 'Matching cushion'],
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80']
  }
];

// ─── ELECTRONICS PRODUCTS ────────────────────────────────────
export const ELECTRONICS_PRODUCTS: Product[] = [
  {
    id: 'el1',
    name: 'NovaPad Wireless Charger',
    slug: 'novapad-wireless-charger',
    sku: 'ELY-EL-01',
    description: 'Ultra-slim 15W Qi2 certified wireless charging pad with multi-device support. Charges phones, earbuds and smartwatches simultaneously. Soft LED ring indicator, over-heat protection, foreign object detection.',
    shortDescription: '15W Qi2 multi-device wireless charger with LED ring indicator.',
    price: 45.99,
    salePrice: 34.99,
    category: 'Electronics',
    isFeatured: true, isBestSeller: true, isNewArrival: false, status: 'active', rating: 4.8,
    colors: [{ name: 'Midnight Black', value: '#111111' }, { name: 'Arctic White', value: '#F5F5F5' }],
    features: ['15W Qi2 certified', 'Multi-device pad', 'Over-heat protection', 'LED ring'],
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
             'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80']
  },
  {
    id: 'el2',
    name: 'SoundSphere Speaker',
    slug: 'soundsphere-speaker',
    sku: 'ELY-EL-02',
    description: 'Compact 360° omnidirectional Bluetooth 5.3 speaker with deep bass radiator. 20-hour battery, IPX6 waterproof, built-in mic, RGB breathing light ring synced to music beats.',
    shortDescription: '360° Bluetooth 5.3 speaker with RGB beat-sync ring and 20h battery.',
    price: 89.99,
    salePrice: 69.99,
    category: 'Electronics',
    isFeatured: true, isBestSeller: false, isNewArrival: true, status: 'active', rating: 4.9,
    colors: [{ name: 'Galaxy Black', value: '#1A1A2E' }, { name: 'Space Silver', value: '#9CA3AF' }],
    features: ['Bluetooth 5.3', '360° sound', 'RGB beat-sync', 'IPX6 waterproof', '20h battery'],
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80',
             'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80']
  },
  {
    id: 'el3',
    name: 'SmartView LED Strip Kit',
    slug: 'smartview-led-strip-kit',
    sku: 'ELY-EL-03',
    description: '5-meter RGBIC Wi-Fi smart LED strip with individually addressable segments. Works with Alexa, Google Home & app. Music sync mode, 16M colors, self-adhesive backing, cuttable every 3cm.',
    shortDescription: '5m RGBIC Wi-Fi LED strip — Alexa & Google Home compatible.',
    price: 39.99,
    salePrice: 29.99,
    category: 'Electronics',
    isFeatured: false, isBestSeller: true, isNewArrival: false, status: 'active', rating: 4.6,
    colors: [{ name: 'Multi-Color Kit', value: '#8B5CF6' }],
    features: ['RGBIC individually addressable', 'Wi-Fi + App control', 'Alexa & Google Home', 'Music sync'],
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80']
  }
];

// Merge all products into one export
export const ALL_PRODUCTS: Product[] = [...INITIAL_PRODUCTS, ...HOME_DECOR_PRODUCTS, ...ELECTRONICS_PRODUCTS];
