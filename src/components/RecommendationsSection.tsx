import React from 'react';
import { 
  Sparkles, 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  Plus, 
  Heart 
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

export const RecommendationsSection: React.FC = () => {
  const { 
    personalizedRecommendations, 
    recentlyViewedProducts, 
    setActiveProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    clearBrowsingHistory,
    browsingHistory
  } = useMarketplace();

  if (personalizedRecommendations.length === 0 && recentlyViewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-neutral-200/80 bg-neutral-100/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Section 1: Personalized Recommendations */}
        {personalizedRecommendations.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Personalized Discovery</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
                  Recommended for You
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Dynamic suggestions tailored from your browsing patterns, local hub affinity, and popular Johannesburg picks.
                </p>
              </div>

              {browsingHistory.length > 0 && (
                <button
                  onClick={clearBrowsingHistory}
                  className="text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer w-fit"
                  title="Reset personalization profile"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Recommendations</span>
                </button>
              )}
            </div>

            {/* Recommendation Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {personalizedRecommendations.map(({ product, reason }) => (
                <div key={product.id} className="flex flex-col">
                  {/* Subtle Reason Kicker (Zero-Pill compliant quiet label) */}
                  <div className="text-[10px] text-amber-800 font-medium mb-1.5 flex items-center gap-1 truncate px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="truncate">{reason.label}</span>
                  </div>

                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Recently Viewed Products Tray */}
        {recentlyViewedProducts.length > 0 && (
          <div className="pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-600" />
                <h3 className="text-sm font-bold text-neutral-950 font-display uppercase tracking-wider">
                  Recently Viewed ({recentlyViewedProducts.length})
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400">
                Stored privately in your browser session
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
              {recentlyViewedProducts.map((product) => {
                const isSaved = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => setActiveProduct(product)}
                    className="w-44 sm:w-48 bg-white border border-neutral-200 rounded-xl p-2.5 shrink-0 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-neutral-100 mb-2">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] text-neutral-500 truncate">
                        {product.seller.name}
                      </p>
                      <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-xs font-bold text-neutral-950 mt-1">
                        R {product.price.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="mt-2 w-full py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
