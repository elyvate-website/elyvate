'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cartStore'
import { useAuth } from '@/lib/authContext'

// Each tab has an outlined SVG (inactive) and a filled SVG (active)
// Custom inline SVGs give us true outline vs filled — lucide-react doesn't do this well
const tabs = [
  {
    href: '/',
    label: 'Home',
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 3l9 9"/>
        <path d="M9 21V12h6v9"/>
        <path d="M3 12v9h5v-6h6v6h5v-9"/>
      </svg>
    ),
  },
  {
    href: '/products',
    label: 'Products',
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7.5M17 13l1.5 7.5M9 20.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm7.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="3" width="5" height="5" rx="0.5"/>
        <rect x="9.5" y="3" width="5" height="5" rx="0.5"/>
        <rect x="17" y="3" width="5" height="5" rx="0.5"/>
        <rect x="2" y="10.5" width="5" height="5" rx="0.5"/>
        <rect x="9.5" y="10.5" width="5" height="5" rx="0.5"/>
        <rect x="17" y="10.5" width="5" height="5" rx="0.5"/>
      </svg>
    ),
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href: '/search',
    label: 'Search',
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.5 3a7.5 7.5 0 1 0 4.55 13.476l3.737 3.737a1 1 0 0 0 1.414-1.414l-3.737-3.738A7.5 7.5 0 0 0 10.5 3zm-5.5 7.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0z"/>
      </svg>
    ),
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="7"/>
        <path d="M21 21l-4.5-4.5"/>
      </svg>
    ),
  },
  {
    href: '/cart',
    label: 'Cart',
    isCart: true,
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zm-17-16v2h2l3.6 7.59-1.35 2.44C3.74 14.72 4.48 16 5.62 16H19v-2H6.42c-.14 0-.25-.11-.25-.25l.03-.12L7.1 12h8.45c.75 0 1.41-.41 1.75-1.03L20.7 5H5.21l-.94-3H1z"/>
      </svg>
    ),
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    href: '/account',
    label: 'Account',
    isAccount: true,
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    ),
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname  = usePathname()
  const { items } = useCart()
  const { user }  = useAuth()
  const cartCount = items.reduce((a, b) => a + b.quantity, 0)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  function resolveHref(tab: typeof tabs[number]) {
    if (tab.isAccount) return user ? '/account' : '/account/login'
    return tab.href
  }

  return (
    <>
      {/* Spacer so page content sits above the nav — only on mobile */}
      <div className="md:hidden h-[env(safe-area-inset-bottom,0px)]" />

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Frosted glass background */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-black/[0.06] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-around h-16 px-2">
            {tabs.map((tab) => {
              const active = isActive(tab.href)
              const href   = resolveHref(tab)

              return (
                <Link
                  key={tab.href}
                  href={href}
                  className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full select-none"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {/* Icon wrapper with active bubble */}
                  <div className="relative flex items-center justify-center">
                    {/* Active pill background */}
                    <span
                      className={`absolute inset-0 rounded-2xl transition-all duration-300 ease-out ${
                        active
                          ? 'bg-brand-600/10 scale-100 opacity-100'
                          : 'scale-75 opacity-0'
                      }`}
                      style={{ margin: '-6px -12px' }}
                    />

                    {/* Icon with lift animation */}
                    <span
                      className={`relative transition-all duration-300 ease-out ${
                        active
                          ? 'text-brand-600 -translate-y-0.5 scale-110'
                          : 'text-ink-muted scale-100 translate-y-0'
                      }`}
                    >
                      {active ? tab.active : tab.inactive}
                    </span>

                    {/* Cart badge */}
                    {tab.isCart && cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}

                    {/* Account dot for logged-in users */}
                    {tab.isAccount && user && !active && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] tracking-wide transition-all duration-300 ${
                      active
                        ? 'text-brand-600 font-semibold'
                        : 'text-ink-muted font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
