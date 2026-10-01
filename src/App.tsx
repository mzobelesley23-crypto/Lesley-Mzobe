import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { RecommendationsSection } from './components/RecommendationsSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { SellerPortal } from './components/SellerPortal';
import { RunnerPortal } from './components/RunnerPortal';
import { OperationsAnalyticsModal } from './components/OperationsAnalyticsModal';
import { RunnerInfoModal } from './components/RunnerInfoModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const MarketplaceContent: React.FC = () => {
  const { currentView } = useMarketplace();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Header />

      <main className="flex-1">
        {currentView === 'shop' && (
          <>
            <HeroBanner />
            <ProductGrid />
            <RecommendationsSection />
          </>
        )}

        {currentView === 'order-tracking' && <OrderTrackingView />}
        {currentView === 'seller-portal' && <SellerPortal />}
        {currentView === 'runner-portal' && <RunnerPortal />}
        {currentView === 'admin-portal' && <OperationsAnalyticsModal />}
        {currentView === 'runner-info' && <RunnerInfoModal />}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <ToastContainer />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
}
