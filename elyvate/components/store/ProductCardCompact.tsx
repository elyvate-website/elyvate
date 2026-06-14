import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Product } from '@/lib/supabase'

export default function ProductCardCompact({ product }: { product: Product }) {
  const img = product.images?.[0] ?? '/placeholder.png'

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block w-[44vw] sm:w-[200px] shrink-0 snap-start"
    >
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-100 mb-3">
        <Image
          src={img}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.compare_price && (
          <span className="absolute top-3 left-3 bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-xl">
            SALE
          </span>
        )}
      </div>

      <h3 className="text-sm font-semibold text-ink-primary leading-snug line-clamp-2 mb-1">
        {product.name}
      </h3>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-ink-primary">${product.price.toFixed(2)}</span>
        {product.review_count > 0 && (
          <span className="flex items-center gap-1 text-xs text-ink-muted">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        )}
      </div>
    </Link>
  )
}
