import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ArrowRight, Star, Truck, RotateCcw, ShieldCheck, Lock, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

export const CustomerHome: React.FC = () => {
  const { cms, products, setCustomerTab, setSelectedProductSlug, themeMode } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const hero = cms.hero;
  const bestSellers = products.filter(p => p.isBestSeller && p.status === 'active').slice(0, 4);

  const faqs = [
    {
      q: 'ARE ELYVATE LASER ARRAYS SAFE FOR HUMAN EYES?',
      a: 'Yes, absolutely. Our laser projectors utilize premium certified Class 1 diffracted light grids. The laser shines as a wider pattern of tiny safe points, safe for pets and children. We do however suggest avoiding inspecting the projection lens directly while fully active.'
    },
    {
      q: 'HOW DO I CONTROL MY GALAXY LIGHT MODES?',
      a: 'Every ELYVATE projector comes packed with a tactile wireless remote and physical chassis buttons. Our newer smart models like Elyvate Nova further support wireless app connections to select hex-color schemes directly from your smartphone.'
    },
    {
      q: 'WHAT DOES THE 2-YEAR PREMIUM GUARANTEE SECURE?',
      a: 'We pride ourselves in Dyson-tier manufacturing. If any mechanical stepper engine, LED laser array, or remote adapter develops a fault within 24 months, contact support and we will ship an instant brand new replacement unit free of charge.'
    },
    {
      q: 'DO YOU PROVIDE FREE WORLDWIDE SHIPPING?',
      a: 'Yes! We provide Free Standard Insured Shipping worldwide on all orders over $50. No special coupon code necessary; free shipping automatically gets applied in your cart during checkout.'
    }
  ];

  const handleProductClick = (slug: string) => {
    setSelectedProductSlug(slug);
    setCustomerTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCta = () => {
    setCustomerTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`transition-all duration-300 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center px-4 sm:px-6 lg:px-8 py-16">
        {/* Background Lights */}
        <div className="absolute inset-0 select-none pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] bg-indigo-500/20 blur-[130px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors ${
              themeMode === 'light' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-indigo-950/40 text-indigo-400 border-indigo-500/20'
            }`}>
              <Sparkles className="h-3 w-3" />
              <span>Premium Space Projectors</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] uppercase ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              {hero.title.slice(0, hero.title.lastIndexOf(' '))} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                themeMode === 'light' ? 'from-indigo-600 to-purple-500' : 'from-indigo-400 to-purple-300'
              }`}>{hero.title.split(' ').pop()}</span>
            </h1>

            <p className={`text-sm sm:text-base max-w-xl leading-relaxed ${
              themeMode === 'light' ? 'text-slate-550' : 'text-zinc-400'
            }`}>
              {hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                id="hero-cta-btn"
                onClick={handleCta}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-650 to-purple-600 font-extrabold text-white text-xs tracking-widest rounded-lg hover:from-indigo-550 hover:to-purple-500 flex items-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer uppercase transition-all duration-305 transform hover:-translate-y-0.5"
              >
                <span>{hero.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                id="hero-secondary-btn"
                onClick={() => {
                  setCustomerTab('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-8 py-3.5 font-extrabold text-xs tracking-widest rounded-lg border cursor-pointer uppercase transition-all ${
                  themeMode === 'light' ? 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50' : 'bg-zinc-900 text-neutral-300 border-neutral-800 hover:bg-zinc-800'
                }`}
              >
                OUR LAUNCH STORY
              </button>
            </div>
          </div>

          {/* Hero Graphical Mockup Right */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] relative">
              
              {/* Outer Neon Glow */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/25 animate-ping opacity-75" />
              <div className="absolute -inset-4 bg-purple-500/10 blur-[40px] rounded-full" />
              
              {/* Luxury product base platform */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-14 bg-zinc-900 rounded-[50%] blur-md opacity-90 border-t border-zinc-700/30" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-zinc-950 rounded-[50%] border border-zinc-800" />
              
              {/* Premium Floating Base Projector Block */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center p-6"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              >
                <div className="relative w-full h-full rounded-full bg-zinc-900 border border-neutral-800 flex items-center justify-center p-4 shadow-2xl">
                  {/* Outer lens representation */}
                  <div className="w-[85%] h-[85%] rounded-full bg-black/80 flex items-center justify-center relative border border-neutral-800">
                    <div className="absolute inset-2 rounded-full border border-purple-500/30" />
                    
                    {/* Glowing blue projector eye */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-800 via-indigo-600 to-cyan-500 flex items-center justify-center relative shadow-inner animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-cyan-400/20 blur-md absolute" />
                      <div className="w-7 h-7 rounded-full bg-black/60 border border-cyan-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400" />
                      </div>
                    </div>

                    <div className="absolute bottom-6 flex items-center space-x-2">
                      <span className="h-1 w-1 bg-green-500 rounded-full animate-ping" />
                      <span className="text-[7px] text-zinc-500 tracking-widest uppercase font-mono font-bold select-none">SYSTEM INJECTED</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. BENEFITS SECTION (RAIL) */}
      <section className={`border-t border-b transition-colors duration-200 ${
        themeMode === 'light' ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-900/30 border-slate-800/85 shadow-inner'
      } py-12 px-4`}>
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {cms.benefits.map((benefit, i) => {
            const icons = [
              <Truck className={`h-5 w-5 mx-auto ${themeMode === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />, 
              <RotateCcw className={`h-5 w-5 mx-auto ${themeMode === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />, 
              <ShieldCheck className={`h-5 w-5 mx-auto ${themeMode === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />, 
              <Lock className={`h-5 w-5 mx-auto ${themeMode === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} />
            ];
            return (
              <div key={i} className="space-y-2 p-4">
                <div className="mb-3">{icons[i % 4]}</div>
                <h3 className={`text-xs font-black tracking-widest uppercase ${themeMode === 'light' ? 'text-slate-800' : 'text-neutral-300'}`}>{benefit.title}</h3>
                <p className={`text-[11px] ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-500'}`}>{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS (CATALOG BENTO) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className={`text-[10px] tracking-[0.35em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400'}`}>HANDPICKED CURATIONS</span>
          <h2 className={`text-3xl font-extrabold tracking-tight uppercase ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>OUR COSMIC CATEGORIES</h2>
          <div className="w-12 h-0.5 bg-indigo-600 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { tag: 'Projectors', title: 'Galaxy Projectors', subtitle: 'Stellar nebula generators', desc: 'Craft beautiful night constellations anywhere.', img: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop' },
            { tag: 'Home Decor', title: 'Home Decor', subtitle: 'Clocks, lamps, textiles', desc: 'Elevate every corner of your living space.', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop' },
            { tag: 'Electronics', title: 'Electronics', subtitle: 'Chargers, speakers, LED strips', desc: 'Smart gadgets for the modern home.', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop' }
          ].map((cat, idx) => (
            <div 
              key={idx}
              className={`group relative h-96 overflow-hidden rounded-xl border cursor-pointer transition-all duration-300 ${
                themeMode === 'light' ? 'border-slate-200/60 bg-white shadow-lg' : 'border-neutral-800 bg-neutral-900'
              }`}
              onClick={() => {
                localStorage.setItem('ely_active_category', cat.tag);
                setCustomerTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img 
                src={cat.img} 
                alt={cat.title} 
                className="absolute inset-0 h-full w-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 z-10">
                <span className="text-[9px] tracking-widest font-extrabold text-neutral-300 uppercase">{cat.subtitle}</span>
                <h3 className="text-lg font-black text-white uppercase">{cat.title}</h3>
                <p className="text-[11px] leading-relaxed text-zinc-350">{cat.desc}</p>
                <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 tracking-wider uppercase group-hover:text-indigo-305">
                  <span>Explore Collection</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS SECTION */}
      <section className={`transition-all duration-300 ${themeMode === 'light' ? 'bg-white border-t border-b border-indigo-50/50 shadow-sm' : 'bg-slate-900/10'} py-20 px-4`}>
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center space-y-3">
            <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400'}`}>PROVEN FAVOURITES</span>
            <h2 className={`text-3xl font-extrabold tracking-tight uppercase ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>INTERSTELLAR BEST SELLERS</h2>
            <div className="w-12 h-0.5 bg-indigo-650 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <div 
                key={product.id}
                id={`product-card-${product.id}`}
                onClick={() => handleProductClick(product.slug)}
                className={`group border rounded-xl p-4 cursor-pointer transition duration-300 flex flex-col justify-between ${
                  themeMode === 'light' ? 'bg-slate-50/50 border-slate-100 hover:border-slate-300 shadow-md hover:shadow-lg' : 'bg-zinc-900/80 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className={`relative aspect-square overflow-hidden rounded-lg mb-4 ${themeMode === 'light' ? 'bg-slate-100' : 'bg-neutral-950'}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover origin-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-indigo-600 text-[8px] font-black tracking-widest px-2.5 py-1 rounded text-white uppercase">
                      BEST SELLER
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                    <span className={`text-[9px] font-semibold ml-1 ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>({product.rating})</span>
                  </div>

                  <h3 className={`text-sm font-bold uppercase tracking-tight transition-colors ${
                    themeMode === 'light' ? 'text-slate-900 group-hover:text-indigo-650' : 'text-white group-hover:text-indigo-400'
                  }`}>
                    {product.name}
                  </h3>
                  <p className={`text-[11px] leading-tight mt-1 line-clamp-2 ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`}>
                    {product.shortDescription}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between ${themeMode === 'light' ? 'border-slate-200/60' : 'border-neutral-800/60'}`}>
                  <div>
                    {product.salePrice ? (
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-black ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>${product.salePrice}</span>
                        <span className="text-zinc-500 text-[10px] line-through">${product.price}</span>
                      </div>
                    ) : (
                      <span className={`text-xs font-black ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>${product.price}</span>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                    themeMode === 'light' ? 'text-indigo-650 group-hover:text-indigo-700' : 'text-indigo-450 group-hover:text-indigo-305'
                  }`}>
                    <span>VIEW DETAILS</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS / CUSTOMER FEEDBACK */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400'}`}>UNBIASED EXPERIENCES</span>
          <h2 className={`text-3xl font-extrabold tracking-tight uppercase ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>TESTIMONIALS FROM SPACE REACHERS</h2>
          <div className="w-12 h-0.5 bg-indigo-650 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah K.', role: 'Visual Creator', comment: 'Absolutely spectacular projection quality! I’ve tried other cheap star globes, but nothing beats Elyvate’s clarity. It feels like I am looking into a live Hubble telescope feed.', rating: 5 },
            { name: 'Marcus T.', role: 'Avid Tech Gamer', comment: 'The perfect ambient light for our music room and gaming setup. Solid build, high fidelity bluetooth sound, and transitions are beautifully fluid. Worth every single dollar!', rating: 5 },
            { name: 'Aria C.', role: 'Interior Designer', comment: 'I incorporate Elyvate projectors inside all our premium chillout commercial layouts. The lighting density combined with whisper quiet motor action creates pure modern zen tranquility.', rating: 5 }
          ].map((fb, i) => (
            <div key={i} className={`border p-6 rounded-xl flex flex-col justify-between transition-all duration-300 ${
              themeMode === 'light' ? 'bg-white border-slate-150 shadow-md' : 'bg-zinc-900 border-neutral-800'
            }`}>
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(fb.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <p className={`text-xs italic leading-relaxed ${themeMode === 'light' ? 'text-slate-600' : 'text-zinc-300'}`}>
                  "{fb.comment}"
                </p>
              </div>
              <div className={`mt-6 pt-4 border-t flex items-center gap-2.5 ${themeMode === 'light' ? 'border-slate-100' : 'border-neutral-800/40'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs text-center uppercase border ${
                  themeMode === 'light' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-950/40 border-indigo-800 text-indigo-300'
                }`}>
                  {fb.name[0]}
                </div>
                <div>
                  <h4 className={`text-xs font-black ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>{fb.name}</h4>
                  <span className={`text-[9px] tracking-widest uppercase ${themeMode === 'light' ? 'text-slate-400' : 'text-zinc-500'}`}>{fb.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ ACCORDIONS */}
      <section className={`transition-colors duration-250 ${themeMode === 'light' ? 'bg-white border-t border-b border-indigo-50/50 shadow-sm' : 'bg-slate-900/10'} py-20 px-4`}>
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="text-center space-y-3">
            <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400'}`}>FAQS ANSWERED</span>
            <h2 className={`text-3xl font-extrabold tracking-tight uppercase ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>CELESTIAL QUESTIONS</h2>
            <div className="w-12 h-0.5 bg-indigo-650 mx-auto" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i} 
                  className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                    themeMode === 'light' ? 'bg-slate-50 border-slate-150' : 'bg-zinc-900 border-neutral-800'
                  }`}
                >
                  <button
                    id={`faq-toggle-${i}`}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-4 bg-transparent outline-none cursor-pointer"
                  >
                    <span className={`text-xs font-bold tracking-wider text-left uppercase ${themeMode === 'light' ? 'text-slate-800' : 'text-white'}`}>{faq.q}</span>
                    {isOpen ? <ChevronUp className={`h-4 w-4 ${themeMode === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} /> : <ChevronDown className={`h-4 w-4 ${themeMode === 'light' ? 'text-indigo-650' : 'text-indigo-400'}`} />}
                  </button>
                  
                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`px-4 pb-4 text-[11px] leading-relaxed border-t pt-2 ${
                        themeMode === 'light' ? 'bg-white text-slate-600 border-slate-100' : 'bg-zinc-950/20 text-zinc-400 border-neutral-800/40'
                      }`}
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
