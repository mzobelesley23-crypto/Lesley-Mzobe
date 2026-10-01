import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Building2, 
  Banknote, 
  Truck, 
  ArrowRight,
  ArrowLeft,
  Lock,
  Clock,
  Plane,
  Navigation
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CustomerAddress, SouthAfricanProvince } from '../types';
import { SA_PROVINCES } from '../data/catalogue';

export const CheckoutModal: React.FC = () => {
  const { 
    currentView, 
    setView, 
    cart, 
    cartSubtotal, 
    createOrder,
    selectedHub
  } = useMarketplace();

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'instant_eft' | 'card' | 'cod'>('instant_eft');
  const [selectedBank, setSelectedBank] = useState<string>('Capitec Pay');
  const [isProcessing, setIsProcessing] = useState(false);

  const [customer, setCustomer] = useState<CustomerAddress>({
    fullName: 'Lindiwe Moloi',
    email: 'lindiwe.moloi@example.co.za',
    phone: '+27 83 492 8812',
    street: '15 Jan Smuts Avenue',
    suburb: 'Rosebank',
    city: 'Johannesburg',
    province: 'Gauteng',
    postalCode: '2196',
    deliveryNotes: 'Buzz unit 4B or leave with estate security.',
  });

  if (currentView !== 'checkout') return null;

  // Origin province of the primary merchant in cart
  const originProvince: SouthAfricanProvince = cart[0]?.product.seller.province || 'Gauteng';
  const destinationProvince: SouthAfricanProvince = customer.province || 'Gauteng';
  const isInterprovincial = originProvince !== destinationProvince;

  // Interprovincial vs Local pricing
  const deliveryFee = isInterprovincial
    ? (cartSubtotal >= 800 ? 0 : (deliveryMethod === 'express' ? 160 : 110))
    : (cartSubtotal >= 500 ? 0 : (deliveryMethod === 'express' ? 95 : 60));

  const grandTotal = cartSubtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      createOrder(customer, deliveryMethod, paymentMethod, 0);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('cart')}
              className="p-1 text-neutral-500 hover:text-neutral-900 rounded-md transition-colors"
              title="Back to cart"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-neutral-950 font-display">
                JoziCart Express Checkout
              </h2>
              <p className="text-[11px] text-neutral-500">
                Safe & encrypted South African payment processing
              </p>
            </div>
          </div>

          <button
            onClick={() => setView('shop')}
            className="p-1.5 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer"
            title="Cancel checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: South African Delivery Address */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-neutral-950">
                1. South African Delivery Address
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Phone Number (For Handover PIN)</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-600 font-medium mb-1">Street Address / Complex</label>
                <input
                  type="text"
                  required
                  value={customer.street}
                  onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                  placeholder="Street address, building, floor/unit number"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Province (South Africa)</label>
                <select
                  value={customer.province || 'Gauteng'}
                  onChange={(e) => setCustomer({ ...customer, province: e.target.value as SouthAfricanProvince })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 font-medium"
                >
                  {SA_PROVINCES.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Suburb / Area</label>
                <input
                  type="text"
                  required
                  value={customer.suburb}
                  onChange={(e) => setCustomer({ ...customer, suburb: e.target.value })}
                  placeholder="e.g. Rosebank, Kloof St, Umhlanga, Soweto"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">City & Postal Code</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="City / Town"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    placeholder="Postal Code"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={customer.deliveryNotes || ''}
                  onChange={(e) => setCustomer({ ...customer, deliveryNotes: e.target.value })}
                  placeholder="e.g. Leave with reception or call on arrival"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Speed & Routing Option */}
          <div className="border-t border-neutral-200 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-neutral-950">
                2. Fulfilment Route & Logistics
              </h3>
            </div>

            {/* Dynamic Local vs Interprovincial Route Banner */}
            {isInterprovincial ? (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl mb-3 flex items-start gap-2.5 text-xs text-amber-950">
                <Plane className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Interprovincial Route: {originProvince} → {destinationProvince}</span>
                  <span className="text-[11px] text-amber-900/80 leading-relaxed block mt-0.5">
                    Dispatched from {cart[0]?.product.seller.name || 'Merchant'} ({originProvince}) via domestic airfreight line-haul to {destinationProvince} regional hub, with final doorstep delivery in {customer.city} by local courier.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl mb-3 flex items-start gap-2.5 text-xs text-emerald-950">
                <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Local City Runner Fulfillment ({destinationProvince})</span>
                  <span className="text-[11px] text-emerald-900/80 leading-relaxed block mt-0.5">
                    Both merchant and delivery address are located within {destinationProvince}. Direct point-to-point courier dispatch with real-time OTP verification.
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label 
                className={`p-3 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${deliveryMethod === 'express' ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-neutral-900 block">
                      {isInterprovincial ? 'Express Air Cargo (Next Business Day)' : 'Local Runner Express (Same-Day / Next-Day)'}
                    </span>
                    <span className="text-neutral-500 text-[11px] block mt-0.5">
                      {isInterprovincial 
                        ? 'Priority flight departure via domestic cargo terminal.' 
                        : 'Immediate local courier dispatch directly to doorstep.'}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-neutral-950 shrink-0 font-mono">
                  {isInterprovincial 
                    ? (cartSubtotal >= 800 ? 'FREE' : 'R 160') 
                    : (cartSubtotal >= 500 ? 'FREE' : 'R 95')}
                </span>
              </label>

              <label 
                className={`p-3 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${deliveryMethod === 'standard' ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-neutral-900 block">
                      {isInterprovincial ? 'Standard Interprovincial Road Freight' : 'Standard Local Courier'}
                    </span>
                    <span className="text-neutral-500 text-[11px] block mt-0.5">
                      {isInterprovincial 
                        ? 'Delivered within 2 to 3 working days via national route.' 
                        : 'Delivered within 24 to 48 hours.'}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-neutral-950 shrink-0 font-mono">
                  {isInterprovincial 
                    ? (cartSubtotal >= 800 ? 'FREE' : 'R 110') 
                    : (cartSubtotal >= 500 ? 'FREE' : 'R 60')}
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: South African Payment Gateway */}
          <div className="border-t border-neutral-200 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-neutral-950">
                3. South African Payment Method
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Instant EFT / Ozow */}
              <label 
                className={`p-3 rounded-xl border block cursor-pointer transition-colors ${paymentMethod === 'instant_eft' ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'instant_eft'}
                      onChange={() => setPaymentMethod('instant_eft')}
                    />
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-neutral-700" />
                      <span className="font-bold text-neutral-900">Instant EFT (Ozow / Capitec Pay / FNB / Nedbank / Standard Bank)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Instant Clearance
                  </span>
                </div>

                {paymentMethod === 'instant_eft' && (
                  <div className="mt-3 pt-3 border-t border-neutral-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {['Capitec Pay', 'FNB', 'Standard Bank', 'Nedbank', 'ABSA', 'TymeBank'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setSelectedBank(b)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${selectedBank === b ? 'bg-neutral-950 text-white' : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </label>

              {/* Debit/Credit Card */}
              <label 
                className={`p-3 rounded-xl border block cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-neutral-700" />
                      <span className="font-bold text-neutral-900">Debit or Credit Card (Visa / Mastercard)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    3D Secure OTP
                  </span>
                </div>
              </label>

              {/* Cash or Card on Delivery */}
              <label 
                className={`p-3 rounded-xl border block cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950' : 'border-neutral-200 hover:border-neutral-300'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-neutral-700" />
                      <span className="font-bold text-neutral-900">Pay on Delivery (Speedpoint Card or Cash to Runner)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    Runner carries wireless POS
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary & Submit Button */}
          <div className="border-t border-neutral-200 pt-5 bg-neutral-50 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-5 sm:p-6 space-y-3">
            <div className="flex justify-between items-center text-xs text-neutral-600">
              <span>Items Total ({cart.length} distinct)</span>
              <span>R {cartSubtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-neutral-600">
              <span>Delivery Fee ({deliveryMethod === 'express' ? 'Jozi Express' : 'Standard'})</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `R ${deliveryFee}`}</span>
            </div>

            <div className="flex justify-between items-center text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
              <span>Total to Pay (ZAR)</span>
              <span className="text-xl font-display">R {grandTotal.toLocaleString()}</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing || cart.length === 0}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-300 text-neutral-950 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Authorizing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order & Pay R {grandTotal.toLocaleString()}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Orders backed by JoziCart Buyer Protection & CPA Return Guarantee</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
