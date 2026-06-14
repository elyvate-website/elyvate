'use client'
import { useState } from 'react'
import { X, ShoppingBag, User, ArrowRight, Loader2 } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase'
import toast from 'react-hot-toast'

type Props = {
  onClose: () => void
  onContinueAsGuest: () => void
  onAuthSuccess: () => void
}

type AuthView = 'choose' | 'signin' | 'signup'

export default function AuthModal({ onClose, onContinueAsGuest, onAuthSuccess }: Props) {
  const [view, setView]         = useState<AuthView>('choose')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleGoogleSignIn() {
    setLoading(true)
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/checkout`,
      },
    })
    if (error) { toast.error(error.message); setLoading(false) }
    // page will redirect to Google
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Signed in!')
    onAuthSuccess()
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Please enter your name'); return }
    setLoading(true)
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // no email verification
        data: { full_name: name },
      },
    })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Account created! You\'re signed in.')
    onAuthSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-surface-100 text-ink-muted hover:text-ink-primary transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* ── CHOOSE VIEW ─────────────────────────────── */}
        {view === 'choose' && (
          <div className="p-8">
            <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={26} className="text-brand-600" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink-primary text-center mb-2">
              Ready to checkout?
            </h2>
            <p className="text-sm text-ink-secondary text-center mb-8">
              Sign in to track your orders, or continue as a guest.
            </p>

            <div className="space-y-3">
              {/* Sign in option */}
              <button
                onClick={() => setView('signin')}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-ink-primary">Sign in / Create account</p>
                    <p className="text-xs text-ink-secondary">Track orders & save details</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-brand-600 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Guest option */}
              <button
                onClick={onContinueAsGuest}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border border-surface-300 hover:border-surface-400 hover:bg-surface-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-surface-100 rounded-xl flex items-center justify-center shrink-0">
                    <ShoppingBag size={16} className="text-ink-secondary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-ink-primary">Continue as Guest</p>
                    <p className="text-xs text-ink-secondary">No account needed</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-ink-muted group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ── SIGN IN VIEW ────────────────────────────── */}
        {view === 'signin' && (
          <div className="p-8">
            <button
              onClick={() => setView('choose')}
              className="text-xs text-ink-muted hover:text-ink-primary mb-5 flex items-center gap-1 transition-colors"
            >
              ← Back
            </button>
            <h2 className="font-display text-2xl font-semibold text-ink-primary mb-1">Sign in</h2>
            <p className="text-sm text-ink-secondary mb-6">
              New here?{' '}
              <button onClick={() => setView('signup')} className="text-brand-600 font-medium hover:underline">
                Create an account
              </button>
            </p>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-surface-300 rounded-2xl py-3 text-sm font-medium text-ink-primary hover:bg-surface-50 transition-colors mb-5 disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-surface-200" />
              <span className="text-xs text-ink-muted">or</span>
              <div className="flex-1 h-px bg-surface-200" />
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  required type="email" className="input"
                  placeholder="you@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  required type="password" className="input"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                Sign In & Continue
              </button>
            </form>
          </div>
        )}

        {/* ── SIGN UP VIEW ────────────────────────────── */}
        {view === 'signup' && (
          <div className="p-8">
            <button
              onClick={() => setView('signin')}
              className="text-xs text-ink-muted hover:text-ink-primary mb-5 flex items-center gap-1 transition-colors"
            >
              ← Back
            </button>
            <h2 className="font-display text-2xl font-semibold text-ink-primary mb-1">Create account</h2>
            <p className="text-sm text-ink-secondary mb-6">
              Already have one?{' '}
              <button onClick={() => setView('signin')} className="text-brand-600 font-medium hover:underline">
                Sign in
              </button>
            </p>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-surface-300 rounded-2xl py-3 text-sm font-medium text-ink-primary hover:bg-surface-50 transition-colors mb-5 disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-surface-200" />
              <span className="text-xs text-ink-muted">or</span>
              <div className="flex-1 h-px bg-surface-200" />
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  required className="input"
                  placeholder="John Doe"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  required type="email" className="input"
                  placeholder="you@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  required type="password" className="input"
                  placeholder="Min. 6 characters"
                  minLength={6}
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                Create Account & Continue
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}
