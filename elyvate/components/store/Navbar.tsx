'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cartStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { items } = useCart()
  const count = items.reduce((a, b) => a + b.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <nav className="container-xl section-pad h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl font-semibold text-ink-primary tracking-tight">
          Elyvate
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors">
            Products
          </Link>
        </div>

        {/* Cart + mobile menu */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 rounded-xl hover:bg-surface-100 transition-colors">
            <ShoppingCart size={20} className="text-ink-primary" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 rounded-xl hover:bg-surface-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-surface-200 px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm text-ink-secondary hover:text-ink-primary">Home</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} className="text-sm text-ink-secondary hover:text-ink-primary">Products</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="text-sm text-ink-secondary hover:text-ink-primary">Cart ({count})</Link>
        </div>
      )}
    </header>
  )
}
