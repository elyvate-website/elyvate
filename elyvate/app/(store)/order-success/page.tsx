'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCart } from '@/lib/cartStore'

export const dynamic = 'force-dynamic'


export default function OrderSuccessPage() {
  const { clearCart } = useCart()
  useEffect(() => { clearCart() }, [])

  return (
    <div className="min-h-screen flex items-center justify-center section-pad">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-ink-primary mb-3">
          Order Confirmed!
        </h1>
        <p className="text-ink-secondary leading-relaxed mb-8">
          Thank you for your purchase. You'll receive a confirmation email shortly. Your order will be shipped within 1–3 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="btn-primary">Continue Shopping</Link>
          <Link href="/" className="btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
