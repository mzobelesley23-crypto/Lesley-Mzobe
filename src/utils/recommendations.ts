import { Product, BrowsingEvent, Order, RecommendedProduct, ProductCategory, RecommendationReason } from '../types';

// Category pairing graph (which categories complement each other in South African lifestyle shopping)
const COMPLEMENTARY_CATEGORIES: Record<ProductCategory, ProductCategory[]> = {
  fashion: ['sneakers', 'accessories', 'leather'],
  sneakers: ['fashion', 'accessories', 'leather'],
  electronics: ['accessories', 'home'],
  beauty: ['home', 'accessories'],
  home: ['beauty', 'leather', 'accessories'],
  leather: ['accessories', 'fashion', 'sneakers'],
  accessories: ['fashion', 'leather', 'sneakers'],
  all: ['fashion', 'sneakers', 'electronics', 'beauty']
};

/**
 * Calculates a personalized recommendation score for each candidate product
 * based on user browsing history, purchase history, and product popularity.
 */
export function calculatePersonalizedRecommendations(
  allProducts: Product[],
  browsingHistory: BrowsingEvent[],
  orders: Order[],
  options: {
    limit?: number;
    excludeIds?: string[];
    preferredCategory?: ProductCategory;
  } = {}
): RecommendedProduct[] {
  const { limit = 4, excludeIds = [], preferredCategory } = options;
  const now = Date.now();

  // 1. Build Category & Tag frequency maps with time-decay
  const categoryScores: Record<string, number> = {};
  const tagScores: Record<string, number> = {};
  const sellerScores: Record<string, number> = {};
  const viewedProductIds = new Set<string>();

  browsingHistory.forEach((event, idx) => {
    viewedProductIds.add(event.productId);
    // Recency decay: more recent events have higher weight (0.95^index from end)
    const recencyWeight = Math.pow(0.88, idx);

    categoryScores[event.category] = (categoryScores[event.category] || 0) + (10 * recencyWeight);
    sellerScores[event.sellerId] = (sellerScores[event.sellerId] || 0) + (5 * recencyWeight);

    event.tags.forEach(tag => {
      tagScores[tag] = (tagScores[tag] || 0) + (4 * recencyWeight);
    });
  });

  // 2. Add purchase history signals (high weight)
  orders.forEach(order => {
    order.items.forEach(item => {
      const prod = item.product;
      viewedProductIds.add(prod.id);
      categoryScores[prod.category] = (categoryScores[prod.category] || 0) + 15;
      sellerScores[prod.seller.id] = (sellerScores[prod.seller.id] || 0) + 10;
      
      // Also boost complementary categories
      const complementary = COMPLEMENTARY_CATEGORIES[prod.category] || [];
      complementary.forEach(compCat => {
        categoryScores[compCat] = (categoryScores[compCat] || 0) + 8;
      });

      prod.tags.forEach(tag => {
        tagScores[tag] = (tagScores[tag] || 0) + 6;
      });
    });
  });

  // If user has zero browsing history, provide popular trending default
  const hasHistory = browsingHistory.length > 0 || orders.length > 0;

  // 3. Score every eligible product
  const scoredProducts: RecommendedProduct[] = allProducts
    .filter(product => !excludeIds.includes(product.id))
    .map(product => {
      let score = 0;
      let primaryReason: RecommendationReason = {
        type: 'trending',
        label: 'Trending in Jozi'
      };

      // Base quality score from seller reputation and stock
      score += (product.seller.rating || 4.5) * 4;
      score += Math.min(product.seller.ordersFulfilled / 50, 10);
      if (product.discountPercent) score += product.discountPercent * 0.5;
      if (product.inStock) score += 5;

      if (hasHistory) {
        // Category affinity
        const catScore = categoryScores[product.category] || 0;
        if (catScore > 0) {
          score += catScore * 3;
          primaryReason = {
            type: 'category_match',
            label: `Based on your interest in ${formatCategoryName(product.category)}`
          };
        }

        // Tag overlap (Jaccard-like bonus)
        let tagMatches = 0;
        product.tags.forEach(tag => {
          if (tagScores[tag]) {
            score += tagScores[tag] * 2;
            tagMatches++;
          }
        });

        if (tagMatches >= 2 && catScore > 0) {
          primaryReason = {
            type: 'browsing_history',
            label: 'Matches items you recently explored'
          };
        }

        // Seller affinity
        const sellerScore = sellerScores[product.seller.id] || 0;
        if (sellerScore > 0) {
          score += sellerScore * 2.5;
          primaryReason = {
            type: 'seller_affinity',
            label: `From ${product.seller.name} (${product.seller.hub.split(',')[0]})`
          };
        }

        // If product was recently viewed, slightly decrease score to promote discovery
        // unless it's in the recently viewed drawer
        if (viewedProductIds.has(product.id)) {
          score *= 0.75;
        }
      } else {
        // Cold start: prioritize featured badges & trending in Jozi
        if (product.badge) score += 15;
        if (product.discountPercent) {
          primaryReason = {
            type: 'trending',
            label: `Special Offer: ${product.discountPercent}% Off`
          };
        }
      }

      // Explicit preferred category override (for category page or filtered view)
      if (preferredCategory && preferredCategory !== 'all') {
        if (product.category === preferredCategory) score += 30;
      }

      return {
        product,
        score,
        reason: primaryReason
      };
    });

  // Sort descending by score
  scoredProducts.sort((a, b) => b.score - a.score);

  return scoredProducts.slice(0, limit);
}

/**
 * Returns 'Customers Also Viewed' and complementary products for a specific product detail page.
 */
export function calculateCustomersAlsoViewed(
  currentProduct: Product,
  allProducts: Product[],
  browsingHistory: BrowsingEvent[] = [],
  limit = 4
): RecommendedProduct[] {
  const complementaryCategories = COMPLEMENTARY_CATEGORIES[currentProduct.category] || [];

  const candidates = allProducts.filter(p => p.id !== currentProduct.id);

  const scored = candidates.map(product => {
    let score = 0;
    let reason: RecommendationReason = {
      type: 'category_match',
      label: `Popular in ${formatCategoryName(product.category)}`
    };

    // 1. Same category boost
    if (product.category === currentProduct.category) {
      score += 40;
      reason = {
        type: 'category_match',
        label: 'Similar style & craftsmanship'
      };
    } 
    // 2. Complementary category boost
    else if (complementaryCategories.includes(product.category)) {
      score += 30;
      reason = {
        type: 'frequently_paired',
        label: `Frequently paired with this ${formatCategorySingular(currentProduct.category)}`
      };
    }

    // 3. Same merchant / local hub boost
    if (product.seller.id === currentProduct.seller.id) {
      score += 25;
      reason = {
        type: 'seller_affinity',
        label: `Also crafted by ${product.seller.name}`
      };
    } else if (product.seller.hub.split(',')[0] === currentProduct.seller.hub.split(',')[0]) {
      score += 15;
    }

    // 4. Tag overlap
    const sharedTags = product.tags.filter(t => currentProduct.tags.includes(t));
    score += sharedTags.length * 8;

    // 5. General rating / discount appeal
    score += (product.seller.rating || 4.5) * 3;
    if (product.discountPercent) score += 5;

    return {
      product,
      score,
      reason
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

function formatCategoryName(category: ProductCategory): string {
  switch (category) {
    case 'fashion': return 'Streetwear & Apparel';
    case 'sneakers': return 'Sneakers & Shoes';
    case 'electronics': return 'Audio & Electronics';
    case 'beauty': return 'Skincare & Botanicals';
    case 'home': return 'Home & Kitchen';
    case 'leather': return 'Handcrafted Leather';
    case 'accessories': return 'Watches & Accessories';
    default: return 'Marketplace';
  }
}

function formatCategorySingular(category: ProductCategory): string {
  switch (category) {
    case 'fashion': return 'outfit';
    case 'sneakers': return 'pair';
    case 'electronics': return 'tech';
    case 'beauty': return 'skincare item';
    case 'home': return 'piece';
    case 'leather': return 'leather item';
    case 'accessories': return 'accessory';
    default: return 'item';
  }
}
