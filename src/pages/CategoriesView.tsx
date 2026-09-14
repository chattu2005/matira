import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category, Product } from '../types';

interface CategoriesViewProps {
  categories: Category[];
  products?: Product[];
  onSelectCategory?: (catId: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories = [],
  products = [],
  onSelectCategory
}) => {
  const handleCatClick = (catId: string) => {
    if (typeof onSelectCategory === 'function') {
      onSelectCategory(catId);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-[0.2em] text-[#2D5A47] font-bold">
          Native Collections
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#1C1917]">
          Shop by Department
        </h1>
        <p className="text-xs sm:text-base text-[#78716C] leading-relaxed">
          From whole aromatic spices to raw cold-pressed oils and unpolished dals, explore our authentic Indian pantry categories.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const catProducts = (products || []).filter((p) => p.categoryId === cat.id);
          return (
            <div
              key={cat.id}
              onClick={() => handleCatClick(cat.id)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E7E2D9] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
              id={`cat-card-${cat.id}`}
            >
              {/* Image Banner */}
              <div className="relative aspect-16/10 overflow-hidden bg-[#F5F2EB]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{catProducts.length} Products</span>
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-white group-hover:text-[#EAD098] transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  {cat.description}
                </p>

                <div className="pt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A362B] group-hover:text-[#2D5A47]">
                    Explore Selection
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] group-hover:bg-[#1A362B] text-[#1A362B] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
