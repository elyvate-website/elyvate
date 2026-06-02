import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  ShoppingBag, Heart, User, MapPin, Truck, CheckCircle, Package, Clock, 
  ArrowRight, Eye, RefreshCw, AlertCircle, Sparkles, KeyRound 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerDashboard: React.FC = () => {
  const { 
    orders, wishlist, products, currentCustomer, customerLogin, 
    customerLogout, setCustomerTab, setSelectedProductSlug, themeMode 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist'>('orders');
  const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);

  // Profile Edit fields
  const [profileName, setProfileName] = useState(currentCustomer?.name || 'Explorer');
  const [profileEmail, setProfileEmail] = useState(currentCustomer?.email || 'explorer@domain.com');
  const [profilePhone, setProfilePhone] = useState(currentCustomer?.phone || '');
  const [profileLogs, setProfileLogs] = useState('');

  // Simulating dashboard without login session (prompt them to authenticate first!)
  if (!currentCustomer) {
    return (
      <div className={`transition-all duration-350 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'} min-h-screen py-16 flex items-center`}>
        <div className={`mx-auto max-w-sm text-center p-8 border rounded-xl space-y-6 shadow-2xl transition-all duration-350 ${
          themeMode === 'light' ? 'bg-white border-slate-155 text-slate-900 shadow-indigo-120/5' : 'bg-zinc-900 border-neutral-805 text-white'
        }`}>
          <div className={`p-3 w-12 h-12 rounded-full border flex items-center justify-center mx-auto transition-colors duration-300 ${
            themeMode === 'light' ? 'bg-slate-50 border-slate-205 text-indigo-600' : 'bg-neutral-950 border-neutral-800 text-purple-400'
          }`}>
            <User className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <h2 className={`text-sm font-black uppercase tracking-wider ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>ORBITAL PROFILE REQUIRED</h2>
            <p className={`text-xs leading-relaxed ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-400'}`}>
              Login or register an ELYVATE credentials token to view orders history, telemetry tracking, and save wishlist items.
            </p>
          </div>

          <div className="pt-2">
            <input
              id="dash-quick-login-email"
              type="email"
              placeholder="explorer@elyvate.com"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className={`w-full text-xs px-3.5 py-2.5 rounded-lg border outline-none mb-3 transition-colors duration-200 ${
                themeMode === 'light' 
                  ? 'bg-slate-50 border-slate-205 focus:border-indigo-650 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                  : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-650'
              }`}
            />
            <button
              id="dash-quick-login-btn"
              onClick={() => {
                if (profileEmail) {
                  customerLogin(profileEmail, profileEmail.split('@')[0], '+1 (555) 0123-909');
                }
              }}
              className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition overflow-hidden cursor-pointer text-white ${
                themeMode === 'light' ? 'bg-indigo-650 hover:bg-indigo-755 shadow-md shadow-indigo-120/10' : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              QUICK LAUNCH LOGIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Find orders belonging to current customer email
  const customerOrders = orders.filter(o => o.customerEmail.toLowerCase().trim() === currentCustomer.email.toLowerCase().trim());
  
  // Find wishlist products
  const wishlistProducts = products.filter(p => wishlist.includes(p.id) && p.status === 'active');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    customerLogin(profileEmail, profileName, profilePhone);
    setProfileLogs('Credential token variables synced on local state!');
    setTimeout(() => setProfileLogs(''), 4000);
  };

  const handleProductDetail = (slug: string) => {
    setSelectedProductSlug(slug);
    setCustomerTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find active order tracking
  const tracingOrder = orders.find(o => o.id === selectedOrderID);

  return (
    <div className={`transition-all duration-350 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'} min-h-screen py-10`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner Details */}
        <div className={`border-b pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-900'}`}>
          <div className="space-y-1.5 text-left">
            <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>COMMAND PORTAL</span>
            <h1 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>WELCOME BACK, {currentCustomer.name}</h1>
          </div>
          <button
            id="dash-logout-btn"
            onClick={customerLogout}
            className={`px-4.5 py-2 text-xs font-bold tracking-widest uppercase rounded border transition cursor-pointer self-start md:self-auto ${
              themeMode === 'light' 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-205 text-red-650 hover:text-red-700 font-extrabold' 
                : 'bg-neutral-900 border-neutral-850 text-red-400 hover:bg-red-955/20 hover:text-red-300'
            }`}
          >
            Sign Out Profile
          </button>
        </div>

        {/* Triple tabs selector dashboard overview */}
        <div className={`flex border-b text-[10px] sm:text-xs font-bold tracking-widest ${
          themeMode === 'light' ? 'border-slate-150 bg-slate-50 text-slate-505' : 'border-neutral-905 bg-neutral-90 text-neutral-400'
        }`}>
          {[
            { id: 'orders', label: 'MY CONSTELLATIONS', count: customerOrders.length },
            { id: 'wishlist', label: 'SAVED GEOMETRIES', count: wishlistProducts.length },
            { id: 'profile', label: 'CREATION CREDENTIALS' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`dash-tab-btn-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedOrderID(null);
              }}
              className={`px-5 py-3.5 border-r transition uppercase shrink-0 cursor-pointer ${
                themeMode === 'light' ? 'border-slate-150 text-slate-505 hover:text-slate-950' : 'border-neutral-850 hover:text-white'
              } ${
                activeTab === tab.id 
                  ? themeMode === 'light' 
                    ? 'bg-white text-indigo-650 border-b-2 border-b-indigo-650 font-black' 
                    : 'bg-zinc-950 text-white border-b-2 border-b-purple-500' 
                  : ''
              }`}
            >
              {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
            </button>
          ))}
        </div>

        {/* Dashboard workspace panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Workplace container (Column 8 or 12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TAB 1: ORDERS LISTS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {customerOrders.length > 0 ? (
                  customerOrders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className={`p-5 rounded-xl border transition-all ${
                        selectedOrderID === ord.id 
                          ? themeMode === 'light'
                            ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-120/5'
                            : 'border-purple-500 bg-neutral-900/30' 
                          : themeMode === 'light'
                            ? 'border-slate-150 bg-white hover:border-slate-205'
                            : 'border-neutral-805 bg-zinc-900 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1 text-left">
                          <p className={`text-[10px] font-mono uppercase tracking-widest ${themeMode === 'light' ? 'text-slate-450' : 'text-zinc-500'}`}>ORDER TRACKING ID</p>
                          <h4 className={`text-xs sm:text-sm font-black ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>{ord.id}</h4>
                          <span className={`text-[10px] ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-400'}`}>{new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Status tag */}
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded text-white uppercase ${
                            ord.status === 'delivered' ? 'bg-green-600' :
                            ord.status === 'shipped' ? 'bg-indigo-650' :
                            ord.status === 'processing' ? 'bg-amber-600' : 'bg-neutral-800'
                          }`}>
                            {ord.status}
                          </span>

                          <button
                            id={`dash-track-btn-${ord.id}`}
                            onClick={() => setSelectedOrderID(ord.id)}
                            className={`p-1 px-3 text-[10px] font-extrabold tracking-widest rounded transition uppercase flex items-center gap-1 cursor-pointer ${
                              themeMode === 'light' 
                                ? 'bg-indigo-50 text-indigo-650 hover:bg-indigo-100' 
                                : 'bg-neutral-950 text-white hover:bg-neutral-800'
                            }`}
                          >
                            <span>Telemetry</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Line items mini report preview */}
                      <div className={`mt-4 pt-3.5 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                        themeMode === 'light' ? 'border-slate-150' : 'border-neutral-850/60'
                      }`}>
                        <div className="text-left">
                          <p className="text-[9px] font-mono text-zinc-500 uppercase">Selected items</p>
                          <p className={`text-xs font-semibold mt-1 ${themeMode === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                            {ord.items.map(i => `${i.productName} (${i.selectedColor}) x${i.quantity}`).join(', ')}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-[9px] font-mono text-zinc-500 uppercase">Bilateral Paid Total</p>
                          <p className={`text-sm font-black font-sans mt-0.5 ${themeMode === 'light' ? 'text-indigo-655 font-extrabold' : 'text-purple-400'}`}>${ord.total.toFixed(2)}</p>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className={`py-20 text-center border rounded-xl space-y-4 transition ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-205 shadow-md shadow-slate-101/5 text-slate-805' : 'bg-zinc-90 w-full border border-neutral-850'
                  }`}>
                    <ShoppingBag className="h-10 w-10 text-neutral-400 mx-auto" />
                    <h4 className={`text-xs font-black uppercase ${themeMode === 'light' ? 'text-slate-805' : 'text-white'}`}>No Order Constellations Found</h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Our logs report you have not requested an ELYVATE billing transaction yet.
                    </p>
                    <button
                      id="dash-go-shop"
                      onClick={() => setCustomerTab('shop')}
                      className={`px-5 py-2.5 text-xs tracking-wider uppercase font-bold text-white rounded-lg cursor-pointer ${
                        themeMode === 'light' ? 'bg-indigo-650 hover:bg-indigo-755 shadow-md shadow-indigo-120/10' : 'bg-purple-600 hover:bg-purple-500'
                      }`}
                    >
                      BROWSE THE SHOP
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROFILE MODIFICATION */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className={`border p-6 rounded-xl space-y-6 transition ${
                themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-slate-100/5' : 'bg-zinc-900 border border-neutral-805'
              }`}>
                <h3 className={`text-xs font-black tracking-widest uppercase border-b pb-3 ${
                  themeMode === 'light' ? 'border-slate-150 text-slate-800' : 'border-neutral-800 text-white'
                }`}>MANAGE ACCESS CREDENTIALS</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Operative Reference</label>
                    <input
                      id="dash-prof-name"
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-840 focus:border-purple-500 text-white placeholder:text-zinc-650'
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Gateway Email (Cannot alter)</label>
                    <input
                      id="dash-prof-email"
                      type="email"
                      disabled
                      value={profileEmail}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border cursor-not-allowed ${
                        themeMode === 'light' ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-neutral-950 border-neutral-840 text-neutral-500'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-2 text-left">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Terminal Telephone</label>
                    <input
                      id="dash-prof-phone"
                      type="tel"
                      placeholder="+1 (555) 0124-918"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-840 focus:border-purple-500 text-white placeholder:text-zinc-650'
                      }`}
                    />
                  </div>
                </div>

                {profileLogs && (
                  <div className="p-3 bg-green-950/20 border border-green-800/20 rounded-md text-green-400 text-xs font-semibold uppercase">
                    {profileLogs}
                  </div>
                )}

                <button
                  id="dash-prof-submit-btn"
                  type="submit"
                  className={`px-6 py-2.5 text-xs tracking-wider uppercase font-bold text-white rounded-md cursor-pointer ${
                    themeMode === 'light' ? 'bg-indigo-650 hover:bg-indigo-755 shadow-md shadow-indigo-120/10' : 'bg-purple-600 hover:bg-purple-500'
                  }`}
                >
                  Sync Profile States
                </button>
              </form>
            )}

            {/* TAB 3: WISHLIST WISHLISTS LIST */}
            {activeTab === 'wishlist' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlistProducts.length > 0 ? (
                  wishlistProducts.map((p) => (
                    <div 
                      key={p.id}
                      className={`border p-3.5 rounded-xl flex items-center justify-between gap-4 transition ${
                        themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-slate-100/5' : 'bg-zinc-900 border border-neutral-805'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="h-12 w-12 object-cover rounded shrink-0" />
                        <div className="text-left">
                          <h4 className={`text-xs font-black uppercase tracking-wider line-clamp-1 ${themeMode === 'light' ? 'text-slate-805' : 'text-white'}`}>{p.name}</h4>
                          <span className={`text-[10px] font-mono font-bold ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>${p.salePrice || p.price}</span>
                        </div>
                      </div>

                      <button
                        id={`wishlist-inspect-btn-${p.id}`}
                        onClick={() => handleProductDetail(p.slug)}
                        className={`p-2 rounded-lg transition cursor-pointer ${
                          themeMode === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-indigo-650' : 'bg-neutral-950 hover:bg-neutral-800 text-purple-400'
                        }`}
                        title="View Unit"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className={`sm:col-span-2 py-20 text-center border rounded-xl space-y-4 transition ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-205 shadow-md shadow-slate-101/5 text-slate-805' : 'bg-zinc-90 w-full border border-neutral-850'
                  }`}>
                    <Heart className="h-10 w-10 text-neutral-400 mx-auto" />
                    <h4 className={`text-xs font-black uppercase ${themeMode === 'light' ? 'text-slate-805' : 'text-white'}`}>Your Wishlist Coordinates are Empty</h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                      Click the wishlist heart selector on projector details pages to load active bookmarks inside this frame.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* TELEMETRY TRACKER SIDEBAR COLUMN (COLUMN 4) - Displays order tracking values! */}
          <div className={`border p-5 rounded-xl space-y-6 transition-all ${
            themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-slate-101/5 text-slate-900 font-bold' : 'bg-zinc-900 border-neutral-805 text-white'
          }`}>
            <h3 className={`text-xs font-black tracking-widest uppercase border-b pb-3 ${
              themeMode === 'light' ? 'border-slate-155 text-slate-800' : 'border-neutral-805'
            }`}>ORBITAL TRACKER TELEMETRY</h3>
            
            {tracingOrder ? (
              <div className="space-y-6 font-mono text-xs text-neutral-500 text-left">
                <div>
                  <p className={`text-[10px] ${themeMode === 'light' ? 'text-slate-450' : 'text-zinc-500'}`}>MONITORED VESSEL ID</p>
                  <p className={`font-sans text-sm font-black ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>{tracingOrder.id}</p>
                </div>

                {/* 4 Steps Timelines display */}
                <div className={`space-y-5 relative pl-5.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 select-none ${
                  themeMode === 'light' ? 'before:bg-slate-150' : 'before:bg-neutral-850'
                }`}>
                  {[
                    { key: 'pending', title: 'ORD PLACED', msg: 'Order successfully logged and verified.', check: true },
                    { key: 'processing', title: 'ALIGN OPTICS', msg: 'Fine tuning prism lasers and direct stepper alignment.', check: tracingOrder.status !== 'pending' },
                    { key: 'shipped', title: 'AIRBORNE SHIPPED', msg: 'Assigned to international cargo aviation.', check: ['shipped', 'delivered'].includes(tracingOrder.status) },
                    { key: 'delivered', title: 'ARRIVED TARGET', msg: 'Coordinates delivery success reported.', check: tracingOrder.status === 'delivered' }
                  ].map((step, idx) => (
                    <div key={idx} className="relative space-y-1">
                      {/* Node Bullet check indicators */}
                      <span className={`absolute -left-5.5 top-0.5 h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        step.check 
                          ? themeMode === 'light'
                            ? 'bg-indigo-600 border-indigo-400 ring-4 ring-indigo-500/10'
                            : 'bg-purple-600 border-purple-500 ring-4 ring-purple-600/10' 
                          : themeMode === 'light'
                            ? 'bg-slate-50 border-slate-250'
                            : 'bg-zinc-950 border-neutral-800'
                      }`}>
                        {step.check && <CheckCircle className="h-1.5 w-1.5 text-white fill-current" />}
                      </span>

                      <h4 className={`text-[10px] tracking-widest font-black uppercase font-sans ${
                        step.check 
                          ? themeMode === 'light' ? 'text-slate-900 font-extrabold' : 'text-white' 
                          : 'text-neutral-500'
                      }`}>{step.title}</h4>
                      <p className={`text-[10px] leading-normal font-sans ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-500'}`}>{step.msg}</p>
                    </div>
                  ))}
                </div>

                <div className={`pt-4 border-t leading-normal text-[10px] flex items-center gap-2 ${
                  themeMode === 'light' ? 'border-slate-150' : 'border-neutral-850/60'
                }`}>
                  <Sparkles className={`h-4 w-4 animate-pulse shrink-0 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-450'}`} />
                  <span className={`font-sans ${themeMode === 'light' ? 'text-slate-500' : 'text-zinc-500'}`}>Live coordinates synced against global shipping ports. Delivery timelines average 6 days.</span>
                </div>
              </div>
            ) : (
              <div className={`py-8 text-center font-mono text-[10px] leading-relaxed ${themeMode === 'light' ? 'text-slate-450' : 'text-zinc-500'}`}>
                <p>SELECT "TELEMETRY" ON ANY PAST CONSTELLATION ROW FOR METRICS RADAR TRACING OVERLAYS.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
