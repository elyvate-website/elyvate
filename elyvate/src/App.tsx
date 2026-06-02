import React from 'react';
import { AppProvider, useApp } from './AppContext';
import { CustomerHeader } from './components/CustomerHeader';
import { CustomerFooter } from './components/CustomerFooter';
import { CustomerHome } from './components/CustomerHome';
import { CustomerShop } from './components/CustomerShop';
import { CustomerProductDetail } from './components/CustomerProductDetail';
import { CustomerCart } from './components/CustomerCart';
import { CustomerCheckout } from './components/CustomerCheckout';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { ReviewsList } from './components/ReviewsList';
import { AdminPanel } from './components/AdminPanel';

function MainAppContent() {
  const { currentView, customerTab, themeMode, isDbConnected, siteSettings } = useApp();

  if (currentView === 'admin') {
    return <AdminPanel />;
  }

  const isLight = themeMode === 'light';

  return (
    <div className={`relative flex flex-col min-h-screen transition-colors duration-300 overflow-x-hidden ${
      isLight ? 'bg-[#F8F9FB] text-slate-900' : 'bg-[#0B0F19] text-white'
    }`}>

      {/* Promo Banner */}
      {siteSettings.bannerMessage && (
        <div className={`w-full text-center py-2 px-4 text-[11px] font-bold tracking-widest uppercase ${
          isLight ? 'bg-indigo-600 text-white' : 'bg-indigo-900 text-indigo-200'
        }`}>
          {siteSettings.bannerMessage}
        </div>
      )}

      {/* DB Connection indicator (dev only) */}
      {import.meta.env.DEV && (
        <div className={`w-full text-center py-1 px-4 text-[10px] font-mono ${
          isDbConnected ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-600'
        }`}>
          {isDbConnected ? '● Supabase connected' : '○ Running in local mode (add VITE_SUPABASE_URL to .env.local)'}
        </div>
      )}

      {/* Ambient glow decor */}
      <div className="absolute inset-0 select-none pointer-events-none overflow-hidden max-h-[1400px]">
        <div className={`absolute w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full blur-[110px] -top-40 -left-20 transition-opacity duration-300 ${
          isLight ? 'bg-indigo-400/8' : 'bg-indigo-500/10'
        }`} />
        <div className={`absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full blur-[100px] top-[15%] -right-20 transition-opacity duration-300 ${
          isLight ? 'bg-purple-300/12' : 'bg-purple-500/15'
        }`} />
      </div>

      <CustomerHeader />

      <main className="flex-grow relative z-10">
        {customerTab === 'home' && <CustomerHome />}
        {customerTab === 'shop' && <CustomerShop />}
        {customerTab === 'product' && <CustomerProductDetail />}
        {customerTab === 'cart' && <CustomerCart />}
        {customerTab === 'checkout' && <CustomerCheckout />}
        {customerTab === 'dashboard' && <CustomerDashboard />}
        {customerTab === 'about' && <AboutPage />}
        {customerTab === 'contact' && <ContactPage />}
        {customerTab === 'reviews_list' && <ReviewsList />}
      </main>

      <CustomerFooter />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
