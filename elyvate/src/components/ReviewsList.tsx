import React from 'react';
import { useApp } from '../AppContext';
import { Star, MessageSquareQuote } from 'lucide-react';

export const ReviewsList: React.FC = () => {
  const { reviews, themeMode } = useApp();
  const approved = reviews.filter(r => r.status === 'approved');

  return (
    <div className={`transition-colors duration-200 ${themeMode === 'light' ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'} py-16`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title details */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[10px] tracking-[0.35em] font-extrabold uppercase text-purple-400">STARGAZER SATISFACTION</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase leading-tight">
            TESTIMONIAL LOGS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Uncensored experiences from interior designers, creators, and peaceful dreamers worldwide who upgraded their bedrooms with ELYVATE arrays.
          </p>
          <div className="w-12 h-0.5 bg-purple-500 mx-auto" />
        </div>

        {/* Testimonials List and reviews totals */}
        {approved.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {approved.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-zinc-900 border border-neutral-850 p-6 rounded-xl flex flex-col justify-between hover:border-neutral-750 transition"
              >
                <div className="space-y-4.5">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase font-black">{rev.productName}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < rev.rating ? 'fill-current' : 'text-neutral-850'}`} />
                    ))}
                  </div>

                  <p className="text-zinc-300 text-xs italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/40 flex items-center gap-2.5 bg-zinc-90">
                  <div className="h-8 w-8 rounded-full bg-purple-950/40 border border-purple-800/30 font-bold text-xs flex items-center justify-center text-purple-400">
                    {rev.customerName[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{rev.customerName}</h4>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Verified Operator</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-neutral-850 rounded-xl max-w-sm mx-auto text-zinc-550 border-dashed">
            <MessageSquareQuote className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-xs uppercase font-mono tracking-wider">No customer feedback approved on catalog yet. Check moderation terminal.</p>
          </div>
        )}

      </div>
    </div>
  );
};
