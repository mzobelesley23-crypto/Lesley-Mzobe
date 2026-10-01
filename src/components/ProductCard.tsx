import React from 'react';
import { Heart, Plus, Clock, Check } from 'lucide-react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setActiveProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useMarketplace();

  const isSaved = isInWishlist(product.id);

  const handleCardClick = () => {
    setActiveProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first variant if exists
    const defaultVariant: Record<string, string> = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(v => {
        defaultVariant[v.name] = v.options[0];
      });
    }
    addToCart(product, 1, Object.keys(defaultVariant).length > 0 ? defaultVariant : undefined);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white border border-neutral-200/90 rounded-xl overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Top Floating Controls */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          {product.discountPercent ? (
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-tight pointer-events-auto">
              -{product.discountPercent}%
            </span>
          ) : product.badge ? (
            <span className="bg-neutral-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded pointer-events-auto">
              {product.badge}
            </span>
          ) : (
            <div></div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`p-1.5 rounded-full backdrop-blur-sm pointer-events-auto transition-colors cursor-pointer ${isSaved ? 'bg-rose-50 text-rose-600' : 'bg-white/80 hover:bg-white text-neutral-600 hover:text-rose-600'}`}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>

        {/* Quick Add Overlay on Hover for Desktop */}
        <div className="absolute inset-x-2.5 bottom-2.5 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <button
            onClick={handleAddToCart}
            className="w-full py-2 bg-neutral-950/90 hover:bg-neutral-950 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 pointer-events-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill Rule) */}
          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 mb-1 truncate">
            <span className="font-medium text-neutral-700">{product.seller.name}</span>
            <span aria-hidden="true">·</span>
            <span>{product.seller.hub.split(',')[0]}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug mb-1.5 group-hover:text-amber-700 transition-colors">
            {product.title}
          </h3>
        </div>

        <div>
          {/* Price Row */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-neutral-950">
              R {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                R {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Fulfilment & Stock Line */}
          <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <Check className="w-3 h-3" />
              <span>In Stock</span>
            </span>

            <span className="text-neutral-400">
              {product.estimatedDeliveryDays === 1 ? 'Next-Day Delivery' : '2-3 Days'}
            </span>
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="sm:hidden mt-2.5 w-full py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
