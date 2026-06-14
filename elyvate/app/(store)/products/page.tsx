import { supabase } from '@/lib/supabase'
import ProductGrid from '@/components/store/ProductGrid'

export const revalidate = 60

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('stock_status', 'in_stock')
    .order('created_at', { ascending: false })

  return (
    <div className="section-pad pt-28 pb-20">
      <div className="container-xl">
        <div className="mb-10">
          <p className="text-brand-600 text-sm font-medium tracking-widest uppercase mb-2">
            Browse
          </p>
          <h1 className="font-display text-4xl font-semibold">All Products</h1>
        </div>
        <ProductGrid products={products ?? []} />
      </div>
    </div>
  )
}
