import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { 
  Star, Heart, Trash2, ArrowLeft, Plus, Minus, ShoppingCart, Shield, 
  Truck, ArrowRight, CornerDownRight, Check, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerProductDetail: React.FC = () => {
  const { 
    products, reviews, selectedProductSlug, setCustomerTab, setSelectedProductSlug,
    addToCart, wishlist, toggleWishlist, addReview, themeMode
  } = useApp();

  // Find selected active product
  const product = products.find(p => p.slug === selectedProductSlug && p.status === 'active');

  if (!product) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 text-center space-y-4 ${themeMode === 'light' ? 'bg-white text-slate-900' : 'text-white'}`}>
        <AlertCircle className="h-10 w-10 text-red-500" />
        <h2 className="text-sm font-black uppercase">Device Not Found</h2>
        <p className="text-xs text-zinc-500">The product you are trying to view is deleted or in draft state.</p>
        <button 
          id="product-not-found-back-btn"
          onClick={() => setCustomerTab('shop')} 
          className={`px-6 py-2 rounded-md text-xs font-bold transition ${themeMode === 'light' ? 'bg-indigo-650 text-white hover:bg-indigo-755' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
        >
          BACK TO STORE
        </button>
      </div>
    );
  }

  // Gallery Active Image
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  // Configuration Choices
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'features' | 'shipping'>('info');

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Sync image if product updates
  useEffect(() => {
    setActiveImg(product.images[0]);
    setSelectedColor(product.colors[0]?.name || 'Standard');
    setQty(1);
  }, [product]);

  const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.4)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center' });
  };

  const handleAddToCart = () => {
    addToCart(product, qty, selectedColor);
    // Visual alert feedback
    // Trigger notification
    const feedback = document.getElementById('add-to-cart-feedback');
    if (feedback) {
      feedback.classList.remove('opacity-0');
      setTimeout(() => feedback.classList.add('opacity-0'), 2500);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, qty, selectedColor);
    setCustomerTab('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get approved reviews of this specific product
  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');

  // Submit Review Handler
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    addReview(product.id, product.name, reviewName, reviewRating, reviewComment);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
    }, 4000);
  };

  // Find related products matching category
  const related = products.filter(p => p.id !== product.id && p.category === product.category && p.status === 'active').slice(0, 3);

  const isInWishlist = wishlist.includes(product.id);

  return (
    <div className={`transition-all duration-350 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'} min-h-screen py-10`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link Breadcrumbs */}
        <div className="flex items-center justify-between">
          <button 
            id="product-back-to-shop-btn"
            onClick={() => setCustomerTab('shop')}
            className={`flex items-center gap-2 text-xs font-semibold transition cursor-pointer ${themeMode === 'light' ? 'text-slate-500 hover:text-indigo-650' : 'text-neutral-400 hover:text-white'}`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>BACK TO SHOP CATALOG</span>
          </button>
          
          <span className={`text-[10px] font-mono select-none uppercase tracking-widest ${themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>
            SKU: {product.sku}
          </span>
        </div>

        {/* Double Column Display Grid: Left Gallery + Right Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* L: GALLERY LAYOUT (COLUMN 5) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main zoomable viewport */}
            <div 
              id="gallery-viewport"
              className={`relative aspect-square overflow-hidden rounded-xl border cursor-zoom-in ${
                themeMode === 'light' ? 'border-slate-200 bg-slate-50' : 'border-neutral-800 bg-neutral-950'
              }`}
              onMouseMove={handleZoom}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImg}
                alt={product.name}
                style={zoomStyle}
                className="h-full w-full object-cover transition-transform duration-100 ease-out"
              />
            </div>

            {/* Thumbnail Carousel Indicators */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    id={`gallery-thumb-${i}`}
                    onClick={() => setActiveImg(img)}
                    className={`aspect-square overflow-hidden rounded-lg border transition cursor-pointer ${
                      themeMode === 'light' ? 'bg-slate-50' : 'bg-neutral-900'
                    } ${
                      activeImg === img 
                        ? (themeMode === 'light' ? 'border-indigo-600 ring-2 ring-indigo-600/10' : 'border-purple-500 ring-2 ring-purple-500/20') 
                        : (themeMode === 'light' ? 'border-slate-200 hover:border-slate-350' : 'border-neutral-800 hover:border-neutral-700')
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* R: PARAMETERS LAYOUT (COLUMN 7) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3.5">
              
              {/* Category Breadcrumbs */}
              <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>
                {product.category}
              </span>

              <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-2.5">
                {product.salePrice ? (
                  <>
                    <span className={`text-2xl sm:text-3xl font-extrabold ${themeMode === 'light' ? 'text-indigo-655' : 'text-purple-400'}`}>${product.salePrice}</span>
                    <span className="text-sm font-medium text-neutral-500 line-through">${product.price}</span>
                  </>
                ) : (
                  <span className={`text-2xl sm:text-3xl font-extrabold ${themeMode === 'light' ? 'text-indigo-655' : 'text-purple-400'}`}>${product.price}</span>
                )}
              </div>

              {/* Reviews rating Summary */}
              <div className="flex items-center gap-1 text-xs">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : (themeMode === 'light' ? 'text-slate-200' : 'text-neutral-700')}`} />
                  ))}
                </div>
                <span className={`font-bold ml-1 ${themeMode === 'light' ? 'text-slate-705' : 'text-zinc-300'}`}>({product.rating} / 5)</span>
                <span className="text-neutral-450 mx-2">|</span>
                <button 
                  id="product-reviews-scroll-btn"
                  onClick={() => {
                    const el = document.getElementById('reviews-view-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`text-[11px] font-bold tracking-wider uppercase transition ${
                    themeMode === 'light' ? 'text-indigo-650 hover:text-indigo-755' : 'text-purple-450 hover:text-white'
                  }`}
                >
                  {productReviews.length} CUSTOMER REVIEWS
                </button>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${themeMode === 'light' ? 'text-slate-505' : 'text-neutral-400'}`}>
                {product.shortDescription}
              </p>
            </div>

            {/* Config Selection Modules */}
            <div className={`space-y-5.5 py-6 border-t border-b ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-900'}`}>
              
              {/* Color swatches */}
              {product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className={`text-[10px] tracking-wider font-extrabold uppercase block ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>
                    Select Color Finish: <span className={`font-black ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>{selectedColor}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {product.colors.map((col) => {
                      const isSel = selectedColor === col.name;
                      return (
                        <button
                          key={col.name}
                          id={`detail-color-${col.name}`}
                          onClick={() => setSelectedColor(col.name)}
                          className={`h-7 w-7 rounded-full border cursor-pointer flex items-center justify-center relative transition-all ${
                            isSel 
                              ? (themeMode === 'light' ? 'border-indigo-650 scale-110 ring-2 ring-indigo-200' : 'border-purple-500 scale-110 ring-2 ring-purple-500/20') 
                              : (themeMode === 'light' ? 'border-slate-300 hover:scale-105' : 'border-neutral-700 hover:scale-105')
                          }`}
                          style={{ backgroundColor: col.value }}
                          title={col.name}
                        >
                          {isSel && (
                            <span className={`h-2 w-2 rounded-full animate-pulse ${themeMode === 'light' ? 'bg-indigo-600' : 'bg-purple-400'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Counter Block */}
              <div className="space-y-2">
                <span className={`text-[10px] tracking-wider font-extrabold uppercase block ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>Quantity</span>
                <div className={`flex items-center border rounded-lg max-w-[130px] p-1 justify-between select-none ${
                    themeMode === 'light' ? 'border-slate-205 bg-slate-50' : 'border-neutral-800 bg-neutral-900'
                  }`}>
                  <button
                    id="qty-decrement-btn"
                    onClick={() => setQty(q => Math.max(q - 1, 1))}
                    disabled={qty === 1}
                    className={`p-1 px-2.5 rounded disabled:opacity-40 cursor-pointer ${
                      themeMode === 'light' ? 'text-slate-500 hover:text-indigo-600' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className={`font-mono text-sm font-bold text-center w-8 ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>{qty}</span>
                  <button
                    id="qty-increment-btn"
                    onClick={() => setQty(q => q + 1)}
                    className={`p-1 px-2.5 rounded cursor-pointer ${
                      themeMode === 'light' ? 'text-slate-500 hover:text-indigo-600' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* Checkouts Actions Block */}
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Add to cart CTA */}
                <button
                  id="detail-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 border text-xs tracking-widest font-black uppercase rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    themeMode === 'light' 
                      ? 'bg-slate-100 hover:bg-slate-150 border-slate-200 text-slate-800' 
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-white'
                  }`}
                >
                  <ShoppingCart className={`h-4 w-4 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} />
                  <span>ADD TO SHOPPING CART</span>
                </button>

                {/* Instant Buy Now CTA */}
                <button
                  id="detail-buy-now-btn"
                  onClick={handleBuyNow}
                  className={`flex-1 py-3 text-xs tracking-widest font-black uppercase rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-white ${
                    themeMode === 'light' ? 'bg-gradient-to-r from-indigo-605 to-purple-600 hover:to-purple-500' : 'bg-purple-600 hover:bg-purple-500'
                  }`}
                >
                  <span>BUY NOW</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Add Wishlist Toggle */}
                <button
                  id="detail-wishlist-toggle-btn"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isInWishlist 
                      ? 'border-red-650/40 bg-red-500/10 text-red-555 hover:bg-red-500/15' 
                      : (themeMode === 'light' 
                          ? 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-350 shadow-sm' 
                          : 'border-neutral-850 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700')
                  }`}
                  title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`h-4.5 w-4.5 ${isInWishlist ? 'fill-current animate-pulse' : ''}`} />
                </button>

              </div>

              {/* Inline visual feedback when adding item */}
              <div 
                id="add-to-cart-feedback"
                className={`opacity-0 transition-opacity duration-300 pointer-events-none text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 justify-center py-2 rounded-lg border ${
                  themeMode === 'light' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-green-950/15 border-green-800/20 text-green-400'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                <span>Successfully added item to coordinates cart</span>
              </div>
            </div>

            {/* Protection Seals */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border text-[10px] uppercase font-mono tracking-wider font-semibold text-center select-none ${
              themeMode === 'light' ? 'bg-slate-50 border-slate-150 text-slate-500' : 'bg-neutral-900/20 border-neutral-900/40 text-zinc-400'
            }`}>
              <span className="flex flex-col items-center gap-1"><Truck className={`h-4 w-4 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} /> Free Shipping</span>
              <span className="flex flex-col items-center gap-1"><Shield className={`h-4 w-4 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} /> 2-Year Warranty</span>
              <span className="flex flex-col items-center gap-1"><Check className={`h-4 w-4 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} /> Safe Laser Cert</span>
              <span className="flex flex-col items-center gap-1"><Check className={`h-4 w-4 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} /> Easy 30D Returns</span>
            </div>

          </div>
        </div>

        {/* C: DETAILED SPECIFICATIONS & TECH DOCUMENT TABS */}
        <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
          themeMode === 'light' ? 'bg-slate-50/50 border-slate-150' : 'bg-zinc-900/30 border-neutral-805'
        }`}>
          
          {/* Tab selectors */}
          <div className={`flex border-b text-xs font-bold tracking-widest ${
            themeMode === 'light' ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-zinc-900 border-neutral-850 text-neutral-400'
          }`}>
            {[
              { id: 'info', label: 'DESCRIPTION' },
              { id: 'features', label: 'SPEC FEATURES' },
              { id: 'shipping', label: 'SHIPPING & RETURNS' }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`detail-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 border-r transition cursor-pointer uppercase ${
                  themeMode === 'light' ? 'border-slate-200 hover:text-slate-900' : 'border-neutral-850 hover:text-white'
                } ${
                  activeTab === tab.id 
                    ? (themeMode === 'light' ? 'bg-white text-indigo-650 border-b-2 border-b-indigo-650' : 'bg-zinc-950 text-white border-b-2 border-b-purple-500') 
                    : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Viewport */}
          <div className={`p-6 text-xs sm:text-sm leading-relaxed space-y-4 ${themeMode === 'light' ? 'text-slate-700' : 'text-neutral-300'}`}>
            {activeTab === 'info' && (
              <div className="space-y-4">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>OPTICAL AUTONOMY REDEFINED</h4>
                <p>{product.description}</p>
                <p>Designed with pristine glass refracting focal grids, we completely eliminate fuzzy nebula outlines typical of budget alternatives. Let your interior layout reflect standard-setting Hubble-depth cosmic gradients.</p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>HARDWARE INTEGRATION CHIPS</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feat, i) => (
                    <li key={i} className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-slate-655' : 'text-zinc-300'}`}>
                      <CornerDownRight className={`h-3.5 w-3.5 shrink-0 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-slate-655' : 'text-zinc-300'}`}>
                    <CornerDownRight className={`h-3.5 w-3.5 shrink-0 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} />
                    <span>Lenses: Tri-lens HD Optical Grade Ground Glass</span>
                  </li>
                  <li className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-slate-655' : 'text-zinc-300'}`}>
                    <CornerDownRight className={`h-3.5 w-3.5 shrink-0 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} />
                    <span>Motor Engine: Direct Stepper Sine-Wave Whisper Quiet Engine</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h4 className={`text-sm font-bold uppercase tracking-wider ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>WORLDWIDE LOGISTICS CHANNELS</h4>
                <p>We pack ELYVATE devices in heavy-duty custom anti-vibration styrofoam containment blocks to guarantee clean aligned glass arrival.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className={`p-4 rounded-lg border space-y-2 ${themeMode === 'light' ? 'bg-white border-slate-200' : 'bg-zinc-950 border-neutral-850'}`}>
                    <h5 className={`font-extrabold uppercase text-[11px] tracking-widest ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-405'}`}>LOGISTICS TIMELINES</h5>
                    <p className={`text-xs leading-5 ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-400'}`}>Standard Insured Air Carrier: 5 - 12 days. Expedited Hyper Carrier: 2 - 4 days. All tracks include dynamic email updates.</p>
                  </div>
                  <div className={`p-4 rounded-lg border space-y-2 ${themeMode === 'light' ? 'bg-white border-slate-200 text-slate-805' : 'bg-zinc-950 border-neutral-850'}`}>
                    <h5 className={`font-extrabold uppercase text-[11px] tracking-widest ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-405'}`}>30-DAY RETURNS CHANNEL</h5>
                    <p className={`text-xs leading-5 ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-400'}`}>If the stellar array doesn't fit your room height expectations, simply coordinate a postage shipping packet with our team. We offer pure immediate refunds.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* D: INTERACTIVE CUSTOMER REVIEW FORUM */}
        <div id="reviews-view-anchor" className="space-y-8 pt-6">
          <div className={`border-b pb-4 flex flex-col md:flex-row items-baseline justify-between gap-4 ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-900'}`}>
            <div className="space-y-1.5">
              <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-655' : 'text-purple-400'}`}>STARGAZER FEEDBACK</span>
              <h3 className={`text-xl font-bold uppercase tracking-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>EXPERIENCES FOR "{product.name}"</h3>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-bold">
              <span>Approved Reviews ({productReviews.length})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Review Writer form */}
            <div className={`p-5 rounded-xl border transition-all ${
              themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-100/5' : 'bg-neutral-900/50 border-neutral-800'
            }`}>
              <h4 className={`text-xs font-black tracking-wider uppercase mb-1 ${themeMode === 'light' ? 'text-slate-800' : 'text-white'}`}>WRITE A STELLAR REVIEW</h4>
              <p className={`text-[11px] mb-4 ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-455 text-zinc-400'}`}>Share your room design layout. Reviews are moderated before approval.</p>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Your Full Operator Name</label>
                  <input
                    id="review-name-input"
                    type="text"
                    required
                    placeholder="Sirajul R."
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className={`w-full text-xs px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-650 ${
                      themeMode === 'light' 
                        ? 'bg-slate-50 border-slate-205 text-slate-850' 
                        : 'bg-neutral-950 border-neutral-800 text-inherit text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Score Rating</label>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        id={`review-star-rate-${num}`}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        className="hover:scale-110 cursor-pointer"
                      >
                        <Star className={`h-5 w-5 ${num <= reviewRating ? 'fill-current' : (themeMode === 'light' ? 'text-slate-200' : 'text-neutral-700')}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Room Experience comment</label>
                  <textarea
                    id="review-comment-textarea"
                    required
                    rows={4}
                    placeholder="The star constellations look beautifully sharp, and the purple nebulas are deep..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className={`w-full text-xs px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-650 resize-none ${
                      themeMode === 'light' 
                        ? 'bg-slate-50 border-slate-205 text-slate-850' 
                        : 'bg-neutral-950 border-neutral-800 text-inherit text-white'
                    }`}
                  />
                </div>

                <button
                  id="review-submit-submit-btn"
                  type="submit"
                  className={`w-full py-2.5 text-xs tracking-wider uppercase font-bold text-white rounded-md cursor-pointer transition-colors ${
                    themeMode === 'light' ? 'bg-indigo-650 hover:bg-indigo-755' : 'bg-purple-600 hover:bg-purple-500'
                  }`}
                >
                  Submit Review Ticket
                </button>
              </form>

              {reviewSuccess && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-semibold uppercase rounded-md flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Review cataloged! Awaiting Admin Approval.</span>
                </div>
              )}
            </div>

            {/* Approved Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div key={rev.id} className={`border p-4 rounded-xl space-y-3 transition-colors duration-250 ${
                    themeMode === 'light' ? 'bg-white border-slate-150 shadow-sm shadow-indigo-100/5' : 'bg-zinc-900 border-neutral-850'
                  }`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h5 className={`text-xs font-bold uppercase ${themeMode === 'light' ? 'text-slate-850' : 'text-white'}`}>{rev.customerName}</h5>
                        <span className="text-[10px] font-mono text-zinc-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-current' : (themeMode === 'light' ? 'text-slate-200' : 'text-neutral-850')}`} />
                        ))}
                      </div>
                    </div>
                    <p className={`text-xs italic leading-relaxed ${themeMode === 'light' ? 'text-slate-655' : 'text-zinc-300'}`}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className={`p-8 text-center border rounded-xl ${
                  themeMode === 'light' ? 'bg-white text-slate-400 border-slate-150 shadow-sm shadow-indigo-100/5' : 'bg-zinc-90 w-full text-zinc-500 border-neutral-850/60'
                }`}>
                  <p className="text-xs uppercase font-mono tracking-wider">No historic reviews on record for this specific projector unit yet.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* E: RELATED PRODUCTS RECOMMENDATION */}
        {related.length > 0 && (
          <div className={`space-y-6 pt-10 border-t ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-900'}`}>
            <div className="text-center md:text-left space-y-1.5">
              <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>RECOMMENDED COMPANIONS</span>
              <h3 className={`text-lg font-bold uppercase tracking-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>YOU MAY ALSO LIKE</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((prod) => (
                <div
                  key={prod.id}
                  id={`related-product-${prod.id}`}
                  onClick={() => {
                    setSelectedProductSlug(prod.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group w-full p-4.5 rounded-xl border cursor-pointer transition duration-300 flex flex-col justify-between ${
                    themeMode === 'light' 
                      ? 'bg-white border-slate-150 hover:border-slate-350 shadow-md shadow-indigo-120/5' 
                      : 'bg-zinc-90 w-full border-neutral-805 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="aspect-square bg-neutral-950 overflow-hidden rounded-lg">
                      <img src={prod.images[0]} alt={prod.name} className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-300" />
                    </div>
                    <h4 className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                      themeMode === 'light' ? 'text-slate-855 group-hover:text-indigo-650' : 'text-white group-hover:text-purple-450'
                    }`}>{prod.name}</h4>
                    <p className={`text-[11px] leading-normal line-clamp-2 ${themeMode === 'light' ? 'text-slate-500' : 'text-zinc-500'}`}>{prod.shortDescription}</p>
                  </div>
                  <div className={`pt-3 border-t mt-4 flex items-center justify-between text-xs ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-800/80'}`}>
                    <span className={`font-semibold ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>${prod.salePrice || prod.price}</span>
                    <span className={`text-[9px] font-black tracking-wider uppercase flex items-center gap-1 transition ${
                      themeMode === 'light' ? 'text-slate-500 group-hover:text-indigo-600' : 'text-neutral-300 group-hover:text-white'
                    }`}>VIEW ITEM <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
