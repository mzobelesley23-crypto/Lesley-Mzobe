import React, { useMemo } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  ArrowUpDown, 
  Search, 
  Sparkles
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from './ProductCard';
import { NoResultsRecovery } from './NoResultsRecovery';
import { CATEGORIES_LIST } from '../data/catalogue';

export const ProductGrid: React.FC = () => {
  const { 
    products, 
    filters, 
    setFilters, 
    resetFilters, 
    selectedHub
  } = useMarketplace();

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesSeller = product.seller.name.toLowerCase().includes(query);
        const matchesTags = product.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesSeller && !matchesTags) {
          return false;
        }
      }

      // On sale filter
      if (filters.onSaleOnly && !product.discountPercent) {
        return false;
      }

      // In stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // Price filter
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'fastest') return a.estimatedDeliveryDays - b.estimatedDeliveryDays;
      return 0; // featured/default
    });
  }, [products, filters]);

  const currentCategoryName = CATEGORIES_LIST.find(c => c.id === filters.category)?.label || 'All Items';

  return (
    <section id="marketplace-catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Catalogue Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 font-display">
              {filters.searchQuery ? `Search results for "${filters.searchQuery}"` : currentCategoryName}
            </h2>
            <span className="text-xs text-neutral-500 font-medium">
              ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Fulfilled directly by verified merchants across Gauteng · Delivered via JoziCart Runner Network
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* In Stock toggle */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }))}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${filters.inStockOnly ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}
          >
            In Stock Only
          </button>

          {/* Deals toggle */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, onSaleOnly: !prev.onSaleOnly }))}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${filters.onSaleOnly ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}
          >
            Deals Only
          </button>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-white border border-neutral-200 text-xs font-medium text-neutral-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-neutral-400 cursor-pointer pr-8"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="fastest">Fastest Delivery</option>
            </select>
          </div>

          {/* Reset Filters if active */}
          {(filters.category !== 'all' || filters.searchQuery || filters.onSaleOnly || filters.inStockOnly || filters.sortBy !== 'featured') && (
            <button
              onClick={resetFilters}
              className="px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <NoResultsRecovery />
      )}
    </section>
  );
};
