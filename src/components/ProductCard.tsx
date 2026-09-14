import React from 'react';
import { Heart, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = React.useState(false);

  const inWish = isInWishlist(product.id);
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQuantity <= 0;
  const isLowStock = product.stockStatus === 'low_stock' || (product.stockQuantity > 0 && product.stockQuantity <= 15);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-[#FFFFFF] rounded-2xl border border-[#E7E2D9] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-[#D6CFBF] cursor-pointer"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-[#F5F2EB] overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#1A362B] text-[#EAD098] text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
              Bestseller
            </span>
          )}
          {product.isFeatured && !product.isBestSeller && (
            <span className="bg-[#8B5E3C] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
              Featured
            </span>
          )}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="bg-[#B91C1C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            inWish
              ? 'bg-[#B91C1C] text-white'
              : 'bg-white/80 text-[#57534E] hover:bg-white hover:text-[#B91C1C]'
          }`}
          title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
          id={`wishlist-btn-${product.id}`}
        >
          <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
        </button>

        {/* Stock status overlay if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-[#44403C] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Weight Pill */}
          <div className="flex items-center justify-between text-xs text-[#78716C] mb-1.5 font-medium">
            <span className="uppercase tracking-wider text-[11px] text-[#2D5A47]">
              {product.categoryName}
            </span>
            <span className="bg-[#F2ECE1] text-[#57534E] px-2 py-0.5 rounded text-[11px]">
              {product.weight}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-base text-[#1C1917] group-hover:text-[#1A362B] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#78716C] line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="pt-4 mt-3 border-t border-[#F0EBE1] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#1A362B]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-[#A8A29E] line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {isLowStock && !isOutOfStock && (
              <p className="text-[10px] font-semibold text-[#D97706] flex items-center gap-0.5 mt-0.5">
                <AlertCircle className="w-2.5 h-2.5" /> Only {product.stockQuantity} left
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-[#E7E2D9] text-[#A8A29E] cursor-not-allowed'
                : justAdded
                ? 'bg-[#15803D] text-white'
                : 'bg-[#1A362B] text-white hover:bg-[#2D5A47] active:scale-95'
            }`}
            id={`add-to-cart-${product.id}`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
