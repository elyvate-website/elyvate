'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cartStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ShieldCheck, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'


type FormData = {
  name: string; email: string; phone: string
  address: string; city: string; country: string; zip: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '',
    address: '', city: '', country: '', zip: '',
  })

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, items.length, router])

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const update = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, items, total: total() }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      // Redirect to 2Checkout payment page
      window.location.href = data.paymentUrl
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create order')
      setLoading(false)
    }
  }

  return (
    <div className="section-pad pt-28 pb-20">
      <div className="container-xl">
        <h1 className="font-display text-3xl font-semibold mb-10">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <div className="card p-6">
                <h2 className="font-semibold text-lg mb-5">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input required className="input" placeholder="John Doe" value={form.name} onChange={update('name')} />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input required type="email" className="input" placeholder="john@email.com" value={form.email} onChange={update('email')} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Phone Number</label>
                    <input required className="input" placeholder="+1 234 567 8900" value={form.phone} onChange={update('phone')} />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="card p-6">
                <h2 className="font-semibold text-lg mb-5">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label">Street Address</label>
                    <input required className="input" placeholder="123 Main St, Apt 4" value={form.address} onChange={update('address')} />
                  </div>
                  <div>
                    <label className="label">City</label>
                    <input required className="input" placeholder="New York" value={form.city} onChange={update('city')} />
                  </div>
                  <div>
                    <label className="label">ZIP / Postal Code</label>
                    <input required className="input" placeholder="10001" value={form.zip} onChange={update('zip')} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Country</label>
                    <select required className="input" value={form.country} onChange={update('country')}>
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment info */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Lock size={18} className="text-brand-600" />
                  <h2 className="font-semibold text-lg">Secure Payment</h2>
                </div>
                <p className="text-sm text-ink-secondary">
                  You'll be redirected to 2Checkout's secure payment page to complete your purchase. We accept all major credit/debit cards.
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="card p-6 h-fit sticky top-24">
              <h2 className="font-display text-xl font-semibold mb-5">Summary</h2>
              <div className="space-y-3 mb-5">
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
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>${total().toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Pay ${total().toFixed(2)}
                  </>
                )}
              </button>
              <p className="text-xs text-ink-muted text-center mt-3">
                Secured by 2Checkout · SSL encrypted
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
