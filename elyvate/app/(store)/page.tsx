import { supabase } from '@/lib/supabase'
import HeroSection from '@/components/store/HeroSection'
import ProductGrid from '@/components/store/ProductGrid'
import FeaturesBar from '@/components/store/FeaturesBar'

export const revalidate = 60

async function getHero() {
  const { data } = await supabase.from('hero_section').select('*').single()
  return data
}

async function getProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('stock_status', 'in_stock')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function HomePage() {
  const [hero, products] = await Promise.all([getHero(), getProducts()])

  return (
    <>
      <HeroSection hero={hero} />
      <FeaturesBar />
      <section className="section-pad py-16">
        <div className="container-xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-600 text-sm font-medium tracking-widest uppercase mb-2">
                Our Collection
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink-primary">
                Discover Products
              </h2>
            </div>
            <a href="/products" className="text-sm text-brand-600 font-medium hover:underline">
              View all
            </a>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  )
}
