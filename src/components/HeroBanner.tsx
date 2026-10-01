import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { heroImg } from '../data/catalogue';

export const HeroBanner: React.FC = () => {
  const { setFilters, setView } = useMarketplace();

  const handleShopNow = (category?: string) => {
    if (category) {
      setFilters(prev => ({ ...prev, category: category as any }));
    }
    setView('shop');
    const catalogEl = document.getElementById('marketplace-catalogue');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Background Image with Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImg} 
          alt="JoziCart Urban Marketplace" 
          className="w-full h-full object-cover object-center opacity-40 brightness-75 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          {/* Subtle quiet kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>South Africa's Online Marketplace</span>
            <span aria-hidden="true">·</span>
            <span>Johannesburg & Gauteng</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1] mb-4">
            Discover more. <br />
            <span className="text-amber-400">Shop Jozi.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6 max-w-xl">
            Everyday essentials, independent streetwear, premium electronics, and local artisanal craft. Shop verified Gauteng merchants with dependable same-day and next-day fulfilment.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              onClick={() => handleShopNow()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, onSaleOnly: true }));
                handleShopNow();
              }}
              className="px-4 py-2.5 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Today's Deals
            </button>
          </div>

          {/* Clean trust indicators without pill capsules */}
          <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-xs text-neutral-400">
            <div>
              <p className="font-semibold text-white">Next-Day Delivery</p>
              <p className="text-[11px] text-neutral-400">Across Greater Johannesburg</p>
            </div>
            <div>
              <p className="font-semibold text-white">Verified Merchants</p>
              <p className="text-[11px] text-neutral-400">Direct from local studios</p>
            </div>
            <div>
              <p className="font-semibold text-white">Guaranteed Returns</p>
              <p className="text-[11px] text-neutral-400">7-Day easy CPA compliance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
