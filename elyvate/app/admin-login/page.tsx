'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      router.push(params.get('redirect') || '/admin')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 section-pad">
      <div className="card p-8 w-full max-w-sm">
        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
          <Lock size={20} className="text-brand-600" />
        </div>
        <h1 className="font-display text-2xl font-semibold mb-1">Elyvate Admin</h1>
        <p className="text-sm text-ink-secondary mb-6">Enter the admin password to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Checking...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
