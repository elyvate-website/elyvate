'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Package, LogOut, Mail, Calendar } from 'lucide-react'
import { useAuth } from '@/lib/authContext'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/account/login')
  }, [user, loading, router])

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const displayName  = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'
  const avatarLetter = displayName[0].toUpperCase()
  const joinedDate   = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  async function handleSignOut() {
    await signOut()
    toast.success('Signed out')
    router.push('/')
  }

  return (
    <div className="section-pad pt-28 pb-20">
      <div className="container-xl max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-ink-primary mb-8">My Account</h1>

        {/* Profile card */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {avatarLetter}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-primary">{displayName}</h2>
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-sm text-ink-secondary flex items-center gap-1.5">
                  <Mail size={13} /> {user.email}
                </p>
                <p className="text-xs text-ink-muted flex items-center gap-1.5">
                  <Calendar size={12} /> Member since {joinedDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Link href="/account/orders" className="card p-5 flex items-center gap-4 hover:border-brand-200 group">
            <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
              <Package size={20} className="text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-ink-primary text-sm">Order History</p>
              <p className="text-xs text-ink-muted">View all your past orders</p>
            </div>
          </Link>
          <Link href="/products" className="card p-5 flex items-center gap-4 hover:border-brand-200 group">
            <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
              <User size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-ink-primary text-sm">Browse Products</p>
              <p className="text-xs text-ink-muted">Discover new arrivals</p>
            </div>
          </Link>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  )
}
