import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, Ticket, Check, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export const CustomerCart: React.FC = () => {
  const { 
    cart, updateCartQuantity, removeFromCart, setCustomerTab, 
    applyCoupon, removeCoupon, activeCoupon, themeMode 
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const subtotal = cart.reduce((acc, curr) => {
    const price = curr.product.salePrice || curr.product.price;
    return acc + price * curr.quantity;
  }, 0);

  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.type === 'percentage') {
      discount = Number((subtotal * (activeCoupon.value / 100)).toFixed(2));
    } else {
      discount = Math.min(activeCoupon.value, subtotal);
    }
  }

  const shipping = 0; // Free Shipping globally
  const total = Number((subtotal - discount + shipping).toFixed(2));

  // Threshold indicator for Free Shipping (for demo say free shipping globally, but we can display a cool tracker)
  const shippingThreshold = 50; 
  const freeShippingProgress = Math.min((subtotal / shippingThreshold) * 100, 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponStatus(res);
    if (res.success) {
      setCouponCode('');
    }
    setTimeout(() => {
      setCouponStatus(null);
    }, 4000);
  };

  const handleCheckoutNav = () => {
    setCustomerTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`transition-all duration-350 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'} min-h-screen py-10`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title header */}
        <div className={`border-b pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-900'}`}>
          <div className="space-y-1.5">
            <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>YOUR CART</span>
            <h1 className={`text-3xl font-black uppercase tracking-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>ALIGN YOUR PREPARATION</h1>
          </div>
          <button
            id="cart-continue-shopping-btn"
            onClick={() => setCustomerTab('shop')}
            className={`flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer ${themeMode === 'light' ? 'text-slate-505 hover:text-indigo-650' : 'text-neutral-450 hover:text-white'}`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>CONTINUE SHOPPING</span>
          </button>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* L: ACTIVE CARDS COLUMN (COLUMN 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Free Shipping target notifier bar */}
              <div className={`p-4 rounded-xl space-y-2.5 border ${themeMode === 'light' ? 'bg-slate-50 border-slate-155' : 'bg-neutral-900/40 border-neutral-850'}`}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className={`font-bold uppercase ${themeMode === 'light' ? 'text-slate-800' : 'text-white'}`}>FREE GLOBAL AVIATION SHIPPING</span>
                  {subtotal >= shippingThreshold ? (
                    <span className="text-green-500 font-bold uppercase tracking-wider text-[10px]">LOCKED IN!</span>
                  ) : (
                    <span className="text-zinc-500 font-bold uppercase text-[10px]">ADD ${(shippingThreshold - subtotal).toFixed(2)} MORE</span>
                  )}
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden border ${themeMode === 'light' ? 'bg-slate-205 border-slate-300' : 'bg-zinc-950 border-neutral-900'}`}>
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${themeMode === 'light' ? 'bg-indigo-600' : 'bg-purple-600'}`} 
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Shopping Cart List Lines */}
              <div className="space-y-4">
                {cart.map((item, index) => {
                  const currentPrice = item.product.salePrice || item.product.price;
                  return (
                    <div 
                      key={`${item.product.id}-${item.selectedColor}`}
                      id={`cart-row-${item.product.id}`}
                      className={`border p-4 rounded-xl gap-4 flex flex-col sm:flex-row sm:items-center justify-between transition-all duration-250 ${
                        themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-100/5' : 'bg-zinc-900 border-neutral-805'
                      }`}
                    >
                      {/* Product details info row */}
                      <div className="flex items-center gap-4">
                        <div className={`h-16 w-16 rounded-lg overflow-hidden shrink-0 ${themeMode === 'light' ? 'bg-slate-100' : 'bg-neutral-950'}`}>
                          <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-zinc-500 tracking-wider">SKU: {item.product.sku}</span>
                          <h3 className={`text-xs sm:text-sm font-black uppercase tracking-wider ${themeMode === 'light' ? 'text-slate-855' : 'text-white'}`}>{item.product.name}</h3>
                          <span className={`text-[10px] uppercase font-bold ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>Finish: <span className={`${themeMode === 'light' ? 'text-indigo-650 font-extrabold' : 'text-purple-400'}`}>{item.selectedColor}</span></span>
                        </div>
                      </div>

                      {/* Interactive Counters + Price details */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-transparent sm:border-t-0 pt-3 sm:pt-0">
                        {/* Quantity controls */}
                        <div className={`flex items-center border rounded-md p-1 justify-between select-none ${
                          themeMode === 'light' ? 'border-slate-205 bg-slate-50' : 'border-neutral-800 bg-neutral-955'
                        }`}>
                          <button
                            id={`cart-qty-dec-${item.product.id}`}
                            onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                            className={`p-1 px-2 cursor-pointer transition ${themeMode === 'light' ? 'text-slate-400 hover:text-indigo-650' : 'text-zinc-400 hover:text-white'}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className={`font-mono text-xs font-bold text-center w-6 ${themeMode === 'light' ? 'text-slate-850' : 'text-white'}`}>{item.quantity}</span>
                          <button
                            id={`cart-qty-inc-${item.product.id}`}
                            onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                            className={`p-1 px-2 cursor-pointer transition ${themeMode === 'light' ? 'text-slate-400 hover:text-indigo-650' : 'text-zinc-450 hover:text-white'}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Prices details summary */}
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="text-xs text-neutral-500 mt-0.5">${currentPrice} each</p>
                            <p className={`text-xs font-black uppercase tracking-wider ${themeMode === 'light' ? 'text-slate-855' : 'text-white'}`}>${(currentPrice * item.quantity).toFixed(2)}</p>
                          </div>

                          <button
                            id={`cart-item-remove-${item.product.id}`}
                            onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                            className={`p-2 rounded-md transition cursor-pointer ${
                              themeMode === 'light' 
                                ? 'text-slate-450 hover:text-red-600 bg-slate-100 hover:bg-neutral-100' 
                                : 'text-neutral-500 hover:text-red-400 bg-neutral-950 hover:bg-red-950/20'
                            }`}
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* R: SUMMARY CALCULATION (COLUMN 4) */}
            <div className={`border p-6 rounded-xl space-y-6 transition-all ${
              themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-120/5' : 'bg-zinc-900 border-neutral-805'
            }`}>
              <h3 className={`text-xs font-black tracking-widest uppercase border-b pb-3 ${themeMode === 'light' ? 'text-slate-800 border-slate-150' : 'text-white border-neutral-800'}`}>ORDER SUMMARY</h3>
              
              {/* Dynamic totals lines */}
              <div className={`space-y-3.5 text-xs font-medium font-mono ${themeMode === 'light' ? 'text-slate-500 font-bold' : 'text-neutral-400'}`}>
                <div className="flex justify-between items-center bg-zinc-90">
                  <span>SUBTOTAL</span>
                  <span className={`font-bold font-sans ${themeMode === 'light' ? 'text-slate-805' : 'text-white'}`}>${subtotal.toFixed(2)}</span>
                </div>

                {activeCoupon && (
                  <div className={`flex justify-between items-center bg-zinc-90 ${themeMode === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                    <span className="flex items-center gap-1">COUPON ({activeCoupon.code}) <button onClick={removeCoupon} className="text-red-400 hover:text-red-350 font-bold ml-1">✕</button></span>
                    <span className="font-bold font-sans">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center bg-zinc-90">
                  <span>LOGISTICS SHIPPING</span>
                  <span className={`font-bold ${themeMode === 'light' ? 'text-green-600' : 'text-green-400'}`}>FREE</span>
                </div>

                <div className={`border-t pt-3.5 flex justify-between items-center text-sm font-black font-sans uppercase tracking-tight ${
                  themeMode === 'light' ? 'border-slate-150 text-slate-855' : 'border-neutral-850 text-white'
                }`}>
                  <span>ESTIMATED TOTAL</span>
                  <span className={`text-lg font-extrabold ${themeMode === 'light' ? 'text-indigo-655' : 'text-purple-400'}`}>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupons submission line panel */}
              <div className={`border-t pt-5 space-y-3 ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-850'}`}>
                <span className={`block text-[10px] tracking-wider uppercase font-bold ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-450'}`}>Coupon support</span>
                <form onSubmit={handleApplyCoupon} className={`flex border rounded-lg p-1 ${themeMode === 'light' ? 'bg-slate-50 border-slate-205' : 'bg-neutral-950 border-neutral-850'}`}>
                  <input
                    id="cart-coupon-input"
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`flex-1 bg-transparent text-xs px-2 outline-none placeholder:text-neutral-400 border-none ${themeMode === 'light' ? 'text-slate-855' : 'text-white'}`}
                  />
                  <button
                    id="cart-coupon-submit-btn"
                    type="submit"
                    className={`px-4 py-2 rounded-md text-[10px] tracking-widest font-black uppercase text-white flex items-center gap-1 cursor-pointer transition ${
                      themeMode === 'light' ? 'bg-indigo-650 hover:bg-indigo-755' : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    <span>Apply</span>
                  </button>
                </form>

                {couponStatus && (
                  <motion.p
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[10px] font-bold uppercase tracking-wider ${couponStatus.success ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {couponStatus.message}
                  </motion.p>
                )}
              </div>

              {/* Checkout actions */}
              <div className="pt-2">
                <button
                  id="cart-checkout-proceed-btn"
                  onClick={handleCheckoutNav}
                  className={`w-full py-3.5 text-xs tracking-widest font-black uppercase rounded-lg text-center transition flex items-center justify-center gap-2 text-white cursor-pointer ${
                    themeMode === 'light' ? 'bg-gradient-to-r from-indigo-605 to-purple-600 hover:to-purple-500 shadow-md shadow-indigo-120/10' : 'bg-purple-600 hover:bg-purple-500'
                  }`}
                >
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Payment badges */}
              <div className={`border-t pt-4 text-center space-y-2 select-none ${themeMode === 'light' ? 'border-slate-155' : 'border-neutral-800/45'}`}>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono">Simulated 2Checkout Portals Encrypted</span>
                <div className="flex justify-center items-center gap-3 grayscale opacity-35 hover:grayscale-0 hover:opacity-75 transition-all">
                  <span className={`text-[10px] px-2 py-0.5 border font-black tracking-widest rounded uppercase ${
                    themeMode === 'light' ? 'bg-white border-slate-200 text-slate-805 font-bold' : 'bg-black border-neutral-800 text-white'
                  }`}>VISA</span>
                  <span className={`text-[10px] px-2 py-0.5 border font-black tracking-widest rounded uppercase ${
                    themeMode === 'light' ? 'bg-white border-slate-200 text-slate-855 font-bold' : 'bg-black border-neutral-800 text-white'
                  }`}>MC</span>
                  <span className={`text-[10px] px-2 py-0.5 border font-black tracking-widest rounded uppercase ${
                    themeMode === 'light' ? 'bg-white border-slate-200 text-slate-855 font-bold' : 'bg-black border-neutral-800 text-white'
                  }`}>AMEX</span>
                  <span className={`text-[10px] px-2 py-0.5 border font-black tracking-widest rounded uppercase ${
                    themeMode === 'light' ? 'bg-white border-slate-200 text-slate-855 font-bold' : 'bg-black border-neutral-800 text-white'
                  }`}>PAYPAL</span>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className={`text-center py-20 rounded-xl border space-y-4 ${
            themeMode === 'light' ? 'bg-slate-50 border-slate-200 shadow-md shadow-slate-100/5' : 'bg-zinc-900/15 border-neutral-800'
          }`}>
            <div className={`h-10 w-10 mx-auto border flex items-center justify-center rounded-full select-none text-lg ${
              themeMode === 'light' ? 'bg-white border-slate-200 text-indigo-600 shadow-sm' : 'bg-neutral-900 border-neutral-800 text-purple-400'
            }`}>
              🛒
            </div>
            <h2 className={`text-sm font-black uppercase ${themeMode === 'light' ? 'text-slate-805' : 'text-white'}`}>Your Shopping Cart is Empty</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              There are currently no galaxy projectors in your cosmic queue. Visit the shop and align items to continue checkout.
            </p>
            <button
              id="empty-cart-go-shop"
              onClick={() => setCustomerTab('shop')}
              className={`px-6 py-2.5 text-xs tracking-wider uppercase font-bold text-white rounded-lg transition cursor-pointer ${
                themeMode === 'light' ? 'bg-indigo-650 hover:bg-indigo-755 shadow-md shadow-indigo-120/10' : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              BROWSE GALAXY SHOP
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
