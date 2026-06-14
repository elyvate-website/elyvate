import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface-50 border-t border-surface-200 section-pad py-10">
      <div className="container-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-xl font-semibold text-ink-primary">Elyvate</p>
        <nav className="flex items-center gap-6 text-sm text-ink-secondary">
          <Link href="/products" className="hover:text-ink-primary transition-colors">Products</Link>
          <Link href="/cart" className="hover:text-ink-primary transition-colors">Cart</Link>
        </nav>
        <p className="text-xs text-ink-muted">© {new Date().getFullYear()} Elyvate. All rights reserved.</p>
      </div>
    </footer>
  )
}
