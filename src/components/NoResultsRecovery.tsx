import React, { useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Compass, 
  TrendingUp,
  CornerDownRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from './ProductCard';
import { 
  findBestAlternativeKeyword, 
  getTrendingCategoriesWithCounts, 
  getPopularCatalogKeywords 
} from '../utils/searchHelpers';
import { ProductCategory } from '../types';

export const NoResultsRecovery: React.FC = () => {
  const { 
    products, 
    filters, 
    setFilters, 
    resetFilters 
  } = useMarketplace();

  const query = filters.searchQuery.trim();

  // 1. Fuzzy alternative keyword ("Did you mean...?")
  const alternativeSuggestion = useMemo(() => {
    if (!query) return null;
    return findBestAlternativeKeyword(query, products);
  }, [query, products]);

  // 2. Dynamic trending categories with in-stock counts
  const trendingCategories = useMemo(() => {
    return getTrendingCategoriesWithCounts(products);
  }, [products]);

  // 3. Popular search tags from catalog
  const popularKeywords = useMemo(() => {
    return getPopularCatalogKeywords(products, 8);
  }, [products]);

  // 4. Fallback items to keep user engaged (highest rated / top sellers)
  const popularFallbackProducts = useMemo(() => {
    return [...products]
      .filter(p => p.inStock)
      .sort((a, b) => (b.seller.rating || 0) - (a.seller.rating || 0))
      .slice(0, 4);
  }, [products]);

  const handleApplyKeyword = (keyword: string) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: keyword,
      category: 'all',
      onSaleOnly: false,
    }));
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryId: ProductCategory) => {
    setFilters(prev => ({
      ...prev,
      category: categoryId,
      searchQuery: '',
      onSaleOnly: false,
    }));
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="py-10 space-y-12">
      {/* Primary No Results Notice Box */}
      <div className="max-w-2xl mx-auto text-center bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto mb-4">
          <Search className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-neutral-950 font-display mb-1.5">
          {query ? `No items found matching "${query}"` : 'No products match your current filters'}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed mb-6">
          {query ? (
            <>We couldn't find any direct matches in our Johannesburg merchant inventory. Check your spelling or try one of the suggestions below.</>
          ) : (
            <>Try relaxing your price, delivery, or sale filters to view more products from our verified Gauteng merchants.</>
          )}
        </p>

        {/* Dynamic Alternative Suggestion ("Did you mean...?") */}
        {alternativeSuggestion && (
          <div className="mb-6 p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl inline-flex flex-col sm:flex-row items-center gap-2 text-xs text-amber-950">
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Did you mean:</span>
            </div>
            <button
              onClick={() => handleApplyKeyword(alternativeSuggestion.keyword)}
              className="font-bold underline text-neutral-950 hover:text-amber-700 transition-colors flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-md border border-amber-300 shadow-2xs"
            >
              <span>"{alternativeSuggestion.keyword}"</span>
              <CornerDownRight className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>
        )}

        {/* Primary Reset CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Search & View All Items</span>
          </button>
        </div>
      </div>

      {/* Suggested Categories Grid (Based on live catalog stock) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-neutral-700" />
            <h4 className="text-sm font-bold text-neutral-950 font-display uppercase tracking-wider">
              Trending Categories
            </h4>
          </div>
          <span className="text-[11px] text-neutral-500">
            In-stock and available for Gauteng delivery
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {trendingCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="p-3.5 bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-xs rounded-xl text-left transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-neutral-900 group-hover:text-amber-700 transition-colors block">
                  {cat.label}
                </span>
                <span className="text-[11px] text-neutral-500 mt-0.5 block">
                  {cat.count} in-stock {cat.count === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="mt-2 text-[10px] text-neutral-400 group-hover:text-neutral-900 font-semibold flex items-center gap-1 transition-colors">
                <span>Browse category</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Search Keywords Chips */}
      {popularKeywords.length > 0 && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-neutral-600" />
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Popular Search Terms in Johannesburg
            </h4>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {popularKeywords.map(keyword => (
              <button
                key={keyword}
                onClick={() => handleApplyKeyword(keyword)}
                className="px-3 py-1.5 bg-white hover:bg-neutral-950 hover:text-white border border-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition-colors cursor-pointer capitalize flex items-center gap-1.5 group shadow-2xs"
              >
                <span>{keyword}</span>
                <ArrowRight className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fallback Curated Products: "Trending in Jozi" */}
      {popularFallbackProducts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-0.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                <span>Featured Local Picks</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-950 font-display">
                Popular with Jozi Shoppers Today
              </h3>
            </div>

            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
            >
              <span>See entire catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {popularFallbackProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
