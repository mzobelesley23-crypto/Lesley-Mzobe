import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  Plus, 
  DollarSign, 
  Check, 
  Clock, 
  ArrowLeft,
  Truck,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { INITIAL_SELLERS } from '../data/catalogue';

export const SellerPortal: React.FC = () => {
  const { 
    orders, 
    products, 
    addProduct, 
    updateOrderStatus, 
    setView 
  } = useMarketplace();

  const currentSeller = INITIAL_SELLERS[0]; // Urban Stitch Co.
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'new-product'>('orders');

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('fashion');
  const [newPrice, setNewPrice] = useState('450');
  const [newStock, setNewStock] = useState('20');
  const [newDescription, setNewDescription] = useState('');

  // Seller's orders
  const sellerOrders = orders.filter(o => 
    o.items.some(item => item.product.seller.id === currentSeller.id || item.product.seller.name === currentSeller.name) ||
    o.items.length > 0 // in demo show all incoming orders for interactive test
  );

  const totalEarnings = orders.reduce((sum, o) => sum + (o.status === 'delivered' ? o.subtotal : 0), 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProduct({
      title: newTitle,
      category: newCategory,
      price: parseFloat(newPrice) || 299,
      stockCount: parseInt(newStock) || 10,
      description: newDescription || 'Crafted in Johannesburg for JoziCart marketplace.',
      seller: currentSeller,
      inStock: true,
      badge: 'Local Craft',
    });

    setNewTitle('');
    setNewDescription('');
    setActiveTab('products');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('shop')}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            title="Return to Marketplace"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
                {currentSeller.name} Merchant Hub
              </h1>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                Verified Seller
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Operating Hub: {currentSeller.hub} · Direct JoziCart Runner Collection
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'orders' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            Incoming Orders ({sellerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'products' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('new-product')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${activeTab === 'new-product' ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:text-neutral-950'}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium block">Total Payouts (ZAR)</span>
          <span className="text-xl font-bold text-neutral-950 font-display mt-1 block">
            R {(totalEarnings * 0.92).toLocaleString()}
          </span>
          <span className="text-[10px] text-neutral-400">Net after 8% platform fee</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium block">Pending Packing</span>
          <span className="text-xl font-bold text-amber-700 font-display mt-1 block">
            {sellerOrders.filter(o => o.status === 'confirmed').length}
          </span>
          <span className="text-[10px] text-neutral-400">Requires boxing</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium block">In Transit via Runner</span>
          <span className="text-xl font-bold text-blue-700 font-display mt-1 block">
            {sellerOrders.filter(o => o.status === 'in_transit' || o.status === 'runner_assigned').length}
          </span>
          <span className="text-[10px] text-neutral-400">En route to customers</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-xs text-neutral-500 font-medium block">Merchant Rating</span>
          <span className="text-xl font-bold text-neutral-950 font-display mt-1 block">
            {currentSeller.rating.toFixed(1)} / 5.0
          </span>
          <span className="text-[10px] text-neutral-400">100% CPA compliant</span>
        </div>
      </div>

      {/* Tab: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">
              Order Fulfillment Queue
            </h3>
            <span className="text-xs text-neutral-500">
              When packed, tap button to request immediate JoziCart Runner pickup
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {sellerOrders.length > 0 ? (
              sellerOrders.map(order => (
                <div key={order.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-neutral-900">{order.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : order.status === 'confirmed' ? 'bg-amber-50 text-amber-800' : 'bg-blue-50 text-blue-800'}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600">
                      Deliver to: <strong>{order.customer.fullName}</strong> ({order.customer.suburb}, {order.customer.city})
                    </p>

                    <p className="text-[11px] text-neutral-500">
                      Items: {order.items.map(i => `${i.quantity}x ${i.product.title}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right sm:mr-3">
                      <span className="text-xs text-neutral-500 block">Order Value</span>
                      <span className="text-sm font-bold text-neutral-900">R {order.total.toLocaleString()}</span>
                    </div>

                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'packing')}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Start Packing
                      </button>
                    )}

                    {order.status === 'packing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'runner_assigned')}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Request JoziCart Runner</span>
                      </button>
                    )}

                    {order.status === 'runner_assigned' && (
                      <span className="text-xs text-blue-700 font-medium bg-blue-50 px-2.5 py-1 rounded">
                        Runner Dispatched for Pickup
                      </span>
                    )}

                    {order.status === 'in_transit' && (
                      <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded">
                        Out with Runner
                      </span>
                    )}

                    {order.status === 'delivered' && (
                      <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Delivered</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-500 text-xs">
                No active orders at this moment.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Products List */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white border border-neutral-200 rounded-xl p-3.5 flex gap-3 shadow-xs">
              <img src={p.images[0]} alt="" className="w-16 h-16 object-cover rounded-lg border border-neutral-100" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-neutral-900 truncate">{p.title}</h4>
                <p className="text-xs font-bold text-neutral-950 mt-1">R {p.price.toLocaleString()}</p>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2">
                  <span>Stock: {p.stockCount} units</span>
                  <span className="text-emerald-700 font-medium">{p.isDemo ? 'Demo Catalog' : 'Custom'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Add New Product Form */}
      {activeTab === 'new-product' && (
        <form onSubmit={handleCreateProduct} className="max-w-xl mx-auto bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-neutral-950">Publish New Marketplace Listing</h3>

          <div>
            <label className="block text-neutral-700 font-medium mb-1">Product Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Maboneng Raw Denim Overshirt"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none bg-white"
              >
                <option value="fashion">Fashion & Streetwear</option>
                <option value="sneakers">Sneakers & Shoes</option>
                <option value="electronics">Electronics & Audio</option>
                <option value="beauty">Skincare & Beauty</option>
                <option value="home">Home & Living</option>
                <option value="leather">Leather Goods</option>
                <option value="accessories">Watches & Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Price in ZAR (R)</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-medium mb-1">Stock Count</label>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-medium mb-1">Product Description</label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Tell buyers about materials, sizing, and Johannesburg craftsmanship..."
              className="w-full border border-neutral-200 rounded-lg p-2 text-neutral-900 focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-950 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Publish to JoziCart
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
