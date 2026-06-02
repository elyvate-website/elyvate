import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { CreditCard, CheckCircle2, ShieldCheck, Truck, ArrowRight, CornerDownRight, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerCheckout: React.FC = () => {
  const { 
    cart, activeCoupon, currentCustomer, placeOrder, setCustomerTab, themeMode 
  } = useApp();

  // Step state: 'form' | 'success'
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

  // Address Form States
  const [email, setEmail] = useState(currentCustomer?.email || '');
  const [name, setName] = useState(currentCustomer?.name || '');
  const [phone, setPhone] = useState(currentCustomer?.phone || '');
  
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');

  // Simulated Payment Form States
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [paymentError, setPaymentError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Math Calculations
  const subtotal = cart.reduce((acc, current) => {
    const pr = current.product.salePrice || current.product.price;
    return acc + pr * current.quantity;
  }, 0);

  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.type === 'percentage') {
      discount = Number((subtotal * (activeCoupon.value / 100)).toFixed(2));
    } else {
      discount = Math.min(activeCoupon.value, subtotal);
    }
  }

  const shipping = 0;
  const total = Number((subtotal - discount + shipping).toFixed(2));

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!address || !city || !state || !zip) {
      setPaymentError('Kindly fill out all necessary Shipping Address parameters');
      return;
    }

    if (!cardNum || !cardExpiry || !cardCvv) {
      setPaymentError('Simulation credentials mapping missing');
      return;
    }

    setIsSubmitting(true);
    setPaymentError('');

    // Simulate 2Checkout payment gateway processing API
    setTimeout(() => {
      const shippingAddress = {
        address,
        apartment,
        city,
        state,
        zipCode: zip,
        country
      };
      
      const newOrder = placeOrder(shippingAddress, { name, email, phone });
      setPlacedOrderDetails(newOrder);
      setIsSubmitting(false);
      setStep('success');
    }, 1500);

  };

  if (step === 'success' && placedOrderDetails) {
    const expectedArrival = new Date();
    expectedArrival.setDate(expectedArrival.getDate() + 8);

    return (
      <div className={`transition-all duration-350 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'} min-h-screen py-16`}>
        <div className="mx-auto max-w-2xl px-4 text-center space-y-8">
          
          <div className={`inline-flex items-center justify-center p-4 rounded-full border ${
            themeMode === 'light' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-green-950/20 border-green-800/40 text-green-400'
          }`}>
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-655' : 'text-purple-400'}`}>
              PAYMENT TRANSACTION AUTHORIZED
            </span>
            <h1 className={`text-3xl font-black uppercase tracking-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>ORDER CONFIRMED</h1>
            <p className={`text-xs sm:text-sm ${themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
              Your ELYVATE billing transaction completed securely via 2Checkout.
            </p>
          </div>

          {/* Receipt Panel */}
          <div className={`border p-6 rounded-xl text-left space-y-4 transition ${
            themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-120/5' : 'bg-zinc-900 border border-neutral-805'
          }`}>
            
            {/* Header info */}
            <div className={`flex justify-between items-baseline border-b pb-3 font-mono text-xs ${
              themeMode === 'light' ? 'border-slate-150 text-slate-500' : 'border-neutral-850 text-neutral-400'
            }`}>
              <span>ORDER ID: <strong className={`font-sans ${themeMode === 'light' ? 'text-slate-900 font-extrabold' : 'text-white'}`}>{placedOrderDetails.id}</strong></span>
              <span>{new Date(placedOrderDetails.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Address lines */}
            <div>
              <h4 className={`text-[10px] font-black tracking-widest uppercase ${themeMode === 'light' ? 'text-slate-450' : 'text-zinc-500'}`}>Aviation Address</h4>
              <p className={`text-xs uppercase font-bold mt-1 ${themeMode === 'light' ? 'text-slate-905' : 'text-white'}`}>{placedOrderDetails.customerName}</p>
              <p className={`text-xs mt-0.5 ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-400'}`}>
                {placedOrderDetails.shippingAddress.address} {placedOrderDetails.shippingAddress.apartment || ''}, {placedOrderDetails.shippingAddress.city}, {placedOrderDetails.shippingAddress.state} {placedOrderDetails.shippingAddress.zipCode}
              </p>
              <p className={`text-xs ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-405'}`}>{placedOrderDetails.shippingAddress.country}</p>
            </div>

            {/* Line items list */}
            <div>
              <h4 className={`text-[10px] font-black tracking-widest uppercase border-b pb-1 mb-2 ${
                themeMode === 'light' ? 'border-slate-150 text-slate-450' : 'border-neutral-850 text-zinc-500'
              }`}>Selected Gear</h4>
              <div className="space-y-2">
                {placedOrderDetails.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className={`flex items-center gap-1 ${themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
                      <CornerDownRight className={`h-3 w-3 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} />
                      {it.productName} <strong className={`${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>({it.selectedColor})</strong> x {it.quantity}
                    </span>
                    <span className={`font-mono font-bold ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total figures */}
            <div className={`border-t pt-3.5 space-y-2 font-mono text-xs ${
              themeMode === 'light' ? 'border-slate-150 text-slate-500' : 'border-neutral-850 text-neutral-400'
            }`}>
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span className={`font-bold font-sans ${themeMode === 'light' ? 'text-slate-805' : 'text-white'}`}>${placedOrderDetails.subtotal.toFixed(2)}</span>
              </div>
              {placedOrderDetails.discount > 0 && (
                <div className={`flex justify-between ${themeMode === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                  <span>DISCOUNT:</span>
                  <span className="font-sans font-bold">-${placedOrderDetails.discount.toFixed(2)}</span>
                </div>
              )}
              <div className={`flex justify-between font-sans text-sm font-black pt-1.5 border-t ${
                themeMode === 'light' ? 'border-slate-205 text-indigo-650' : 'border-neutral-900 text-purple-400'
              }`}>
                <span>TOTAL:</span>
                <span className="text-base font-extrabold">${placedOrderDetails.total.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* Delivery progress tracking estimate */}
          <div className={`border rounded-xl p-4 flex items-center gap-4 text-left ${
            themeMode === 'light' ? 'bg-slate-50 border-slate-155' : 'bg-neutral-900/30 border-neutral-850'
          }`}>
            <Truck className={`h-6 w-6 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} />
            <div>
              <h4 className={`text-xs font-black uppercase tracking-wider ${themeMode === 'light' ? 'text-slate-800' : 'text-white'}`}>Estimated Constellation Arrival</h4>
              <p className={`text-xs mt-0.5 ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-400'}`}>
                Around {expectedArrival.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}. Check order panel for telemetry tracking.
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 font-bold text-xs uppercase">
            <button
              id="success-checkout-track-btn"
              onClick={() => {
                setCustomerTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-6 py-3 rounded-lg text-white font-black hover:scale-[1.01] transition cursor-pointer ${
                themeMode === 'light' ? 'bg-indigo-650 hover:bg-indigo-755 shadow-md shadow-indigo-120/10' : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              TRACK ORDER TIMELINES
            </button>
            <button
              id="success-checkout-back-btn"
              onClick={() => {
                setCustomerTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-6 py-3 border rounded-lg transition font-black cursor-pointer ${
                themeMode === 'light' ? 'bg-slate-100/80 hover:bg-slate-200 border-slate-205 text-slate-800' : 'bg-zinc-900 hover:bg-zinc-800 border-neutral-800 text-neutral-300'
              }`}
            >
              CONTINUE SHOPPING
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-350 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'} min-h-screen py-10`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className={`border-b pb-5 ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-900'}`}>
          <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>FINALIZE</span>
          <h1 className={`text-3xl font-black uppercase tracking-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>SECURE BILATERAL CHECKOUT</h1>
        </div>

        {cart.length > 0 ? (
          <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* L: EDIT DATA SHEETS COLUMN (COLUMN 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. Customer contacts details */}
              <div className={`border p-5 sm:p-6 rounded-xl space-y-4 transition ${
                themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-slate-100/5' : 'bg-zinc-900 border border-neutral-805'
              }`}>
                <h3 className={`text-xs font-black tracking-widest uppercase border-b pb-2 mb-4 ${
                  themeMode === 'light' ? 'border-slate-150 text-slate-855' : 'border-neutral-850 text-white'
                }`}>1. CUSTOMER IDENTITY</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Operator Email Address</label>
                    <input
                      id="checkout-email"
                      type="email"
                      required
                      placeholder="explorer@elyvate.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Operator Full name</label>
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      placeholder="Sirajul Islam Rubel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Phone Terminal Number</label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      placeholder="+1 (234) 567-8900"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all relative ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Destination coordinates */}
              <div className={`border p-5 sm:p-6 rounded-xl space-y-4 transition ${
                themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-slate-100/5' : 'bg-zinc-900 border border-neutral-805'
              }`}>
                <h3 className={`text-xs font-black tracking-widest uppercase border-b pb-2 mb-4 ${
                  themeMode === 'light' ? 'border-slate-150 text-slate-855' : 'border-neutral-850 text-white'
                }`}>2. SHIPPING COORDINATES</h3>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <div className="sm:col-span-4">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Drywall Street Address</label>
                    <input
                      id="checkout-address"
                      type="text"
                      required
                      placeholder="Aviation Highway, building 40"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Apartment / Suite</label>
                    <input
                      id="checkout-apartment"
                      type="text"
                      placeholder="Apt 20B"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                      }`}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>City</label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>State / Province</label>
                    <input
                      id="checkout-state"
                      type="text"
                      required
                      placeholder="NY"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                      }`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Zip / Codephrase</label>
                    <input
                      id="checkout-zip"
                      type="text"
                      required
                      placeholder="10001"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Country Location</label>
                    <input
                      id="checkout-country"
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                        themeMode === 'light' 
                          ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                          : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Simulated Credit-card gateway payment form mapping */}
              <div className={`border p-5 sm:p-6 rounded-xl space-y-4 transition ${
                themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-slate-100/5' : 'bg-zinc-900 border border-neutral-850'
              }`}>
                <h3 className={`text-xs font-black tracking-widest uppercase border-b pb-2 mb-4 ${
                  themeMode === 'light' ? 'border-slate-150 text-slate-855' : 'border-neutral-850 text-white'
                }`}>3. SECURE 2CHECKOUT GATEWAY</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Simulated Card Nameplate digits</label>
                    <div className={`flex px-3.5 py-2.5 rounded-lg border items-center justify-between transition-all ${
                      themeMode === 'light' 
                        ? 'bg-slate-50 border-slate-205 focus-within:border-indigo-600 focus-within:bg-white' 
                        : 'bg-neutral-950 border-neutral-800 focus-within:border-purple-500'
                    }`}>
                      <input
                        id="checkout-card-num"
                        type="text"
                        required
                        placeholder="4111 8891 3004 9012"
                        value={cardNum}
                        onChange={(e) => setCardNum(e.target.value)}
                        className={`bg-transparent text-xs outline-none w-full border-none ${
                          themeMode === 'light' ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-zinc-630'
                        }`}
                      />
                      <CreditCard className="h-4.5 w-4.5 text-zinc-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Expiry (MM/YY)</label>
                      <input
                        id="checkout-card-expiry"
                        type="text"
                        required
                        placeholder="11/29"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                          themeMode === 'light' 
                            ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                            : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] tracking-wider font-extrabold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>CVV</label>
                      <input
                        id="checkout-card-cvv"
                        type="password"
                        required
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none transition-all ${
                          themeMode === 'light' 
                            ? 'bg-slate-50 border-slate-205 focus:border-indigo-600 focus:bg-white text-slate-900 placeholder:text-slate-400' 
                            : 'bg-neutral-950 border-neutral-800 focus:border-purple-500 text-white placeholder:text-zinc-630'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* R: REVIEW COLUMN CARDS (COLUMN 4) */}
            <div className={`border p-5 rounded-xl space-y-6 text-xs transition-all ${
              themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-120/5 text-slate-900' : 'bg-zinc-900 border-neutral-805 text-white'
            }`}>
              <h3 className={`text-xs font-black tracking-widest uppercase border-b pb-3 ${themeMode === 'light' ? 'text-slate-855 border-slate-150' : 'text-neutral-800'}`}>REVIEW IN TRANSIT</h3>
              
              <div className="space-y-4 max-h-56 overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className={`flex gap-3 items-center justify-between border-b pb-3 ${
                    themeMode === 'light' ? 'border-slate-150' : 'border-neutral-900'
                  }`}>
                    <img src={item.product.images[0]} alt="" className="h-10 w-10 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-[11px] font-bold uppercase truncate ${themeMode === 'light' ? 'text-slate-805 font-bold' : 'text-neutral-300'}`}>{item.product.name}</h4>
                      <p className={`text-[10px] ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-500'}`}>{item.selectedColor} x {item.quantity}</p>
                    </div>
                    <span className={`font-mono font-bold ${themeMode === 'light' ? 'text-slate-900 font-extrabold' : 'text-white'}`}>${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Order total list review */}
              <div className={`space-y-3 font-mono text-[11px] pt-2 border-t ${
                themeMode === 'light' ? 'border-slate-155 text-slate-500' : 'border-neutral-900 text-neutral-450'
              }`}>
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className={`font-sans ${themeMode === 'light' ? 'text-slate-900 font-bold' : 'text-white'}`}>${subtotal.toFixed(2)}</span>
                </div>
                {activeCoupon && (
                  <div className={`flex justify-between ${themeMode === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                    <span>COUPON DISCOUNT</span>
                    <span className="font-sans font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className={`flex justify-between uppercase font-sans text-sm font-black pt-2 border-t ${
                  themeMode === 'light' ? 'border-slate-205 text-indigo-650' : 'border-neutral-850 text-purple-400'
                }`}>
                  <span>BILL PAYMENT TOTAL</span>
                  <span className="text-base font-extrabold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Error logger */}
              {paymentError && (
                <div className="p-3.5 bg-red-950/20 border border-red-900/40 text-red-500 text-[11px] tracking-wide uppercase font-bold rounded-lg flex items-center gap-1.5 leading-normal">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Verify submit button */}
              <button
                id="checkout-finalize-btn"
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-xs font-black uppercase text-center rounded-lg tracking-widest transition flex items-center justify-center gap-2 cursor-pointer text-white hover:scale-[1.01] ${
                  themeMode === 'light' ? 'bg-gradient-to-r from-indigo-605 to-purple-600 hover:to-purple-500 shadow-md shadow-indigo-120/10' : 'bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>AUTHORIZING IN PROGRESS...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>AUTHORIZE & PLACE ORDER</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className={`text-[10px] uppercase tracking-widest block font-mono ${themeMode === 'light' ? 'text-slate-450' : 'text-zinc-500'}`}>Dyson & Apple optical standards, fully secured.</span>
              </div>
            </div>

          </form>
        ) : (
          <div className={`text-center py-24 border rounded-xl space-y-4 transition-all duration-350 ${
            themeMode === 'light' ? 'bg-slate-50 border-slate-150 shadow-md shadow-indigo-120/5 text-slate-900' : 'bg-zinc-900 border border-neutral-850 text-white'
          }`}>
            <h3 className="text-sm font-black uppercase">Your Shopping cart coordinates are void</h3>
            <button
              id="empty-checkout-back-shop"
              onClick={() => setCustomerTab('shop')}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold text-white transition cursor-pointer ${
                themeMode === 'light' ? 'bg-indigo-650 hover:bg-indigo-755 shadow-md shadow-indigo-120/10' : 'bg-purple-600 hover:bg-purple-500'
              }`}
            >
              SHOP NEW CONSTEL
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
