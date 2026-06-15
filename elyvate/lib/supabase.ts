import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side / shared read-only client (no auth session)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Browser client — singleton, keeps auth session in localStorage
let _browserClient: ReturnType<typeof createClient> | null = null
export function supabaseBrowser() {
  if (!_browserClient) {
    _browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return _browserClient
}

// Server-side admin client (never expose to frontend)
export const supabaseAdmin = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

// ─── Types ──────────────────────────────────────────────────────────────────

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price: number | null
  images: string[]
  category: string
  stock_status: 'in_stock' | 'out_of_stock'
  is_featured: boolean
  rating: number
  review_count: number
  created_at: string
}

export type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_country: string
  customer_zip: string
  product_id: string
  product_name: string
  quantity: number
  total_price: number
  payment_status: 'pending' | 'paid' | 'failed'
  order_status: 'processing' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled'
  twocheckout_ref: string | null
  coupon_code: string | null
  discount_amount: number
  tracking_number: string | null
  tracking_carrier: string | null
  supplier_order_id: string | null
  fulfilled_at: string | null
  notes: string | null
  created_at: string
}

export type HeroSection = {
  id: string
  headline: string
  subheadline: string
  cta_text: string
  cta_link: string
  bg_image: string
  bg_image_mobile: string | null
  bg_video: string | null
  bg_video_mobile: string | null
}

export type SiteSettings = {
  id: string
  store_name: string
  logo_url: string | null
  announcement_text: string | null
  announcement_active: boolean
  instagram_url: string | null
  tiktok_url: string | null
  facebook_url: string | null
}
