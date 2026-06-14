'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Star, ShoppingCart, Truck, ShieldCheck } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import { useCart } from '@/lib/cartStore'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'


export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    supabase.from('products').select('*').eq('slug', slug).single()
      .then(({ data }) => setProduct(data))
  }, [slug])

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  function handleAddToCart() {
    if (!product) return
    for (let i = 0; i < qty; i++) addItem(product)
    toast.success(`Added to cart!`)
  }

  const images = product.images ?? []

  return (
    <div className="section-pad pt-28 pb-20">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-100">
              {images[activeImg] && (
                <Image src={images[activeImg]} alt={product.name} fill className="object-cover" />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors ${
                      activeImg === i ? 'border-brand-600' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-sm text-brand-600 font-medium uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-primary leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-ink-secondary">{product.rating} ({product.review_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-ink-primary">${product.price.toFixed(2)}</span>
              {product.compare_price && (
                <span className="text-lg text-ink-muted line-through">${product.compare_price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-ink-secondary leading-relaxed mb-8">{product.description}</p>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-surface-300 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-surface-100 transition-colors text-ink-primary font-medium"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-10 h-12 flex items-center justify-center hover:bg-surface-100 transition-colors text-ink-primary font-medium"
                >
                  +
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2 py-4">
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-surface-200">
              <div className="flex items-center gap-2 text-sm text-ink-secondary">
                <Truck size={16} className="text-brand-600 shrink-0" />
                Free worldwide shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-ink-secondary">
                <ShieldCheck size={16} className="text-brand-600 shrink-0" />
                Secure 2Checkout payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
