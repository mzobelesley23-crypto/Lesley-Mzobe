import { Product, ProductCategory } from '../types';
import { CATEGORIES_LIST } from '../data/catalogue';

// Simple Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Searches the catalog tokens (tags, categories, title words, sellers)
 * and returns the best alternative keyword if a close match or synonym is found.
 */
export function findBestAlternativeKeyword(
  query: string,
  products: Product[]
): { keyword: string; matchedField: 'tag' | 'category' | 'title' | 'seller' } | null {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery || cleanQuery.length < 2) return null;

  // Build a unique dictionary of catalog keywords
  const dictionary: Array<{ word: string; field: 'tag' | 'category' | 'title' | 'seller' }> = [];
  const seenWords = new Set<string>();

  const addWord = (word: string, field: 'tag' | 'category' | 'title' | 'seller') => {
    const clean = word.toLowerCase().trim();
    if (clean.length >= 3 && !seenWords.has(clean) && clean !== cleanQuery) {
      seenWords.add(clean);
      dictionary.push({ word: clean, field });
    }
  };

  // Add categories
  CATEGORIES_LIST.forEach(cat => {
    if (cat.id !== 'all') {
      addWord(cat.id, 'category');
      cat.label.split(/[\s&]+/).forEach(w => addWord(w, 'category'));
    }
  });

  // Add tags, sellers, and title terms from products
  products.forEach(p => {
    p.tags.forEach(t => addWord(t, 'tag'));
    addWord(p.seller.name, 'seller');
    p.title.split(/[\s-]+/).forEach(w => addWord(w, 'title'));
  });

  // Known South African & e-commerce synonyms / common misspellings
  const SYNONYM_MAP: Record<string, string> = {
    'shoes': 'sneakers',
    'shoe': 'sneakers',
    'kicks': 'sneakers',
    'trainer': 'sneakers',
    'trainers': 'sneakers',
    'boots': 'sneakers',
    'clothes': 'streetwear',
    'clothing': 'streetwear',
    'shirt': 'hoodie',
    'sweater': 'hoodie',
    'jacket': 'hoodie',
    'jersey': 'hoodie',
    'perfume': 'serum',
    'lotion': 'serum',
    'creams': 'serum',
    'skin': 'skincare',
    'face': 'serum',
    'oil': 'serum',
    'phone': 'headphones',
    'headphone': 'headphones',
    'earphone': 'headphones',
    'earphones': 'headphones',
    'audio': 'headphones',
    'bluetooth': 'headphones',
    'speaker': 'headphones',
    'cup': 'ceramics',
    'mug': 'ceramics',
    'pot': 'ceramics',
    'wallet': 'leather',
    'purse': 'leather',
    'bag': 'leather',
    'belts': 'leather',
    'shades': 'sunglasses',
    'glasses': 'sunglasses',
    'specs': 'sunglasses',
    'scent': 'candle',
    'wax': 'candle',
    'braam': 'braamfontein',
    'mabo': 'maboneng',
  };

  if (SYNONYM_MAP[cleanQuery]) {
    return {
      keyword: SYNONYM_MAP[cleanQuery],
      matchedField: 'tag'
    };
  }

  // Find minimum Levenshtein distance
  let bestMatch: { word: string; field: 'tag' | 'category' | 'title' | 'seller'; dist: number } | null = null;

  for (const entry of dictionary) {
    // Check partial containment first (e.g. "sneek" in "sneakers" or "head" in "headphones")
    if (entry.word.includes(cleanQuery) || cleanQuery.includes(entry.word)) {
      return { keyword: entry.word, matchedField: entry.field };
    }

    const dist = levenshteinDistance(cleanQuery, entry.word);
    const maxAllowedDist = cleanQuery.length <= 4 ? 1 : cleanQuery.length <= 7 ? 2 : 3;

    if (dist <= maxAllowedDist) {
      if (!bestMatch || dist < bestMatch.dist) {
        bestMatch = { word: entry.word, field: entry.field, dist };
      }
    }
  }

  if (bestMatch) {
    return { keyword: bestMatch.word, matchedField: bestMatch.field };
  }

  return null;
}

/**
 * Returns top trending categories with actual in-stock item counts from the catalog.
 */
export function getTrendingCategoriesWithCounts(products: Product[]): Array<{
  id: ProductCategory;
  label: string;
  count: number;
}> {
  const counts: Record<string, number> = {};

  products.forEach(p => {
    if (p.inStock) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
  });

  return CATEGORIES_LIST
    .filter(cat => cat.id !== 'all' && (counts[cat.id] || 0) > 0)
    .map(cat => ({
      id: cat.id as ProductCategory,
      label: cat.label,
      count: counts[cat.id] || 0
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extracts popular curated tags from the active catalog for rapid discovery.
 */
export function getPopularCatalogKeywords(products: Product[], limit = 8): string[] {
  const tagCounts: Record<string, number> = {};

  products.forEach(p => {
    p.tags.forEach(t => {
      const clean = t.trim().toLowerCase();
      tagCounts[clean] = (tagCounts[clean] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, limit);
}
