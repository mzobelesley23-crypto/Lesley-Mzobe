import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  Truck,
  ShieldCheck
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    updateCartQuantity, 
    removeFromCart, 
    setView,
    currentView,
    addToast
  } = useMarketplace();

  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  if (currentView !== 'cart') return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'JOZI10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discount);
      setPromoMessage('10% Welcome Discount applied!');
      addToast('Promo code JOZI10 applied (10% off)', 'success');
    } else if (code === 'GAUTENG') {
      setAppliedDiscount(50);
      setPromoMessage('R50 Gauteng community voucher applied!');
      addToast('Voucher GAUTENG applied (R50 off)', 'success');
    } else {
      setPromoMessage('Invalid voucher code. Try JOZI10');
      addToast('Invalid promo code', 'error');
    }
  };

  const deliveryFee = cartSubtotal >= 500 ? 0 : 60;
  const grandTotal = Math.max(0, cartSubtotal + deliveryFee - appliedDiscount);
  const freeDeliveryShortfall = 500 - cartSubtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="text-lg font-bold text-neutral-950 font-display">
              Your JoziCart
            </h2>
            <span className="text-xs text-neutral-500 font-medium">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </div>

          <button
            onClick={() => setView('shop')}
            className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            title="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar Progress */}
        <div className="bg-amber-50 px-4 py-2.5 border-b border-amber-100 text-xs">
          {freeDeliveryShortfall > 0 ? (
            <div className="flex items-center gap-2 text-amber-900">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Add <strong>R {freeDeliveryShortfall.toLocaleString()}</strong> more to qualify for <strong>FREE delivery</strong> across Gauteng!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-800 font-medium">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>You've unlocked <strong>FREE Delivery</strong> across Gauteng!</span>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div 
                key={`${item.product.id}-${idx}`}
                className="flex items-start gap-3.5 pb-4 border-b border-neutral-100"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                      {item.product.title}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
                    <span>{item.product.seller.name}</span>
                    {item.selectedVariant && (
                      <>
                        <span className="mx-1">·</span>
                        <span>{Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(', ')}</span>
                      </>
                    )}
                  </div>

                  {/* Quantity & Unit Price */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-neutral-200 rounded bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-neutral-950">
                      R {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-neutral-500 max-w-xs mb-6">
                Discover independent Johannesburg merchants, fresh streetwear, and gadgets.
              </p>
              <button
                onClick={() => setView('shop')}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Promo code (e.g. JOZI10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full bg-white text-xs text-neutral-900 placeholder:text-neutral-400 rounded-lg pl-8 pr-3 py-2 border border-neutral-200 focus:outline-none focus:border-neutral-400 uppercase"
                />
                <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {promoMessage && (
              <p className={`text-[11px] ${appliedDiscount > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {promoMessage}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>R {cartSubtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Delivery (Gauteng)</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `R ${deliveryFee}`}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-R {appliedDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-neutral-200 pt-2 flex justify-between text-sm font-bold text-neutral-950">
                <span>Total (ZAR)</span>
                <span>R {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => setView('checkout')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant EFT, Ozow & Card 3D-Secure Protected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
