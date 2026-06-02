import React from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, Award, Eye, Heart, Sparkles, Sprout } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { cms, themeMode } = useApp();
  const about = cms.about;

  const valueIcons = [
    <Award className={`h-5 w-5 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} />,
    <Eye className={`h-5 w-5 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} />,
    <Sprout className={`h-5 w-5 ${themeMode === 'light' ? 'text-indigo-600' : 'text-purple-400'}`} />
  ];

  return (
    <div className={`transition-all duration-350 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'} py-16`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Editorial Title banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className={`text-[10px] tracking-[0.35em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>OUR ORIGIN LOGS</span>
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight uppercase leading-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {about.title}
          </h1>
          <p className={`text-xs sm:text-sm italic ${themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
            "{about.subtitle}"
          </p>
          <div className={`w-12 h-0.5 mx-auto ${themeMode === 'light' ? 'bg-indigo-600' : 'bg-purple-500'}`} />
        </div>

        {/* Double Column content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual card */}
          <div className="lg:col-span-5 relative">
            <div className={`relative aspect-square overflow-hidden rounded-xl border shadow-2xl ${
              themeMode === 'light' ? 'border-slate-200 bg-slate-50 shadow-indigo-150/20' : 'border-neutral-800 bg-neutral-900'
            }`}>
              <img 
                src={about.storyImage} 
                alt="Elyvate Journey" 
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className={`absolute bottom-6 left-6 p-4 rounded-lg border max-w-xs backdrop-blur-md ${
                themeMode === 'light' ? 'bg-white/90 border-slate-200/80 shadow-md' : 'bg-zinc-950/80 border-neutral-850'
              }`}>
                <span className={`text-[9px] tracking-widest font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>ASTRONOMICAL GLASS REFRACTS</span>
                <p className={`text-[10px] leading-normal mt-1 ${themeMode === 'light' ? 'text-slate-700 font-medium' : 'text-zinc-300'}`}>Certified Class 1 laser diffractions with zero shadow halo bounds.</p>
              </div>
            </div>
          </div>

          {/* Texts details column */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className={`text-lg font-black uppercase tracking-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>CRAFTING SPATIAL CONSTELLATIONS</h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${themeMode === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
              {about.content}
            </p>

            {/* Strategic blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className={`space-y-4 p-5 border rounded-xl transition-all duration-300 ${
                themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-100/5' : 'bg-zinc-900 border-neutral-805'
              }`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`h-4.5 w-4.5 ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`} />
                  <span className={`text-[11px] font-black tracking-widest uppercase ${themeMode === 'light' ? 'text-slate-805' : 'text-white'}`}>OUR MISSION DIRECTIVE</span>
                </div>
                <p className={`text-[11px] leading-relaxed ${themeMode === 'light' ? 'text-slate-500 font-normal' : 'text-zinc-400'}`}>{about.mission}</p>
              </div>

              <div className={`space-y-4 p-5 border rounded-xl transition-all duration-300 ${
                themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-100/5' : 'bg-zinc-900 border-neutral-805'
              }`}>
                <div className="flex items-center gap-2">
                  <Sparkles className={`h-4.5 w-4.5 ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`} />
                  <span className={`text-[11px] font-black tracking-widest uppercase ${themeMode === 'light' ? 'text-slate-805' : 'text-white'}`}>OUR STRATEGIC VISION</span>
                </div>
                <p className={`text-[11px] leading-relaxed ${themeMode === 'light' ? 'text-slate-500 font-normal' : 'text-zinc-400'}`}>{about.vision}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic CMS Stats Counter Rails */}
        {about.stats && about.stats.length > 0 && (
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 py-10 border-t border-b text-center w-full p-4.5 rounded-xl ${
            themeMode === 'light' ? 'border-slate-150 bg-white shadow-sm' : 'border-neutral-900 bg-neutral-900/40'
          }`}>
            {about.stats.map((stat, i) => (
              <div key={i} className="space-y-1.5 p-3">
                <p className={`text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r tracking-tight ${
                  themeMode === 'light' ? 'from-indigo-650 to-purple-600' : 'from-purple-400 to-indigo-305'
                }`}>{stat.value}</p>
                <h4 className={`text-[10px] tracking-widest font-black uppercase ${themeMode === 'light' ? 'text-slate-450' : 'text-zinc-500'}`}>{stat.label}</h4>
              </div>
            ))}
          </div>
        )}

        {/* Company Core Values */}
        <div className="space-y-8 text-center">
          <h3 className={`text-xs font-black tracking-widest uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>THE VALUES THAT ANCHOR US</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { t: 'OPTICAL AUTHENTICITY', d: 'No plastic filters. Ground multi-coated glass ensures laser points remain clinically round and deep colors stay saturated.' },
              { t: 'CUSTOMER INTEGRITY', d: 'Backing our engineering with direct 2-Year premium replacement warranties. Support lines are aligned round-the-clock.' },
              { t: 'MINIMALIST SUSTAINABILITY', d: 'Reducing excessive device footprints. We design space gear that blends beautifully as standard decorative sculpture when off.' }
            ].map((v, i) => (
              <div key={i} className={`border p-6 rounded-xl text-center space-y-3.5 transition-all ${
                themeMode === 'light' ? 'border-slate-150 bg-white shadow-md' : 'border-neutral-850 bg-zinc-900/40'
              }`}>
                <div className={`inline-flex p-3 rounded-full border items-center justify-center mb-1 ${
                  themeMode === 'light' ? 'bg-slate-50 border-slate-150' : 'bg-neutral-950/20 border-neutral-800'
                }`}>
                  {valueIcons[i % 3]}
                </div>
                <h4 className={`text-[11px] font-black uppercase tracking-wider ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>{v.t}</h4>
                <p className={`text-[11px] leading-relaxed ${themeMode === 'light' ? 'text-slate-500 font-normal' : 'text-zinc-400'}`}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
