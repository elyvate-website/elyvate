import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Search, Star, SlidersHorizontal, ArrowUpDown, RefreshCw, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerShop: React.FC = () => {
  const { products, setCustomerTab, setSelectedProductSlug, themeMode } = useApp();

  // Search, categories and sorting filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceMax, setPriceMax] = useState(300);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeFeatures, setActiveFeatures] = useState<string[]>([]);
  
  // Responsive filter overlay on mobile
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync global search term from Header
  useEffect(() => {
    const q = localStorage.getItem('ely_search_term');
    if (q) {
      setSearchTerm(q);
      localStorage.removeItem('ely_search_term');
    }
    const cat = localStorage.getItem('ely_active_category');
    if (cat) {
      setSelectedCategory(cat);
      localStorage.removeItem('ely_active_category');
    }
  }, []);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('featured');
    setPriceMax(300);
    setSelectedColor(null);
    setActiveFeatures([]);
    setCurrentPage(1);
  };

  const toggleFeature = (feat: string) => {
    if (activeFeatures.includes(feat)) {
      setActiveFeatures(activeFeatures.filter(f => f !== feat));
    } else {
      setActiveFeatures([...activeFeatures, feat]);
    }
    setCurrentPage(1);
  };

  // Processing filters
  const filteredProducts = products.filter(product => {
    if (product.status !== 'active') return false;
    
    // Search Term Match
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category Match
    const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    // Price Match
    const currentPrice = product.salePrice || product.price;
    const matchPrice = currentPrice <= priceMax;
    
    // Color Swatch Match
    const matchColor = !selectedColor || product.colors.some(col => col.name.toLowerCase().includes(selectedColor.toLowerCase()));
    
    // Features Checklist Match
    const matchFeatures = activeFeatures.every(feat => 
      product.features.some(f => f.toLowerCase().includes(feat.toLowerCase()))
    );

    return matchSearch && matchCategory && matchPrice && matchColor && matchFeatures;
  });

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const pA = a.salePrice || a.price;
    const pB = b.salePrice || b.price;

    if (sortBy === 'price-asc') return pA - pB;
    if (sortBy === 'price-desc') return pB - pA;
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    
    // Default Featured sorting
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return b.rating - a.rating; // fallback
  });

  // Paginated Slices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const categories = ['All', 'Projectors', 'Home Decor', 'Electronics', 'Accessories', 'Bundles'];
  const colors = [
    { name: 'Black', value: '#121212' },
    { name: 'White', value: '#ececec' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Blue', value: '#1e40af' },
    { name: 'Red', value: '#b91c1c' }
  ];

  const featuresFilterList = ['Timer', 'Remote', 'Bluetooth', 'Adjustable', 'Portable'];

  const handleProductDetail = (slug: string) => {
    setSelectedProductSlug(slug);
    setCustomerTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`transition-all duration-300 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'} min-h-screen py-10`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page title header */}
        <div className={`text-center md:text-left space-y-2 border-b pb-5 ${themeMode === 'light' ? 'border-slate-200' : 'border-slate-800/80'}`}>
          <span className={`text-[10px] tracking-[0.35em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>COSMIC SELECTION</span>
          <h1 className={`text-3xl font-black uppercase tracking-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>SHOP ALL GEAR</h1>
          <p className={`text-xs ${themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'} max-w-lg`}>
            Fine-tune specifications to select the perfect planetary diffuser or certified laser coordinates for your bedroom setup.
          </p>
        </div>

        {/* Categories Rail + Secondary Toolbar combo */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full mb-2">
          
          {/* Category badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`shop-cat-${cat}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : (themeMode === 'light' 
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm border border-slate-200/50' 
                        : 'bg-zinc-900 text-neutral-400 border border-neutral-800 hover:text-white')
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick controls toolbar */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Mobile Filters trigger */}
            <button
              id="mobile-filters-trigger"
              onClick={() => setMobileFiltersOpen(true)}
              className={`lg:hidden px-4 py-2 border rounded-lg text-xs font-semibold tracking-wider flex items-center gap-2 ${
                themeMode === 'light'
                  ? 'bg-white border-slate-205 text-slate-700 hover:bg-slate-50'
                  : 'bg-zinc-900 border-neutral-800 text-zinc-450 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>SPECIFICATIONS</span>
            </button>

            {/* Price Sort Selection */}
            <div className={`flex items-center gap-2 border rounded-lg px-2.5 py-2 text-xs ${
              themeMode === 'light' ? 'bg-white border-slate-205 text-slate-850' : 'bg-zinc-900 border-neutral-850 text-white'
            }`}>
              <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
              <select
                id="shop-sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-[11px] font-bold tracking-wider outline-none border-none uppercase cursor-pointer text-inherit"
              >
                <option value="featured" className={themeMode === 'light' ? 'text-slate-900 bg-white' : 'text-white bg-zinc-900'}>Featured Curations</option>
                <option value="price-asc" className={themeMode === 'light' ? 'text-slate-900 bg-white' : 'text-white bg-zinc-900'}>Price: Low to High</option>
                <option value="price-desc" className={themeMode === 'light' ? 'text-slate-900 bg-white' : 'text-white bg-zinc-900'}>Price: High to Low</option>
                <option value="rating-desc" className={themeMode === 'light' ? 'text-slate-900 bg-white' : 'text-white bg-zinc-900'}>Highly Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Double-Pane Grid layout: Sidebar Left + Product Catalog Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A: SPEC SIDEBAR (DESKTOP) */}
          <aside className={`hidden lg:block lg:col-span-3 space-y-6 p-5 rounded-xl border transition-all duration-300 ${
            themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-100/5' : 'bg-neutral-900/60 border-slate-800/80'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-800'}`}>
              <h3 className={`text-xs font-black tracking-widest uppercase ${themeMode === 'light' ? 'text-slate-905' : 'text-neutral-300'}`}>SPEC FILTERS</h3>
              <button 
                id="shop-reset-filters-desktop"
                onClick={handleResetFilters}
                className={`text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                  themeMode === 'light' ? 'text-indigo-650 hover:text-indigo-755' : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                <RefreshCw className="h-2.5 w-2.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search inside Sidebar */}
            <div className="space-y-2">
              <label className={`block text-[10px] tracking-wider font-extrabold uppercase ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-450 text-zinc-400'}`}>Search Keywords</label>
              <div className={`flex items-center border rounded-md px-2.5 py-2 ${themeMode === 'light' ? 'bg-slate-50 border-slate-205' : 'bg-zinc-950 border-neutral-800'}`}>
                <Search className="h-3.5 w-3.5 text-neutral-500 mr-2" />
                <input
                  id="shop-search-input-desktop"
                  type="text"
                  placeholder="Nova, Astro..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`bg-transparent text-[11px] outline-none w-full border-none ${themeMode === 'light' ? 'text-slate-850 placeholder:text-slate-400' : 'text-inherit placeholder:text-neutral-600'}`}
                />
              </div>
            </div>

            {/* Price Max Filter Slider */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className={`block text-[10px] tracking-wider font-extrabold uppercase ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-450 text-zinc-400'}`}>Max Price Constraint</label>
                <span className={`text-[10px] font-mono font-bold ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>${priceMax}</span>
              </div>
              <input
                id="shop-price-slider-desktop"
                type="range"
                min="0"
                max="300"
                step="5"
                value={priceMax}
                onChange={(e) => {
                  setPriceMax(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`w-full h-1 rounded-lg cursor-pointer accent-indigo-650 ${themeMode === 'light' ? 'bg-slate-200' : 'bg-zinc-805'}`}
              />
              <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                <span>$0</span>
                <span>$300+</span>
              </div>
            </div>

            {/* Color swatches */}
            <div className="space-y-2.5">
              <label className={`block text-[10px] tracking-wider font-extrabold uppercase ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-450 text-zinc-400'}`}>Color Swatches</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((col) => {
                  const isSel = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      id={`color-swatch-${col.name}`}
                      onClick={() => {
                        setSelectedColor(isSel ? null : col.name);
                        setCurrentPage(1);
                      }}
                      className={`h-5 w-5 rounded-full border cursor-pointer relative flex items-center justify-center transition-all ${
                        isSel 
                          ? (themeMode === 'light' ? 'border-indigo-650 scale-110 ring-2 ring-indigo-150' : 'border-purple-500 scale-110 ring-2 ring-purple-500/20') 
                          : (themeMode === 'light' ? 'border-slate-300 hover:scale-105' : 'border-neutral-700 hover:scale-105')
                      }`}
                      style={{ backgroundColor: col.value }}
                      title={col.name}
                    >
                      {isSel && (
                        <span className={`h-1.5 w-1.5 rounded-full ${themeMode === 'light' ? 'bg-indigo-600' : 'bg-purple-400'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accessory Hardware Features Checklist */}
            <div className="space-y-2.5 pt-2">
              <label className={`block text-[10px] tracking-wider font-extrabold uppercase ${themeMode === 'light' ? 'text-slate-505 font-bold' : 'text-neutral-450 text-zinc-400 font-bold'}`}>Hardware Features</label>
              <div className="flex flex-col space-y-2.5">
                {featuresFilterList.map((feat) => {
                  const isChecked = activeFeatures.includes(feat);
                  return (
                    <label key={feat} className="flex items-center gap-2.5 text-xs transition cursor-pointer">
                      <input
                        id={`feat-checkbox-${feat}`}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFeature(feat)}
                        className={`rounded text-indigo-605 focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5 cursor-pointer ${
                          themeMode === 'light' ? 'border-slate-300 text-indigo-600' : 'border-zinc-700 bg-zinc-950 text-indigo-400'
                        }`}
                      />
                      <span className={`text-[11px] font-medium tracking-wide uppercase ${themeMode === 'light' ? 'text-slate-655' : 'text-zinc-300'}`}>{feat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* B: PRODUCTS CATALOG (GRID) RIGHT */}
          <main className="lg:col-span-9 space-y-10">
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((product) => {
                  const originalPrice = product.price;
                  const discountOffer = product.salePrice ? Math.round(((originalPrice - product.salePrice) / originalPrice) * 100) : null;
                  return (
                    <div
                      key={product.id}
                      id={`shop-product-card-${product.id}`}
                      onClick={() => handleProductDetail(product.slug)}
                      className={`group border p-3.5 rounded-xl cursor-pointer transition duration-300 flex flex-col justify-between ${
                        themeMode === 'light' 
                          ? 'bg-white border-slate-150 shadow-xl shadow-indigo-150/5 hover:border-slate-300' 
                          : 'bg-zinc-900 border-neutral-805/85 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        {/* Display Image with discount badges */}
                        <div className={`relative aspect-square overflow-hidden rounded-lg mb-3.5 ${themeMode === 'light' ? 'bg-slate-100' : 'bg-neutral-950'}`}>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover origin-center group-hover:scale-103 transition duration-500"
                          />
                          {discountOffer && (
                            <div className="absolute top-2 left-2 bg-red-600 text-white font-extrabold tracking-widest text-[8px] px-2 py-0.5 rounded shadow">
                              SAVE {discountOffer}%
                            </div>
                          )}
                          {product.isNewArrival && (
                            <div className="absolute top-2 right-2 bg-indigo-650 text-white font-extrabold tracking-widest text-[8px] px-2 py-0.5 rounded shadow">
                              NEW ARRIVAL
                            </div>
                          )}
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 text-amber-500 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                          <span className={`text-[9px] font-bold ml-1 ${themeMode === 'light' ? 'text-slate-400' : 'text-neutral-500'}`}>({product.rating})</span>
                        </div>

                        <h3 className={`text-sm font-bold uppercase transition-colors ${
                          themeMode === 'light' ? 'text-slate-900 group-hover:text-indigo-650' : 'text-white group-hover:text-indigo-400'
                        }`}>
                          {product.name}
                        </h3>
                        <p className={`text-[10.5px] leading-tight mt-1 line-clamp-2 ${themeMode === 'light' ? 'text-slate-505' : 'text-neutral-400'}`}>
                          {product.shortDescription}
                        </p>
                      </div>

                      {/* Specs info */}
                      <div className={`mt-4 pt-3.5 border-t flex items-center justify-between ${themeMode === 'light' ? 'border-slate-150' : 'border-neutral-800/70'}`}>
                        <div>
                          {product.salePrice ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className={`text-xs font-black ${themeMode === 'light' ? 'text-slate-905' : 'text-white'}`}>${product.salePrice}</span>
                              <span className="text-[10px] text-zinc-500 line-through">${product.price}</span>
                            </div>
                          ) : (
                            <span className={`text-xs font-black ${themeMode === 'light' ? 'text-slate-905' : 'text-white'}`}>${product.price}</span>
                          )}
                        </div>
                        
                        <span className={`text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 leading-none ${
                          themeMode === 'light' ? 'text-indigo-650 group-hover:text-indigo-750' : 'text-indigo-400 group-hover:text-indigo-300'
                        }`}>
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Unit</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`text-center py-20 rounded-xl border space-y-4 ${
                themeMode === 'light' ? 'bg-white border-slate-155 shadow-md shadow-indigo-150/5' : 'bg-zinc-900/40 border-neutral-800/50'
              }`}>
                <div className={`h-10 w-10 mx-auto flex items-center justify-center rounded-full font-bold text-lg select-none border ${
                  themeMode === 'light' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-neutral-800 border-neutral-700 text-purple-400'
                }`}>
                  !
                </div>
                <h3 className={`text-sm font-black uppercase ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>ZERO ALIGNED GEOMETRIES</h3>
                <p className={`text-xs max-w-sm mx-auto ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-500'}`}>
                  No galaxy devices match your exact specification parameters inside ELYVATE's database. Try relaxing structural checkbox filters.
                </p>
                <button
                  id="reset-filters-empty-state"
                  onClick={handleResetFilters}
                  className={`px-5 py-2.5 text-[10px] tracking-wider uppercase font-bold rounded-lg transition cursor-pointer border ${
                    themeMode === 'light' 
                      ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200' 
                      : 'bg-zinc-900 border-neutral-800 text-white hover:bg-neutral-800'
                  }`}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2.5 pt-8 border-t border-neutral-900/60 font-mono">
                <button
                  id="pagination-prev-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3.5 py-1.5 text-xs font-bold border rounded disabled:opacity-40 disabled:cursor-not-allowed uppercase transition ${
                    themeMode === 'light'
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'bg-zinc-900 border-neutral-800 text-neutral-300 hover:bg-zinc-800'
                  }`}
                >
                  Prev
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      id={`pagination-page-${page}`}
                      onClick={() => setCurrentPage(page)}
                      className={`h-7 w-7 rounded flex items-center justify-center text-xs font-bold transition-all ${
                        currentPage === page 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                          : (themeMode === 'light'
                              ? 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
                              : 'bg-zinc-900 text-zinc-400 border border-neutral-800 hover:text-white')
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  id="pagination-next-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3.5 py-1.5 text-xs font-bold border rounded disabled:opacity-40 disabled:cursor-not-allowed uppercase transition ${
                    themeMode === 'light'
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'bg-zinc-900 border-neutral-800 text-neutral-300 hover:bg-zinc-800'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* MOBILE SPEC FILTERS DRAWERS OVERLAY */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`fixed bottom-0 inset-x-0 z-50 rounded-t-2xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto lg:hidden border-t ${
                themeMode === 'light' ? 'bg-white text-slate-900 border-slate-200' : 'bg-zinc-940 text-white border-neutral-850'
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-3 mb-4 ${themeMode === 'light' ? 'border-slate-200' : 'border-neutral-800'}`}>
                <h3 className={`text-xs font-black tracking-widest uppercase ${themeMode === 'light' ? 'text-slate-805' : 'text-neutral-300'}`}>SPEC FILTERS</h3>
                <button
                  id="shop-reset-filters-mobile"
                  onClick={() => {
                    handleResetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className={`text-[9px] font-bold uppercase flex items-center gap-1 cursor-pointer ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Side drawer items */}
              <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className={`text-[10px] tracking-wider uppercase font-bold ${themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>Search Keywords</label>
                  <input
                    id="shop-search-input-mobile"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-lg border outline-none ${
                      themeMode === 'light' 
                        ? 'bg-slate-100 border-slate-200 text-slate-900' 
                        : 'bg-neutral-950 border-neutral-800 text-inherit'
                    }`}
                    placeholder="Enter keywords"
                  />
                </div>

                {/* Price constraint */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`text-[10px] tracking-wider uppercase font-bold ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-400'}`}>Max Price Constraint</label>
                    <span className={`text-xs font-bold ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`}>${priceMax}</span>
                  </div>
                  <input
                    id="shop-price-slider-mobile"
                    type="range"
                    min="0"
                    max="300"
                    step="5"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className={`w-full h-1 rounded-lg cursor-pointer accent-indigo-650 ${themeMode === 'light' ? 'bg-slate-220 text-indigo-600' : 'bg-zinc-800 accent-purple-600'}`}
                  />
                </div>

                {/* Colors */}
                <div className="space-y-2">
                  <label className={`text-[10px] tracking-wider uppercase font-bold ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-400'}`}>Color Swatch Filter</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((col) => {
                      const isSel = selectedColor === col.name;
                      return (
                        <button
                          key={col.name}
                          id={`mobile-color-swatch-${col.name}`}
                          onClick={() => setSelectedColor(isSel ? null : col.name)}
                          className={`h-6 w-6 rounded-full border cursor-pointer relative flex items-center justify-center ${
                            isSel 
                              ? (themeMode === 'light' ? 'border-indigo-650 scale-110 ring-2' : 'border-purple-500 scale-110 ring-2')
                              : (themeMode === 'light' ? 'border-slate-300' : 'border-zinc-700')
                          }`}
                          style={{ backgroundColor: col.value }}
                        >
                          {isSel && <span className={`h-2 w-2 rounded-full ${themeMode === 'light' ? 'bg-indigo-600' : 'bg-purple-400'}`} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hardware features */}
                <div className="space-y-2.5">
                  <label className={`text-[10px] tracking-wider uppercase font-bold ${themeMode === 'light' ? 'text-slate-505' : 'text-zinc-400'}`}>Hardware Features</label>
                  <div className="flex flex-col space-y-2.5">
                    {featuresFilterList.map((feat) => {
                      const isChecked = activeFeatures.includes(feat);
                      return (
                        <label key={feat} className="flex items-center gap-2.5 text-xs cursor-pointer">
                          <input
                            id={`mobile-feat-checkbox-${feat}`}
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFeature(feat)}
                            className={`rounded focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer ${
                              themeMode === 'light' ? 'border-slate-300 text-indigo-600' : 'border-zinc-700 bg-zinc-950 text-purple-600'
                            }`}
                          />
                          <span className={`text-[11px] font-medium tracking-wide uppercase ${themeMode === 'light' ? 'text-slate-655' : 'text-zinc-350'}`}>{feat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Close drawer CTA */}
                <button
                  id="mobile-filters-apply-btn"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-650 to-purple-600 hover:from-indigo-550 hover:to-purple-500 text-xs tracking-widest uppercase font-bold text-white rounded-lg transition-all cursor-pointer shadow"
                >
                  Apply Filter Overrides
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
