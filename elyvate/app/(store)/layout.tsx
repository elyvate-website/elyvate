import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'
import BottomNav from '@/components/store/BottomNav'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* pb-20 on mobile keeps content above the bottom nav bar */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {/* Footer only on desktop */}
      <div className="hidden md:block">
        <Footer />
      </div>
      {/* Bottom nav only on mobile */}
      <BottomNav />
    </div>
  )
}
