'use client'
import { useEffect, useState } from 'react'
import { supabase, Order } from '@/lib/supabase'
import toast from 'react-hot-toast'

const STATUS_OPTIONS: Order['order_status'][] = ['processing', 'fulfilled', 'shipped', 'delivered', 'cancelled']

const statusStyle = (s: string) => {
  if (s === 'delivered') return 'bg-green-100 text-green-700'
  if (s === 'shipped')   return 'bg-blue-100 text-blue-700'
  if (s === 'fulfilled') return 'bg-purple-100 text-purple-700'
  if (s === 'cancelled') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data ?? [])
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: Order['order_status']) {
    await supabase.from('orders').update({ order_status: status }).eq('id', id)
    toast.success('Status updated!'); load()
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <p className="text-ink-muted text-sm">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              {/* Row */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-surface-50 transition-colors"
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-xs text-ink-muted">#{o.id.slice(0, 8).toUpperCase()}</span>
                    <span className={`px-2.5 py-0.5 rounded-xl text-xs font-medium capitalize ${statusStyle(o.order_status)}`}>
                      {o.order_status}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-xl text-xs font-medium ${
                      o.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{o.payment_status}</span>
                  </div>
                  <p className="font-medium text-sm text-ink-primary">{o.customer_name} — {o.product_name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-ink-primary">${o.total_price.toFixed(2)}</p>
                  <p className="text-xs text-ink-muted">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === o.id && (
                <div className="border-t border-surface-200 p-5 bg-surface-50 grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Customer Details</p>
                    <div className="space-y-1.5 text-sm">
                      <p><span className="text-ink-muted">Name:</span> <span className="font-medium">{o.customer_name}</span></p>
                      <p><span className="text-ink-muted">Email:</span> {o.customer_email}</p>
                      <p><span className="text-ink-muted">Phone:</span> {o.customer_phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Shipping Address</p>
                    <div className="space-y-1.5 text-sm">
                      <p>{o.customer_address}</p>
                      <p>{o.customer_city}, {o.customer_zip}</p>
                      <p>{o.customer_country}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Update Status</p>
                    <select
                      className="input text-sm"
                      value={o.order_status}
                      onChange={e => updateStatus(o.id, e.target.value as Order['order_status'])}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                      ))}
                    </select>
                  </div>
                  {o.twocheckout_ref && (
                    <div>
                      <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">2Checkout Ref</p>
                      <p className="text-sm font-mono text-brand-600">{o.twocheckout_ref}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
