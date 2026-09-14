import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, Check } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  selectedCategory?: string | null;
  initialCategory?: string | null;
  onSelectCategory?: (catId: string | null) => void;
  onSelectProduct: (product: Product) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  categories,
  selectedCategory: externalSelectedCategory,
  initialCategory,
  onSelectCategory,
  onSelectProduct
}) => {
  const [internalSelectedCategory, setInternalSelectedCategory] = useState<string | null>(
    externalSelectedCategory !== undefined ? externalSelectedCategory : (initialCategory || null)
  );

  const activeCategory = externalSelectedCategory !== undefined ? externalSelectedCategory : internalSelectedCategory;

  const handleCategorySelect = (catId: string | null) => {
    setInternalSelectedCategory(catId);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'bestseller' | 'name'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under-300' | '300-600' | 'over-600'>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory && p.categoryId !== activeCategory) {
        return false;
      }
      // Stock filter
      if (inStockOnly && (p.stockQuantity <= 0 || p.stockStatus === 'out_of_stock')) {
        return false;
      }
      // Price range
      if (priceRange === 'under-300' && p.price >= 300) return false;
      if (priceRange === '300-600' && (p.price < 300 || p.price > 600)) return false;
      if (priceRange === 'over-600' && p.price <= 600) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, activeCategory, inStockOnly, priceRange, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Shop Header */}
      <div className="border-b border-[#E7E2D9] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2D5A47]">
              Pantry Essentials & Spices
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
              Shop Pure Indian Grocery
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1">
              Stone-ground spices, Rajasthan jeera, raw forest honey, cold-pressed oils & unpolished dals.
            </p>
          </div>

          {/* Quick Search inside Shop */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in catalogue..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
            />
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 no-scrollbar">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === null
                ? 'bg-[#1A362B] text-white shadow-sm'
                : 'bg-white border border-[#E7E2D9] text-[#57534E] hover:border-[#1A362B]'
            }`}
          >
            All Staples ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1A362B] text-white shadow-sm'
                  : 'bg-white border border-[#E7E2D9] text-[#57534E] hover:border-[#1A362B]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sorting Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E7E2D9] text-xs">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-[#1C1917] flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2D5A47]" /> Filters:
          </span>

          {/* Stock Filter Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
              inStockOnly
                ? 'bg-[#E8F3ED] border-[#2D5A47] text-[#1A362B] font-semibold'
                : 'border-[#E7E2D9] text-[#57534E] hover:bg-[#FAF8F5]'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                inStockOnly ? 'bg-[#1A362B] border-[#1A362B] text-white' : 'border-[#A8A29E]'
              }`}
            >
              {inStockOnly && <Check className="w-2.5 h-2.5" />}
            </div>
            <span>In Stock Only</span>
          </button>

          {/* Price Range Pills */}
          <div className="flex items-center gap-1 border border-[#E7E2D9] rounded-lg p-0.5 bg-[#FAF8F5]">
            <button
              onClick={() => setPriceRange('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] ${
                priceRange === 'all' ? 'bg-white text-[#1C1917] font-semibold shadow-xs' : 'text-[#78716C]'
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setPriceRange('under-300')}
              className={`px-2.5 py-1 rounded-md text-[11px] ${
                priceRange === 'under-300' ? 'bg-white text-[#1C1917] font-semibold shadow-xs' : 'text-[#78716C]'
              }`}
            >
              &lt; ₹300
            </button>
            <button
              onClick={() => setPriceRange('300-600')}
              className={`px-2.5 py-1 rounded-md text-[11px] ${
                priceRange === '300-600' ? 'bg-white text-[#1C1917] font-semibold shadow-xs' : 'text-[#78716C]'
              }`}
            >
              ₹300 - ₹600
            </button>
            <button
              onClick={() => setPriceRange('over-600')}
              className={`px-2.5 py-1 rounded-md text-[11px] ${
                priceRange === 'over-600' ? 'bg-white text-[#1C1917] font-semibold shadow-xs' : 'text-[#78716C]'
              }`}
            >
              &gt; ₹600
            </button>
          </div>
        </div>

        {/* Right: Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[#78716C] flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E7E2D9] rounded-lg px-2.5 py-1.5 text-xs text-[#1C1917] font-medium focus:outline-none focus:border-[#1A362B]"
          >
            <option value="featured">Featured / Curated</option>
            <option value="bestseller">Best Sellers First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product Results Grid */}
      {filteredProducts.length > 0 ? (
        <div>
          <p className="text-xs text-[#78716C] mb-4">
            Showing <strong>{filteredProducts.length}</strong> items
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E7E2D9] p-12 text-center space-y-3">
          <div className="w-16 h-16 bg-[#F5F2EB] rounded-full flex items-center justify-center mx-auto text-[#78716C]">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="font-serif-heading text-lg font-bold text-[#1C1917]">No products matched your filters</h3>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto">
            Try clearing your search query or selecting "All Staples" to view available pure items.
          </p>
          <button
            onClick={() => {
              onSelectCategory(null);
              setSearchTerm('');
              setPriceRange('all');
              setInStockOnly(false);
            }}
            className="px-4 py-2 bg-[#1A362B] text-white text-xs font-semibold rounded-xl hover:bg-[#2D5A47]"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
