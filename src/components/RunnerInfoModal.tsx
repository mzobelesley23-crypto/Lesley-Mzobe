import React from 'react';
import { 
  Bike, 
  MapPin, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2,
  Check
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const RunnerInfoModal: React.FC = () => {
  const { setView } = useMarketplace();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => setView('shop')}
        className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shopping</span>
      </button>

      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-2">
            JoziCart Fulfilment Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 font-display">
            Earn with JoziCart
          </h1>
          <p className="text-sm text-neutral-600 mt-2 max-w-2xl leading-relaxed">
            Deliver orders in your area and earn from completed deliveries. JoziCart connects independent Johannesburg merchants with nearby customers through our dedicated runner courier layer.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-100 text-xs">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Competitive Per-Drop Payouts</h3>
            <p className="text-neutral-500 leading-relaxed">
              Earn R45–R65 per completed delivery plus tips and distance bonuses, deposited weekly to any South African bank account.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Local Hub Zones</h3>
            <p className="text-neutral-500 leading-relaxed">
              Operate within familiar Gauteng sectors: Rosebank, Sandton, Braamfontein, Maboneng, Soweto, or Pretoria.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Flexible Scheduling</h3>
            <p className="text-neutral-500 leading-relaxed">
              Go online when you're available. Choose the delivery batches that fit your routine, whether on motorbike, bicycle, or light vehicle.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200/80 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">
            How JoziCart Fulfilment Operates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <div>
                <strong className="text-neutral-900 block">Merchant Packs Item</strong>
                <span className="text-neutral-500">A local store finishes preparing and boxing the customer's purchase.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <div>
                <strong className="text-neutral-900 block">Runner Collects Parcel</strong>
                <span className="text-neutral-500">You accept the pickup via the runner app and collect from the verified store.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <div>
                <strong className="text-neutral-900 block">Handover with OTP</strong>
                <span className="text-neutral-500">Deliver to customer, verify their 4-digit code, and payout is immediately logged.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-neutral-100">
          <div>
            <h4 className="text-xs font-bold text-neutral-900">
              Ready to explore runner fulfilment?
            </h4>
            <p className="text-[11px] text-neutral-500">
              Test the active courier console or switch back to the shopping marketplace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('runner-portal')}
              className="px-4 py-2 bg-neutral-950 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Bike className="w-4 h-4" />
              <span>Launch Runner App Demo</span>
            </button>
            <button
              onClick={() => setView('shop')}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Shop Marketplace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
