import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ShoppingBag, Heart, User, Search, Menu, X, ShieldAlert, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerHeader: React.FC = () => {
  const { 
    cart, wishlist, currentCustomer, customerTab, setCustomerTab, 
    setSelectedProductSlug, adminLogin, siteSettings, themeMode, setThemeMode
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { customerLogin, customerLogout } = useApp();

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleNav = (tab: typeof customerTab) => {
    setCustomerTab(tab);
    setSelectedProductSlug(null);
    setMobileMenuOpen(false);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const finalName = name || email.split('@')[0];
    customerLogin(email, finalName);
    setAuthOpen(false);
    setEmail('');
    setName('');
  };

  const navItems: { label: string; tab: typeof customerTab }[] = [
    { label: 'HOME', tab: 'home' },
    { label: 'SHOP', tab: 'shop' },
    { label: 'ABOUT', tab: 'about' },
    { label: 'REVIEWS', tab: 'reviews_list' },
    { label: 'CONTACT', tab: 'contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 w-full border-b ${themeMode === 'light' ? 'bg-[#F8F9FB]/90 text-[#0F172A] border-slate-200/50' : 'bg-[#0B0F19]/90 text-white border-slate-800/50'} backdrop-blur-md`}>
      {/* Top Banner Bar */}
      {siteSettings.bannerMessage && (
        <div className={`text-[11px] leading-none py-2 text-center font-medium tracking-wider select-none px-4 truncate transition-colors duration-300 ${
          themeMode === 'light' ? 'bg-indigo-600 text-indigo-50' : 'bg-indigo-950/80 text-indigo-200'
        }`}>
          {siteSettings.bannerMessage}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <button 
              id="brand-logo-btn"
              onClick={() => handleNav('home')} 
              className="group flex flex-col items-start cursor-pointer"
            >
              <span className={`font-sans text-2xl font-bold tracking-tighter transition-colors duration-200 ${
                themeMode === 'light' ? 'text-indigo-600 group-hover:text-indigo-700' : 'text-white group-hover:text-indigo-400'
              }`}>
                {siteSettings.brandName}
              </span>
              <span className={`text-[8px] tracking-[0.25em] font-medium -mt-1.5 uppercase transition-colors duration-200 ${
                themeMode === 'light' ? 'text-slate-500 group-hover:text-indigo-500' : 'text-neutral-400 group-hover:text-indigo-300'
              }`}>
                COSMIC RAY
              </span>
            </button>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className={`hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest ${
            themeMode === 'light' ? 'text-slate-600' : 'text-neutral-300'
          }`}>
            {navItems.map((item) => (
              <button
                key={item.tab}
                id={`nav-${item.tab}`}
                onClick={() => handleNav(item.tab)}
                className={`relative py-2 hover:text-indigo-600 transition-colors cursor-pointer ${
                  customerTab === item.tab ? (themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400') : ''
                }`}
              >
                {item.label}
                {customerTab === item.tab && (
                  <motion.div 
                    layoutId="activeNavIndicator" 
                    className={`absolute bottom-0 left-0 h-0.5 w-full ${themeMode === 'light' ? 'bg-indigo-600' : 'bg-indigo-500'}`} 
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className={`flex items-center space-x-2 sm:space-x-3 ${
            themeMode === 'light' ? 'text-slate-600' : 'text-neutral-300'
          }`}>
            
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle"
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              className={`p-1.5 hover:text-indigo-650 rounded-full transition-colors cursor-pointer ${
                themeMode === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800/50'
              }`}
              title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
            >
              {themeMode === 'light' ? <Moon className="h-4 sm:h-5 w-4 sm:h-5 text-slate-700" /> : <Sun className="h-4 sm:h-5 w-4 sm:h-5 text-yellow-500" />}
            </button>

            {/* Search Trigger */}
            <button 
              id="search-toggle-btn"
              onClick={() => setSearchOpen(true)}
              className={`p-1.5 hover:text-indigo-650 rounded-full transition-colors cursor-pointer ${
                themeMode === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800/50'
              }`}
            >
              <Search className="h-4 sm:h-5 w-4 sm:h-5" />
            </button>

            {/* Wishlist Button */}
            <button 
              id="wishlist-nav-btn"
              onClick={() => handleNav('dashboard')} 
              className={`relative p-1.5 hover:text-indigo-650 rounded-full transition-colors cursor-pointer ${
                themeMode === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800/50'
              }`}
            >
              <Heart className="h-4 sm:h-5 w-4 sm:h-5" />
              {wishlist.length > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ring-1 ${
                  themeMode === 'light' ? 'bg-slate-700 ring-white' : 'bg-slate-500 ring-zinc-950'
                }`}>
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button 
              id="cart-nav-btn"
              onClick={() => handleNav('cart')}
              className={`relative p-1.5 hover:text-indigo-650 rounded-full transition-colors cursor-pointer ${
                themeMode === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800/50'
              }`}
            >
              <ShoppingBag className="h-4 sm:h-5 w-4 sm:h-5" />
              {cartCount > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white ring-1 ${
                  themeMode === 'light' ? 'bg-indigo-600 ring-white' : 'bg-indigo-500 ring-zinc-950'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Profile Node / Portal */}
            <div className="relative">
              {currentCustomer ? (
                <button
                  id="user-menu-btn"
                  onClick={() => handleNav('dashboard')}
                  className={`flex items-center space-x-1.5 p-1 px-2.5 rounded-full border transition-colors cursor-pointer ${
                    themeMode === 'light' ? 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50' : 'border-neutral-700/60 bg-neutral-900/40 hover:bg-neutral-800/80'
                  }`}
                >
                  <User className={`h-3.5 w-3.5 ${themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400'}`} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold max-w-[80px] truncate">
                    {currentCustomer.name}
                  </span>
                </button>
              ) : (
                <button 
                  id="sign-in-btn"
                  onClick={() => setAuthOpen(true)}
                  className={`p-1.5 hover:text-indigo-650 rounded-full transition-colors cursor-pointer ${
                    themeMode === 'light' ? 'hover:bg-slate-100' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <User className="h-4 sm:h-5 w-4 sm:h-5" />
                </button>
              )}
            </div>

            {/* Admin Backdoor shortcut */}
            <button
              id="admin-portal-btn"
              onClick={() => adminLogin()}
              className={`hidden md:flex items-center space-x-1 p-1 px-2.5 text-[10px] tracking-wider rounded-md transition-colors cursor-pointer ${
                themeMode === 'light' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 ring-1 ring-indigo-250/30' : 'bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900 ring-1 ring-indigo-600/30'
              }`}
              title="Admin Dashboard Portal"
            >
              <ShieldAlert className="h-3 w-3" />
              <span>PORTAL</span>
            </button>

            {/* Mobile Drawer Trigger */}
            <button
              id="mobile-menu-burger"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 hover:text-indigo-600 md:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              layoutId="mobileMenuOverlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm ${
                themeMode === 'light' ? 'bg-[#F8F9FB] text-slate-900 border-slate-200' : 'bg-[#0B0F19] text-white border-neutral-800'
              } p-6 shadow-2xl flex flex-col border-l`}
            >
              <div className="flex items-center justify-between mb-8">
                <span className={`font-extrabold tracking-widest ${themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400'}`}>MENU</span>
                <button 
                  id="mobile-close-btn"
                  onClick={() => setMobileMenuOpen(false)} 
                  className={`p-1 ${themeMode === 'light' ? 'text-slate-500 hover:text-indigo-650' : 'text-neutral-400 hover:text-white'}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col space-y-5 text-sm uppercase tracking-widest font-semibold flex-1">
                {navItems.map((item) => (
                  <button
                    key={item.tab}
                    id={`mobile-nav-${item.tab}`}
                    onClick={() => handleNav(item.tab)}
                    className={`text-left py-2 border-b ${themeMode === 'light' ? 'border-slate-100' : 'border-neutral-900'} ${
                      customerTab === item.tab 
                        ? (themeMode === 'light' ? 'text-indigo-650 font-bold' : 'text-indigo-400 font-bold') 
                        : (themeMode === 'light' ? 'text-slate-650' : 'text-neutral-300')
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {/* Admin Shortcut for Mobile */}
                <button
                  id="mobile-admin-portal-btn"
                  onClick={() => {
                    adminLogin();
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between py-3 px-4 ${
                    themeMode === 'light' ? 'bg-indigo-50 text-indigo-700 border-indigo-200/50' : 'bg-purple-900/30 text-purple-200 border border-purple-800/50'
                  } rounded-lg`}
                >
                  <span className="text-xs">ADMIN SYSTEM PORTAL</span>
                  <ShieldAlert className="h-4 w-4" />
                </button>
              </div>

              <div className={`border-t ${themeMode === 'light' ? 'border-slate-200' : 'border-neutral-900'} pt-6`}>
                {currentCustomer ? (
                  <div className="space-y-3">
                    <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>Logged in as {currentCustomer.name}</p>
                    <button
                      id="mobile-logout-btn"
                      onClick={() => {
                        customerLogout();
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full py-2.5 ${
                        themeMode === 'light' ? 'bg-red-50 text-red-650 border-red-200/50 hover:bg-red-100' : 'bg-red-950/40 text-red-400 border-red-900/40 hover:bg-red-900'
                      } text-xs tracking-wider font-bold rounded-lg border flex items-center justify-center gap-2`}
                    >
                      <LogOut className="h-3.5 w-3.5" /> SIGN OUT
                    </button>
                  </div>
                ) : (
                  <button
                    id="mobile-signin-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthOpen(true);
                    }}
                    className="w-full py-2.5 bg-indigo-600 text-white text-xs tracking-wider font-bold rounded-md hover:bg-indigo-700 shadow-md shadow-indigo-100"
                  >
                    SIGN IN / SIGN UP
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Search Dialog Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-neutral-950/80"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`relative w-full max-w-xl overflow-hidden rounded-xl ${
                themeMode === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-zinc-900 text-white border-neutral-800'
              } p-4 shadow-2xl border`}
            >
              <div className={`flex items-center gap-3 border-b pb-3 ${themeMode === 'light' ? 'border-slate-100' : 'border-neutral-800'}`}>
                <Search className={`h-5 w-5 ${themeMode === 'light' ? 'text-indigo-600' : 'text-neutral-450'}`} />
                <input
                  id="glob-search-input"
                  type="text"
                  placeholder="Query interstellar gear (e.g. Nova, Stand, Accessory...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent text-sm outline-none ${
                    themeMode === 'light' ? 'text-slate-900 placeholder:text-slate-400' : 'text-neutral-100 placeholder:text-neutral-500'
                  }`}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      localStorage.setItem('ely_search_term', searchQuery);
                      handleNav('shop');
                      setSearchOpen(false);
                    }
                  }}
                />
                <button 
                  id="glob-search-close-btn"
                  onClick={() => setSearchOpen(false)}
                  className={`${themeMode === 'light' ? 'text-slate-400 hover:text-slate-900' : 'text-neutral-550 hover:text-white'}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className={`mt-3 text-[10px] flex items-center justify-between ${themeMode === 'light' ? 'text-slate-400' : 'text-neutral-500'}`}>
                <span>Press Enter to perform galactic query</span>
                <span>ESC to cancel</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Drawer Popup */}
      <AnimatePresence>
        {authOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthOpen(false)}
              className="absolute inset-0 bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative w-full max-w-sm rounded-xl ${
                themeMode === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-zinc-900 text-white border-neutral-800'
              } p-6 shadow-2xl border`}
            >
              <button
                id="auth-modal-close"
                onClick={() => setAuthOpen(false)}
                className={`absolute top-4 right-4 ${themeMode === 'light' ? 'text-slate-400 hover:text-slate-900' : 'text-neutral-400 hover:text-white'}`}
              >
                <X className="h-4 w-4" />
              </button>

              <h2 className={`text-lg font-bold tracking-widest text-center uppercase mb-1 ${themeMode === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>
                {isSignUp ? 'INITIATE PROFILE' : 'ACCESS PORT'}
              </h2>
              <p className={`text-xs text-center mb-6 ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>
                {isSignUp ? 'Establish an ELYVATE cosmic credentials token.' : 'Synchronized authentication stream.'}
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>Your Appended Name</label>
                    <input
                      id="auth-name-input"
                      type="text"
                      required
                      placeholder="Sirajul Rubel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full ${
                        themeMode === 'light' ? 'bg-slate-50 text-slate-900 border-slate-200 focus:border-indigo-500' : 'bg-neutral-950 text-white border-neutral-800 focus:border-purple-500'
                      } text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none transition-colors`}
                    />
                  </div>
                )}
                <div>
                  <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>Interstellar Gateway Email</label>
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    placeholder="explorer@elyvate.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${
                      themeMode === 'light' ? 'bg-slate-50 text-slate-900 border-slate-200 focus:border-indigo-500' : 'bg-neutral-950 text-white border-neutral-800 focus:border-purple-500'
                    } text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none transition-colors`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>Confined Codephrase</label>
                  <input
                    id="auth-pass-input"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full ${
                      themeMode === 'light' ? 'bg-slate-50 text-slate-900 border-slate-200 focus:border-indigo-500' : 'bg-neutral-950 text-white border-neutral-800 focus:border-purple-500'
                    } text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none transition-colors`}
                  />
                </div>

                <button
                  id="auth-submit-btn"
                  type="submit"
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs tracking-wider uppercase font-bold rounded-lg transition-colors cursor-pointer shadow-lg shadow-indigo-100/20"
                >
                  {isSignUp ? 'Initialize Profile' : 'Authenticate Console'}
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  id="auth-toggle-signup"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className={`text-[10px] uppercase tracking-wider transition ${
                    themeMode === 'light' ? 'text-slate-500 hover:text-indigo-600' : 'text-neutral-400 hover:text-purple-400'
                  }`}
                >
                  {isSignUp ? 'Have a profile already? Login' : 'First space exploration? Create profile'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
