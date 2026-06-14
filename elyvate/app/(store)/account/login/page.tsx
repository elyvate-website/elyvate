'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase'
import { useAuth } from '@/lib/authContext'
import toast from 'react-hot-toast'

type View = 'signin' | 'signup'

export default function LoginPage() {
  const [view, setView]         = useState<View>('signin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const { user } = useAuth()
  const router   = useRouter()

  useEffect(() => {
    if (user) router.replace('/account')
  }, [user, router])

  async function handleGoogleSignIn() {
    setLoading(true)
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` },
    })
    if (error) { toast.error(error.message); setLoading(false) }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Welcome back!')
    router.push('/account')
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Please enter your name'); return }
    setLoading(true)
    const sb = supabaseBrowser()
    const { error } = await sb.auth.signUp({
      email, password,
      options: { emailRedirectTo: undefined, data: { full_name: name } },
    })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Account created!')
    router.push('/account')
  }

  return (
    <div className="min-h-screen flex items-center justify-center section-pad pt-20 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-semibold text-ink-primary mb-2">
            {view === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-ink-secondary">
            {view === 'signin' ? (
              <>No account? <button onClick={() => setView('signup')} className="text-brand-600 font-medium hover:underline">Sign up</button></>
            ) : (
              <>Have an account? <button onClick={() => setView('signin')} className="text-brand-600 font-medium hover:underline">Sign in</button></>
            )}
          </p>
        </div>

        <div className="card p-8">
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

          <form onSubmit={view === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            {view === 'signup' && (
              <div>
                <label className="label">Full Name</label>
                <input required className="input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input required type="email" className="input" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input required type="password" className="input" placeholder={view === 'signup' ? 'Min. 6 characters' : '••••••••'} minLength={view === 'signup' ? 6 : undefined} value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {view === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
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
