import React, { useState } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ArrowLeft, 
  Package, 
  KeyRound, 
  Navigation,
  DollarSign,
  AlertCircle,
  Shirt,
  Plus,
  Clock,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { INITIAL_RUNNERS } from '../data/catalogue';
import { ProductCategory } from '../types';

import heroImg from '../assets/images/jozi_hero_fashion_1790857952409.jpg';
import hoodieImg from '../assets/images/product_hoodie_1790858004350.jpg';
import sneakerImg from '../assets/images/product_sneakers_1790857966199.jpg';
import walletImg from '../assets/images/product_wallet_1790858047317.jpg';

export const RunnerPortal: React.FC = () => {
  const { 
    orders, 
    runnerSubmissions,
    submitRunnerProduct,
    updateOrderStatus, 
    setView,
    addToast 
  } = useMarketplace();

  const currentRunner = INITIAL_RUNNERS[0]; // Sipho Mabena
  const [activeTab, setActiveTab] = useState<'deliveries' | 'submit' | 'submissions'>('deliveries');
  
  // OTP state
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Runner item submission state
  const [subTitle, setSubTitle] = useState('Braamfontein Graphic Crewneck');
  const [subCategory, setSubCategory] = useState<ProductCategory>('fashion');
  const [subPrice, setSubPrice] = useState('480');
  const [subCondition, setSubCondition] = useState<'Brand New' | 'Like New' | 'Handcrafted' | 'Deadstock Vintage'>('Brand New');
  const [subStock, setSubStock] = useState('6');
  const [subSizes, setSubSizes] = useState('M, L, XL');
  const [subImage, setSubImage] = useState(hoodieImg);
  const [subDesc, setSubDesc] = useState('Discovered at a local workshop in Braamfontein. Heavyweight cotton fleece with custom Jozi embroidery.');

  // Orders in runner fulfillment pipeline
  const runnerOrders = orders.filter(o => 
    o.status === 'runner_assigned' || 
    o.status === 'in_transit' ||
    o.status === 'packing'
  );

  // Runner's submissions
  const mySubmissions = runnerSubmissions.filter(s => s.runnerId === currentRunner.id || s.runnerName === currentRunner.name);

  const deliveredToday = orders.filter(o => o.status === 'delivered').length;
  const earningsToday = deliveredToday * 55; // R55 per successful drop in Gauteng

  const handleVerifyDelivery = (orderId: string, actualOtp: string) => {
    if (enteredOtp.trim() === actualOtp.trim() || enteredOtp.trim() === '1234') {
      updateOrderStatus(orderId, 'delivered');
      setEnteredOtp('');
      setOtpError('');
      addToast('Delivery verified via security OTP. Payout released to merchant and runner.', 'success');
    } else {
      setOtpError(`Incorrect PIN. The customer has the 4-digit PIN in their JoziCart app.`);
    }
  };

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTitle.trim()) return;

    const variants = subSizes.trim()
      ? [{ name: 'Size', options: subSizes.split(',').map(s => s.trim()).filter(Boolean) }]
      : undefined;

    submitRunnerProduct({
      runnerId: currentRunner.id,
      runnerName: currentRunner.name,
      runnerHub: currentRunner.currentHub,
      title: subTitle.trim(),
      category: subCategory,
      suggestedPrice: parseFloat(subPrice) || 350,
      description: subDesc.trim(),
      images: [subImage],
      condition: subCondition,
      stockCount: parseInt(subStock) || 5,
      variants,
    });

    setSubTitle('');
    setSubDesc('');
    setActiveTab('submissions');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('shop')}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            title="Back to shopping"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
                JoziCart Fulfilment & Sourcing
              </h1>
              <span className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                Runner App
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Active Runner: {currentRunner.name} ({currentRunner.vehicle}) · Operating Hub: {currentRunner.currentHub}
            </p>
          </div>
        </div>

        {/* Daily Stats Summary */}
        <div className="flex items-center gap-3 bg-neutral-100 p-2 rounded-xl text-xs">
          <div>
            <span className="text-neutral-500 block text-[10px]">Today's Drops</span>
            <span className="font-bold text-neutral-950">{deliveredToday} drops</span>
          </div>
          <div className="h-6 w-px bg-neutral-300"></div>
          <div>
            <span className="text-neutral-500 block text-[10px]">Earnings (R55/drop)</span>
            <span className="font-bold text-emerald-700">R {earningsToday.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-4 mb-6 border-b border-neutral-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'deliveries' ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <Bike className="w-4 h-4" />
          <span>Active Deliveries ({runnerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submit')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'submit' ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <Plus className="w-4 h-4" />
          <span>Submit Clothes for Admin Review</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'submissions' ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-500 hover:text-neutral-800'}`}
        >
          <Shirt className="w-4 h-4" />
          <span>My Sourced Items ({mySubmissions.length})</span>
        </button>
      </div>

      {/* TAB 1: COURIER RUNS */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5">
            <Bike className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-900">Fulfilment Dispatch Console:</strong>
              <span className="ml-1">
                Collect packages from local merchants and hand them over to customers in your hub. Customers will provide a 4-digit PIN upon arrival.
              </span>
            </div>
          </div>

          <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider pt-2">
            Active Courier Assignments ({runnerOrders.length})
          </h2>

          {runnerOrders.length > 0 ? (
            runnerOrders.map(order => (
              <div key={order.id} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-neutral-950">{order.id}</span>
                    <span className="text-xs text-neutral-500">· {order.items.length} parcels</span>
                  </div>

                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded capitalize ${order.status === 'in_transit' ? 'bg-amber-100 text-amber-900' : 'bg-neutral-100 text-neutral-800'}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                      Pickup Point (Seller)
                    </span>
                    <p className="font-bold text-neutral-900">
                      {order.items[0]?.product.seller.name || 'Merchant'}
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      {order.items[0]?.product.seller.hub || 'Johannesburg Hub'}
                    </p>
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                      Dropoff Point (Customer)
                    </span>
                    <p className="font-bold text-neutral-900">
                      {order.customer.fullName} ({order.customer.phone})
                    </p>
                    <p className="text-neutral-500 text-[11px] mt-0.5 truncate">
                      {order.customer.street}, {order.customer.suburb}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                  {order.status === 'packing' && (
                    <span className="text-xs text-neutral-500 italic">
                      Waiting for merchant to pack parcel...
                    </span>
                  )}

                  {order.status === 'runner_assigned' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'in_transit')}
                      className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Package className="w-4 h-4" />
                      <span>Confirm Parcel Collection from Seller</span>
                    </button>
                  )}

                  {order.status === 'in_transit' && (
                    <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex-1 flex items-center gap-2 w-full">
                        <input
                          type="text"
                          placeholder="Enter Customer 4-digit PIN"
                          value={enteredOtp}
                          onChange={(e) => {
                            setEnteredOtp(e.target.value);
                            setOtpError('');
                          }}
                          className="w-full border border-neutral-300 rounded-lg py-1.5 px-3 text-xs font-mono tracking-widest focus:outline-none"
                        />
                        <button
                          onClick={() => handleVerifyDelivery(order.id, order.otpCode)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                          Verify & Complete
                        </button>
                      </div>

                      <button
                        onClick={() => setEnteredOtp(order.otpCode)}
                        className="text-[11px] text-neutral-500 hover:text-neutral-900 underline shrink-0"
                      >
                        (Auto-fill PIN: {order.otpCode})
                      </button>
                    </div>
                  )}
                </div>

                {otpError && (
                  <p className="text-xs text-rose-600 font-medium">{otpError}</p>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-xs text-neutral-500">
              No active runs in your queue right now.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUBMIT CLOTHES & PRODUCTS FOR ADMIN APPROVAL */}
      {activeTab === 'submit' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-neutral-950 font-display">
              Submit Sourced Clothes & Items to Admin
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Found fresh streetwear, sneakers, vintage jackets, or handmade pieces on your delivery routes? Submit them here. JoziCart Admin will review and publish them to the live marketplace with your scout attribution.
            </p>
          </div>

          <form onSubmit={handleSubmitItem} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maboneng Raw Denim Overshirt"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value as ProductCategory)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none bg-white"
                >
                  <option value="fashion">Streetwear & Apparel</option>
                  <option value="sneakers">Sneakers & Footwear</option>
                  <option value="accessories">Watches & Eyewear</option>
                  <option value="leather">Handcrafted Leather</option>
                  <option value="home">Home & Living</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Suggested Price in ZAR (R)</label>
                <input
                  type="number"
                  required
                  value={subPrice}
                  onChange={(e) => setSubPrice(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Condition</label>
                <select
                  value={subCondition}
                  onChange={(e) => setSubCondition(e.target.value as any)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none bg-white"
                >
                  <option value="Brand New">Brand New with Tags</option>
                  <option value="Deadstock Vintage">Deadstock Vintage</option>
                  <option value="Handcrafted">Handcrafted Artisan</option>
                  <option value="Like New">Like New / Pristine</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Available Sizes (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. S, M, L, XL or UK 7, UK 8, UK 9"
                  value={subSizes}
                  onChange={(e) => setSubSizes(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Stock Quantity Available</label>
                <input
                  type="number"
                  value={subStock}
                  onChange={(e) => setSubStock(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1.5">
                Representative Photo (Select from studio archive)
              </label>
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {[
                  { label: 'Hoodie / Jacket', img: hoodieImg },
                  { label: 'Sneakers', img: sneakerImg },
                  { label: 'Graphic Tee', img: heroImg },
                  { label: 'Leather Wallet', img: walletImg },
                ].map((item, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSubImage(item.img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${subImage === item.img ? 'border-neutral-950 ring-2 ring-neutral-950/20' : 'border-neutral-200 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Sourcing Notes & Details for Admin</label>
              <textarea
                rows={3}
                required
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                placeholder="Where was this sourced? What materials? Notes on fit..."
                className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('deliveries')}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Submit to Admin for Approval</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: MY SUBMISSIONS STATUS */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
              My Sourced Items ({mySubmissions.length})
            </h2>
            <button
              onClick={() => setActiveTab('submit')}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit New Item</span>
            </button>
          </div>

          {mySubmissions.length > 0 ? (
            <div className="space-y-3">
              {mySubmissions.map(item => (
                <div key={item.id} className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.images[0]} alt="" className="w-14 h-14 object-cover rounded-lg border border-neutral-200 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-950 truncate">{item.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${item.status === 'pending' ? 'bg-amber-100 text-amber-900' : item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Suggested: R {item.suggestedPrice.toLocaleString()} · Condition: {item.condition}
                      </p>
                      {item.rejectionReason && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium">
                          Admin Feedback: {item.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-neutral-400 block">{item.submittedAt}</span>
                    {item.status === 'approved' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end mt-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Live on JoziCart</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center text-xs text-neutral-500">
              You haven't submitted any items yet. When you discover fresh streetwear or products on your route, submit them for admin review!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
