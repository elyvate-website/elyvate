'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid2x2, Search, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/lib/cartStore'
import { useAuth } from '@/lib/authContext'

const tabs = [
  { href: '/',         icon: Home,       label: 'Home'     },
  { href: '/products', icon: Grid2x2,    label: 'Products' },
  { href: '/search',   icon: Search,     label: 'Search'   },
  { href: '/cart',     icon: ShoppingCart, label: 'Cart'   },
  { href: '/account',  icon: User,       label: 'Account'  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { items } = useCart()
  const { user } = useAuth()
  const cartCount = items.reduce((a, b) => a + b.quantity, 0)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  function getAccountHref() {
    return user ? '/account' : '/account/login'
  }

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-surface-200"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ href, icon: Icon, label }) => {
          const resolvedHref = label === 'Account' ? getAccountHref() : href
          const active = isActive(href)

          return (
            <Link
              key={href}
              href={resolvedHref}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative group"
            >
              {/* Active indicator pill */}
              {active && (
                <span className="absolute top-2 w-8 h-1 rounded-full bg-brand-600" />
              )}

              {/* Cart badge */}
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={`transition-colors duration-150 ${
                    active ? 'text-brand-600' : 'text-ink-muted group-hover:text-ink-secondary'
                  }`}
                />
                {label === 'Cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-medium tracking-wide transition-colors duration-150 ${
                active ? 'text-brand-600' : 'text-ink-muted group-hover:text-ink-secondary'
              }`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
