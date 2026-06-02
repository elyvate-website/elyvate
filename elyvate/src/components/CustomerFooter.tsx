import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Send, Facebook, Instagram, Twitter, Youtube, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const CustomerFooter: React.FC = () => {
  const { cms, addSubscriber, setCustomerTab, setSelectedProductSlug, themeMode } = useApp();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = addSubscriber(email);
    setStatus(res);
    if (res.success) {
      setEmail('');
    }
    setTimeout(() => {
      setStatus(null);
    }, 4000);
  };

  const handleNav = (tab: Parameters<typeof setCustomerTab>[0]) => {
    setCustomerTab(tab);
    setSelectedProductSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerText = cms.footer;

  return (
    <footer className={`border-t transition-all duration-300 ${
      themeMode === 'light' ? 'bg-slate-50 text-slate-600 border-slate-200/60' : 'bg-[#0B0F19]/80 text-neutral-400 border-slate-800/80'
    }`}>
      
      {/* Premium Newsletter Section */}
      <div className={`border-b py-16 px-4 ${themeMode === 'light' ? 'border-slate-200/50 bg-white' : 'border-neutral-900 bg-black/10'}`}>
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400'}`}>
            THE INNER STARDUST LOOP
          </span>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight uppercase ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
            NEVER MISS A COSMIC EVENT
          </h2>
          <p className={`text-xs sm:text-sm max-w-md mx-auto ${themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
            Subscribe to receive rare celestial flash sales, custom stellar software releases, and early launch invitations.
          </p>

          <form onSubmit={handleSubscribe} className={`max-w-md mx-auto flex items-center border rounded-lg p-1.5 transition-all focus-within:border-indigo-600 ${
            themeMode === 'light' ? 'bg-slate-100/50 border-slate-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <input
              id="newsletter-sub-email"
              type="email"
              required
              placeholder="Enter your email to align"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`flex-1 bg-transparent px-3 text-xs outline-none ${
                themeMode === 'light' ? 'text-slate-805 placeholder:text-slate-400' : 'text-white placeholder:text-neutral-600'
              }`}
            />
            <button
              id="newsletter-sub-submit"
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-indigo-650 to-purple-600 text-[10px] tracking-widest font-bold rounded-md hover:from-indigo-550 hover:to-purple-500 transition text-white uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {status?.success ? (
                <>
                  <Check className="h-3 w-3" />
                  ALIGNED
                </>
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  ALIGN
                </>
              )}
            </button>
          </form>

          {status && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-[11px] font-medium tracking-wide mt-2 ${status.success ? 'text-green-500' : 'text-red-400'}`}
            >
              {status.message}
            </motion.p>
          )}
        </div>
      </div>

      {/* Main Footer Sitemap Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <span className={`text-lg font-bold tracking-widest ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>{footerText.logoText}</span>
            <p className={`text-[11px] tracking-wide max-w-xs leading-5 ${themeMode === 'light' ? 'text-slate-500' : 'text-zinc-500'}`}>
              Refining interior lighting spaces with Dyson-tier optical design. Delivering certified premium galaxy projectors worldwide since 2024.
            </p>
            <div className={`flex items-center space-x-3.5 ${themeMode === 'light' ? 'text-slate-400' : 'text-zinc-400'}`}>
              <a href={footerText.socialFacebook} className="hover:text-indigo-650 dark:hover:text-indigo-400 transition" target="_blank" rel="noreferrer">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={footerText.socialInstagram} className="hover:text-indigo-650 dark:hover:text-indigo-400 transition" target="_blank" rel="noreferrer">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={footerText.socialTwitter} className="hover:text-indigo-650 dark:hover:text-indigo-400 transition" target="_blank" rel="noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={footerText.socialYoutube} className="hover:text-indigo-650 dark:hover:text-indigo-400 transition" target="_blank" rel="noreferrer">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Sitemap links */}
          <div className="space-y-3.5">
            <h4 className={`text-xs font-bold tracking-widest uppercase select-none ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>Navigation</h4>
            <div className={`flex flex-col space-y-2 text-xs ${themeMode === 'light' ? 'text-slate-500' : ''}`}>
              <button id="footer-link-home" onClick={() => handleNav('home')} className={`text-left transition cursor-pointer ${themeMode === 'light' ? 'hover:text-slate-900' : 'hover:text-white'}`}>HOME</button>
              <button id="footer-link-shop" onClick={() => handleNav('shop')} className={`text-left transition cursor-pointer ${themeMode === 'light' ? 'hover:text-slate-900' : 'hover:text-white'}`}>SHOP</button>
              <button id="footer-link-about" onClick={() => handleNav('about')} className={`text-left transition cursor-pointer ${themeMode === 'light' ? 'hover:text-slate-900' : 'hover:text-white'}`}>ABOUT STORY</button>
              <button id="footer-link-reviews" onClick={() => handleNav('reviews_list')} className={`text-left transition cursor-pointer ${themeMode === 'light' ? 'hover:text-slate-900' : 'hover:text-white'}`}>TESTIMONIALS</button>
            </div>
          </div>

          {/* Legal / Policy links */}
          <div className="space-y-3.5">
            <h4 className={`text-xs font-bold tracking-widest uppercase select-none ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>Warranties</h4>
            <div className={`flex flex-col space-y-2 text-xs ${themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
              <span>2-Year Elite Protection</span>
              <span>30-Day Pure Return Guarantee</span>
              <button id="footer-link-contact" onClick={() => handleNav('contact')} className={`text-left transition cursor-pointer focus:outline-none ${themeMode === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}>SUPPORT HELPDESC</button>
              <span>100% Encrypted Payment</span>
            </div>
          </div>

          {/* Help & Support info */}
          <div className="space-y-3.5">
            <h4 className={`text-xs font-bold tracking-widest uppercase select-none ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>Mission Control</h4>
            <div className={`flex flex-col space-y-2 text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
              <p>Email: <span className={`${themeMode === 'light' ? 'text-slate-800 font-medium' : 'text-zinc-300'}`}>{cms.contact.email}</span></p>
              <p>Support: <span className={`${themeMode === 'light' ? 'text-slate-800 font-medium' : 'text-zinc-300'}`}>{cms.contact.phone}</span></p>
              <p className={`uppercase leading-4 text-[10px] ${themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>Office: {cms.contact.address}</p>
            </div>
          </div>

        </div>

        {/* Branding note and copyright */}
        <div className={`mt-16 border-t pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4 ${
          themeMode === 'light' ? 'border-slate-200 text-slate-450' : 'border-neutral-900 text-zinc-650'
        }`}>
          <span>{footerText.copyrightText}</span>
          <div className="flex items-center gap-4">
            <span className={`transition cursor-help ${themeMode === 'light' ? 'hover:text-slate-800' : 'hover:text-zinc-400'}`}>TERMS OF SPACE SERVICE</span>
            <span className={`transition cursor-help ${themeMode === 'light' ? 'hover:text-slate-800' : 'hover:text-zinc-400'}`}>PRIVACY PROTOCOL</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
