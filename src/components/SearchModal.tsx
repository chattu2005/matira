import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onSelectCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = searchTerm.trim()
    ? products.filter((p) => {
        const q = searchTerm.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.ingredients && p.ingredients.toLowerCase().includes(q))
        );
      })
    : [];

  const popularSearches = ['Cumin', 'Jeera', 'Turmeric', 'Honey', 'Mustard Oil', 'Cardamom', 'Toor Dal'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start animate-fade-in">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E7E2D9] overflow-hidden z-10 my-auto">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E7E2D9] flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#78716C]" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pure spices, oils, raw honey, dal, cumin..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none"
            id="global-search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-[#78716C] hover:text-[#1C1917] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold bg-[#EFE9DD] hover:bg-[#E5DDCF] text-[#44403C] rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {searchTerm.trim() ? (
            filtered.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#78716C] px-2">
                  Found {filtered.length} products
                </p>
                {filtered.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E7E2D9] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images?.[0]}
                        alt={prod.name}
                        className="w-12 h-12 rounded-lg object-cover bg-[#F5F2EB]"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-[#1C1917]">{prod.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-[#78716C]">
                          <span>{prod.categoryName}</span>
                          <span>•</span>
                          <span>{prod.weight}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#1A362B]">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-[#57534E] font-medium">No results found for "{searchTerm}"</p>
                <p className="text-xs text-[#78716C] mt-1">Try searching for cumin, haldi, mustard oil or dal</p>
              </div>
            )
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2 px-1">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF8F5] border border-[#E7E2D9] text-[#57534E] hover:border-[#1A362B] hover:text-[#1A362B] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
