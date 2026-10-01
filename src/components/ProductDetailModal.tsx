import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  MapPin, 
  Star, 
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    activeProduct, 
    setActiveProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setView, 
    products, 
    getCustomersAlsoViewed 
  } = useMarketplace();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Sync variants and reset image/quantity when activeProduct changes
  React.useEffect(() => {
    if (activeProduct?.variants) {
      const initial: Record<string, string> = {};
      activeProduct.variants.forEach(v => {
        initial[v.name] = v.options[0];
      });
      setSelectedVariants(initial);
    } else {
      setSelectedVariants({});
    }
    setActiveImageIndex(0);
    setQuantity(1);
  }, [activeProduct]);

  if (!activeProduct) return null;

  const isSaved = isInWishlist(activeProduct.id);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity, selectedVariants);
  };

  const handleBuyNow = () => {
    addToCart(activeProduct, quantity, selectedVariants);
    setActiveProduct(null);
    setView('checkout');
  };

  // Dynamically calculated recommendations for this product
  const customersAlsoViewed = getCustomersAlsoViewed(activeProduct, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Dismiss Button */}
        <button
          onClick={() => setActiveProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-neutral-950 bg-white/90 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer border border-neutral-200/80 shadow-xs"
          title="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-neutral-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200">
            <div className="space-y-4">
              {/* Primary Main Image */}
              <div className="relative aspect-square w-full bg-white rounded-xl overflow-hidden border border-neutral-200/80 shadow-xs group">
                <img 
                  src={activeProduct.images[activeImageIndex] || activeProduct.images[0]} 
                  alt={activeProduct.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />

                {activeProduct.discountPercent && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{activeProduct.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails if multiple images */}
              {activeProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {activeProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${activeImageIndex === idx ? 'border-neutral-950 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Merchant / Seller Card */}
            <div className="mt-6 pt-4 border-t border-neutral-200 bg-white p-3.5 rounded-xl border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <span>Sold & Dispatched by</span>
                    {activeProduct.seller.verified && (
                      <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 mt-0.5">
                    {activeProduct.seller.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{activeProduct.seller.hub}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-neutral-900 flex items-center gap-1 justify-end">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{activeProduct.seller.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    {activeProduct.seller.ordersFulfilled} fulfilled
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Buying Options & Details */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1.5">
                <span className="uppercase tracking-wider font-semibold text-amber-700">
                  {activeProduct.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>Fulfilled by JoziCart</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display leading-tight mb-2">
                {activeProduct.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display">
                  R {activeProduct.price.toLocaleString()}
                </span>
                {activeProduct.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through">
                    R {activeProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  VAT Included
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5">
                {activeProduct.description}
              </p>

              {/* Variants Selector */}
              {activeProduct.variants && activeProduct.variants.length > 0 && (
                <div className="space-y-4 mb-5 border-t border-neutral-100 pt-4">
                  {activeProduct.variants.map((v) => (
                    <div key={v.name}>
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-900 mb-2">
                        <span>{v.name}:</span>
                        <span className="font-normal text-neutral-500">
                          {selectedVariants[v.name] || v.options[0]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {v.options.map((opt) => {
                          const isSelected = selectedVariants[v.name] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleVariantSelect(v.name, opt)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${isSelected ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs' : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper & Stock */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-neutral-900 block mb-1.5">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(activeProduct.stockCount, q + 1))}
                      className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-medium text-emerald-700 flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {activeProduct.stockCount} units available
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Fast dispatch from local hub
                  </span>
                </div>
              </div>

              {/* Delivery Estimation Box */}
              <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/80 mb-6 space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-900">
                      Gauteng Delivery Available
                    </span>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Order within 3 hrs for delivery tomorrow via JoziCart Runner Network.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pt-2 border-t border-neutral-200/60">
                  <RotateCcw className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-neutral-900">
                      7-Day Easy Returns
                    </span>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Compliant with SA Consumer Protection Act. Hassle-free exchanges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action CTAs */}
            <div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-950 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleWishlist(activeProduct.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                  title={isSaved ? 'Saved to wishlist' : 'Save for later'}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Product Specifications */}
              {activeProduct.specs && (
                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                    Product Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(activeProduct.specs).map(([key, val]) => (
                      <div key={key} className="bg-neutral-50 p-2 rounded border border-neutral-100">
                        <span className="text-neutral-400 block text-[10px]">{key}</span>
                        <span className="font-medium text-neutral-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers Also Viewed & Paired Items (Recommendation Engine) */}
              {customersAlsoViewed.length > 0 && (
                <div className="mt-6 pt-5 border-t border-neutral-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Customers Also Viewed</span>
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        Dynamically matched with this item
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {customersAlsoViewed.map(({ product: recProd, reason }) => (
                      <div
                        key={recProd.id}
                        onClick={() => {
                          setActiveProduct(recProd);
                          setActiveImageIndex(0);
                          setQuantity(1);
                        }}
                        className="p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200/80 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={recProd.images[0]}
                            alt={recProd.title}
                            className="w-12 h-12 object-cover rounded-lg border border-neutral-200 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] text-amber-800 font-medium block truncate">
                              {reason.label}
                            </span>
                            <h5 className="text-xs font-semibold text-neutral-900 truncate group-hover:text-amber-700 transition-colors">
                              {recProd.title}
                            </h5>
                            <span className="text-xs font-bold text-neutral-950">
                              R {recProd.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(recProd, 1);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-neutral-200 hover:bg-neutral-950 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                            title="Add to cart"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
