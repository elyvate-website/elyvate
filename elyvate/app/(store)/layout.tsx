import Navbar from '@/components/store/Navbar'
import Footer from '@/components/store/Footer'
import BottomNav from '@/components/store/BottomNav'
import AnnouncementBar from '@/components/store/AnnouncementBar'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  )
}
