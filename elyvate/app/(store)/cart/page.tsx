'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cartStore'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 section-pad pt-28">
      <ShoppingBag size={48} className="text-surface-300" />
      <h2 className="font-display text-2xl text-ink-primary">Your cart is empty</h2>
      <p className="text-ink-secondary text-sm">Add some products to get started.</p>
      <Link href="/products" className="btn-primary">Browse Products</Link>
    </div>
  )

  return (
    <div className="section-pad pt-28 pb-20">
      <div className="container-xl">
        <h1 className="font-display text-3xl font-semibold mb-10">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="card p-4 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface-100 shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} className="font-semibold text-sm text-ink-primary hover:text-brand-600 line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-brand-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center border border-surface-300 rounded-xl overflow-hidden shrink-0">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-surface-100 text-sm">−</button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-surface-100 text-sm">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-ink-muted hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-ink-secondary truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="font-medium shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-ink-secondary">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
            <div className="border-t border-surface-200 pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total().toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
              Checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
