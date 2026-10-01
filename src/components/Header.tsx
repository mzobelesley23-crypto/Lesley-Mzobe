import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  MapPin, 
  ChevronDown, 
  ShieldCheck, 
  Store, 
  Bike, 
  BarChart3, 
  X,
  SlidersHorizontal,
  Package
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SA_HUBS, CATEGORIES_LIST } from '../data/catalogue';

export const Header: React.FC = () => {
  const { 
    cartCount, 
    wishlist, 
    currentView, 
    setView, 
    selectedHub, 
    setSelectedHub, 
    filters, 
    setFilters,
    demoMode,
    orders,
    runnerSubmissions
  } = useMarketplace();

  const pendingApprovalsCount = runnerSubmissions ? runnerSubmissions.filter(s => s.status === 'pending').length : 0;

  const [searchVal, setSearchVal] = useState(filters.searchQuery);
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [showHubMenu, setShowHubMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, searchQuery: searchVal }));
    if (currentView !== 'shop') {
      setView('shop');
    }
  };

  const clearSearch = () => {
    setSearchVal('');
    setFilters(prev => ({ ...prev, searchQuery: '' }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      {/* Top Utility Announcement Bar */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Gauteng Express
            </span>
            <span className="hidden sm:inline text-neutral-500">·</span>
            <span className="hidden sm:inline text-neutral-400">
              Free delivery on orders over R 500 across Johannesburg & Pretoria
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            {/* Delivery Hub Location Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowHubMenu(!showHubMenu)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Delivering to:</span>
                <span className="text-neutral-200 font-medium">{selectedHub.split('&')[0]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showHubMenu && (
                <div 
                  className="absolute right-0 mt-1 w-64 bg-white text-neutral-800 rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 text-xs"
                  onMouseLeave={() => setShowHubMenu(false)}
                >
                  <div className="px-3 py-1 font-semibold text-neutral-500 border-b border-neutral-100">
                    Select Your Delivery Suburb
                  </div>
                  {SA_HUBS.map(hub => (
                    <button
                      key={hub}
                      onClick={() => {
                        setSelectedHub(hub);
                        setShowHubMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-neutral-100 transition-colors flex items-center justify-between ${selectedHub === hub ? 'font-semibold text-neutral-950 bg-neutral-50' : 'text-neutral-700'}`}
                    >
                      <span>{hub}</span>
                      {selectedHub === hub && <span className="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-neutral-600">·</span>

            {/* Operations & Analytics Center */}
            <button 
              onClick={() => setView('admin-portal')}
              className="text-xs text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
              title="Operations & Analytics Center"
            >
              <BarChart3 className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Operations & Analytics</span>
              {pendingApprovalsCount > 0 && (
                <span className="bg-amber-500 text-neutral-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row — 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                setView('shop');
                setFilters(prev => ({ ...prev, category: 'all', searchQuery: '' }));
              }} 
              className="text-left cursor-pointer group"
            >
              <div className="text-2xl font-bold tracking-tight text-neutral-950 font-display flex items-baseline">
                Jozi<span className="text-amber-600">Cart</span>
              </div>
            </button>
          </div>

          {/* Zone 2: Search input for high-intent shopping discovery */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search sneakers, tech, streetwear, skincare, home..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-neutral-100 hover:bg-neutral-50 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-500 rounded-lg pl-10 pr-10 py-2 border border-transparent focus:border-neutral-300 focus:outline-none transition-colors"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchVal && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

          {/* Zone 3: Primary Actions (Saved, Orders, Cart, Account/Portals) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Orders / Tracking quick button */}
            {orders.length > 0 && (
              <button
                onClick={() => setView('order-tracking')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${currentView === 'order-tracking' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
                title="Track Active Orders"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Track Orders</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'all' }));
                setView('shop');
              }}
              className="relative p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-amber-600 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setView('cart')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${cartCount > 0 ? 'bg-neutral-950 text-white hover:bg-neutral-800' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-neutral-950 text-xs font-bold px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Portal Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPortalMenu(!showPortalMenu)}
                className="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Account & Portal Management"
              >
                <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center">
                  JC
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {showPortalMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 text-xs"
                  onMouseLeave={() => setShowPortalMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <p className="font-semibold text-neutral-900">JoziCart Ecosystem</p>
                    <p className="text-neutral-500 text-[11px]">Johannesburg Marketplace</p>
                  </div>

                  <button
                    onClick={() => {
                      setView('shop');
                      setShowPortalMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-neutral-50 transition-colors ${currentView === 'shop' ? 'font-semibold text-neutral-950' : 'text-neutral-700'}`}
                  >
                    <ShoppingBag className="w-4 h-4 text-neutral-500" />
                    <span>Customer Marketplace</span>
                  </button>

                  <button
                    onClick={() => {
                      setView('seller-portal');
                      setShowPortalMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-neutral-50 transition-colors ${currentView === 'seller-portal' ? 'font-semibold text-neutral-950' : 'text-neutral-700'}`}
                  >
                    <Store className="w-4 h-4 text-neutral-500" />
                    <span>Merchant / Seller Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      setView('runner-portal');
                      setShowPortalMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-neutral-50 transition-colors ${currentView === 'runner-portal' ? 'font-semibold text-neutral-950' : 'text-neutral-700'}`}
                  >
                    <Bike className="w-4 h-4 text-neutral-500" />
                    <span>Runner Fulfilment Layer</span>
                  </button>

                  <div className="border-t border-neutral-100 my-1"></div>

                  <button
                    onClick={() => {
                      setView('admin-portal');
                      setShowPortalMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-neutral-50 transition-colors ${currentView === 'admin-portal' ? 'font-semibold text-neutral-950' : 'text-neutral-700'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-neutral-500" />
                      <span>Admin & Approvals Desk</span>
                    </div>
                    {pendingApprovalsCount > 0 && (
                      <span className="bg-amber-500 text-neutral-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                        {pendingApprovalsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setView('runner-info');
                      setShowPortalMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-neutral-400" />
                    <span>Deliver with JoziCart</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products in Jozi..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-neutral-100 text-sm text-neutral-900 placeholder:text-neutral-500 rounded-lg pl-9 pr-9 py-2 border border-transparent focus:border-neutral-300 focus:outline-none"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchVal && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-t border-neutral-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 text-xs font-medium text-neutral-600">
            {CATEGORIES_LIST.map(cat => {
              const isActive = filters.category === cat.id && !filters.onSaleOnly;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category: cat.id as any, onSaleOnly: false }));
                    if (currentView !== 'shop') setView('shop');
                  }}
                  className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${isActive ? 'text-neutral-950 font-bold border-b-2 border-neutral-950' : 'hover:text-neutral-950'}`}
                >
                  {cat.label}
                </button>
              );
            })}

            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, onSaleOnly: !prev.onSaleOnly }));
                if (currentView !== 'shop') setView('shop');
              }}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer flex items-center gap-1 ${filters.onSaleOnly ? 'text-rose-600 font-bold border-b-2 border-rose-600' : 'text-rose-600 hover:text-rose-700'}`}
            >
              <span>Deals & Offers</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
