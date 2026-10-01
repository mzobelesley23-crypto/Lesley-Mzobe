import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Lock, 
  MapPin, 
  Bike, 
  Store, 
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const Footer: React.FC = () => {
  const { setView, setFilters } = useMarketplace();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 mt-16 text-xs">
      {/* Subtle Runner Secondary Opportunity Section (Per Prompt Specification) */}
      <div className="bg-neutral-950 border-b border-neutral-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">
                Earn with JoziCart
              </h4>
              <p className="text-neutral-400 text-xs">
                Deliver orders in your area and earn from completed deliveries across Gauteng.
              </p>
            </div>
          </div>

          <button
            onClick={() => setView('runner-info')}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer text-xs shrink-0"
          >
            <span>Learn about becoming a Runner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="text-2xl font-bold tracking-tight text-white font-display flex items-baseline mb-2">
              Jozi<span className="text-amber-500">Cart</span>
            </div>
            <p className="text-neutral-400 max-w-sm text-xs leading-relaxed mb-4">
              South Africa's premier online marketplace. Shop independent Johannesburg fashion, streetwear, cutting-edge audio, and local craftsmanship with express Gauteng delivery.
            </p>

            <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Johannesburg, Gauteng, South Africa</span>
            </div>
          </div>

          {/* Col 1: Shop */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Marketplace
            </h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'fashion' })); setView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Streetwear & Fashion
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'sneakers' })); setView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Sneakers & Footwear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'electronics' })); setView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Audio & Electronics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'beauty' })); setView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Skincare & Beauty
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilters(prev => ({ ...prev, category: 'home' })); setView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Home & Ceramics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Customer Care */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Customer Care
            </h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => setView('order-tracking')} className="hover:text-white transition-colors">
                  Track Your Delivery
                </button>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  7-Day CPA Return Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Gauteng Express Coverage
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Instant EFT & Ozow FAQs
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">
                  Buyer Protection Guarantee
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Ecosystem & Portals */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Ecosystem
            </h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button 
                  onClick={() => setView('seller-portal')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Merchant Hub</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setView('runner-portal')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span>Runner Console</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setView('admin-portal')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Operations & Analytics</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setView('runner-info')}
                  className="hover:text-white transition-colors"
                >
                  Runner Network Info
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © 2026 JoziCart (Pty) Ltd. All rights reserved. Johannesburg, South Africa.
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>ZAR Currency (R)</span>
            <span>·</span>
            <span>15% VAT Included</span>
            <span>·</span>
            <span>Consumer Protection Act Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
