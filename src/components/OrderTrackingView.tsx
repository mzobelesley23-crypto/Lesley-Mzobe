import React from 'react';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Store, 
  Bike, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  KeyRound,
  Phone,
  RefreshCw,
  ShoppingBag,
  Plane,
  Navigation
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { OrderStatus } from '../types';

export const OrderTrackingView: React.FC = () => {
  const { 
    orders, 
    activeOrder, 
    setActiveOrder, 
    setView, 
    advanceOrderStatus,
    updateOrderStatus
  } = useMarketplace();

  const currentOrder = activeOrder || orders[0];

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-neutral-900">No Orders Found</h3>
        <p className="text-xs text-neutral-500 mb-6">
          You haven't placed any orders yet. Discover items on the marketplace to get started.
        </p>
        <button
          onClick={() => setView('shop')}
          className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const isInterprovincial = currentOrder.deliveryType === 'interprovincial_linehaul' || currentOrder.route?.isInterprovincial;

  const currentStepIndex = currentOrder.trackingUpdates.findIndex(step => !step.completed);
  const activeIndex = currentStepIndex === -1 ? currentOrder.trackingUpdates.length - 1 : Math.max(0, currentStepIndex - 1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200">
        <button
          onClick={() => setView('shop')}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        {orders.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500">Viewing order:</span>
            <select
              value={currentOrder.id}
              onChange={(e) => {
                const found = orders.find(o => o.id === e.target.value);
                if (found) setActiveOrder(found);
              }}
              className="bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 rounded-lg px-2.5 py-1"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.id} · R {o.total.toLocaleString()} ({o.status.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Tracking Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-6 space-y-6">
        {/* Route Banner */}
        {isInterprovincial ? (
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-950">
            <div className="flex items-center gap-2.5">
              <Plane className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <strong className="block">
                  Interprovincial Line-Haul Route: {currentOrder.route?.originProvince || 'Gauteng'} → {currentOrder.route?.destinationProvince || currentOrder.customer.province || 'National'}
                </strong>
                <span className="text-[11px] text-amber-900/80">
                  {currentOrder.route?.transitHub || 'Consolidated at domestic cargo terminal for regional airfreight / line-haul delivery'}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase bg-amber-200/60 px-2 py-0.5 rounded text-amber-900 shrink-0">
              National Network
            </span>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-950">
            <div className="flex items-center gap-2.5">
              <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong className="block">
                  Local City Runner Route: {currentOrder.customer.province || 'Gauteng'} ({currentOrder.customer.city})
                </strong>
                <span className="text-[11px] text-emerald-900/80">
                  Direct merchant pickup and doorstep handover by local courier
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-900 shrink-0">
              Local Metro Run
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span>Order Reference:</span>
              <strong className="text-neutral-900 font-mono text-sm">{currentOrder.id}</strong>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
              {currentOrder.status === 'delivered' ? 'Order Delivered' : 'Order in Transit'}
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Estimated Delivery: <strong className="text-neutral-800">{currentOrder.estimatedDeliveryDate}</strong>
            </p>
          </div>

          {/* Handover OTP Pin Box */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 sm:text-right shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium sm:justify-end">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>Delivery Handover PIN</span>
            </div>
            <div className="text-2xl font-mono font-extrabold text-amber-950 tracking-widest mt-0.5">
              {currentOrder.otpCode}
            </div>
            <span className="text-[10px] text-amber-800/80 block mt-0.5">
              Provide this code to your courier upon handover
            </span>
          </div>
        </div>

        {/* Visual Progress Steps */}
        <div className="py-4">
          <div className="space-y-4">
            {currentOrder.trackingUpdates.map((step, idx) => {
              const isDone = step.completed;

              return (
                <div key={idx} className="flex items-start gap-3.5 text-xs">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${isDone ? 'bg-neutral-950 text-white' : 'bg-neutral-100 text-neutral-400 border border-neutral-200'}`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold ${isDone ? 'text-neutral-950' : 'text-neutral-400'}`}>
                        {step.title}
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fulfilment Chain Context */}
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 text-xs">
          <div className="flex items-center gap-2 font-bold text-neutral-900 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fulfilment & Logistics Architecture</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-neutral-600">
            <div>
              <p className="text-[11px] text-neutral-400 uppercase font-semibold">1. Origin Hub</p>
              <p className="font-semibold text-neutral-900 mt-0.5">
                {currentOrder.items[0]?.product.seller.name || 'Verified Merchant'}
              </p>
              <p className="text-[11px] text-neutral-500">
                {currentOrder.items[0]?.product.seller.hub || 'Johannesburg, Gauteng'}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-neutral-400 uppercase font-semibold">
                {isInterprovincial ? '2. Transit Gateway' : '2. Courier Dispatch'}
              </p>
              <p className="font-semibold text-neutral-900 mt-0.5">
                {isInterprovincial 
                  ? 'Airfreight Cargo / Line-Haul' 
                  : (currentOrder.runner ? `${currentOrder.runner.name} (${currentOrder.runner.vehicle})` : 'Courier Assigned')}
              </p>
              <p className="text-[11px] text-neutral-500">
                {isInterprovincial ? 'National interprovincial corridor' : 'Direct local city run'}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-neutral-400 uppercase font-semibold">3. Destination Address</p>
              <p className="font-semibold text-neutral-900 mt-0.5">
                {currentOrder.customer.suburb}, {currentOrder.customer.city}
              </p>
              <p className="text-[11px] text-neutral-500 truncate">
                {currentOrder.customer.street} ({currentOrder.customer.province || 'Gauteng'})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Item Details Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-950 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-neutral-700" />
          <span>Purchased Items ({currentOrder.items.length})</span>
        </h3>

        <div className="space-y-3 divide-y divide-neutral-100">
          {currentOrder.items.map((item, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.title} 
                  className="w-12 h-12 object-cover rounded-lg border border-neutral-200"
                />
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900">
                    {item.product.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Qty: {item.quantity} · {item.product.seller.name} ({item.product.seller.hub})
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-neutral-950">
                R {(item.product.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-100 mt-4 pt-4 flex justify-between items-center text-xs">
          <span className="text-neutral-500">Delivery Route & Fees:</span>
          <span className="font-semibold text-neutral-900">
            {isInterprovincial ? 'Interprovincial Freight' : 'Local Runner'} (R {currentOrder.deliveryFee})
          </span>
        </div>

        <div className="border-t border-neutral-100 mt-2 pt-2 flex justify-between items-center text-sm font-bold text-neutral-950">
          <span>Total Paid:</span>
          <span>R {currentOrder.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

