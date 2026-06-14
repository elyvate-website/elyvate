'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag,
  Image as ImageIcon, Settings, ExternalLink
} from 'lucide-react'

const nav = [
  { href: '/admin',          icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package,         label: 'Products' },
  { href: '/admin/orders',   icon: ShoppingBag,     label: 'Orders' },
  { href: '/admin/hero',     icon: ImageIcon,        label: 'Hero Section' },
  { href: '/admin/settings', icon: Settings,         label: 'Settings' },
]

export default function AdminSidebar() {
  const path = usePathname()

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-surface-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-surface-200">
        <p className="font-display text-xl font-semibold text-ink-primary">Elyvate</p>
        <p className="text-xs text-ink-muted mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/admin' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-secondary hover:bg-surface-100 hover:text-ink-primary'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* View store */}
      <div className="p-3 border-t border-surface-200">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-secondary hover:bg-surface-100 transition-colors"
        >
          <ExternalLink size={17} />
          View Store
        </a>
      </div>
    </aside>
  )
}
