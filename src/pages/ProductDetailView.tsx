import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  Phone,
  ArrowLeft,
  Star,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToCheckout: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onNavigateToCheckout
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState<string>(product.images?.[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'benefits' | 'storage'>('description');
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const inWish = isInWishlist(product.id);
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stockQuantity <= 0;
  const isLowStock = product.stockStatus === 'low_stock' || (product.stockQuantity > 0 && product.stockQuantity <= 15);

  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    onNavigateToCheckout();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello MATIRA Natural Foods! I would like to order: ${product.name} (${product.weight}) - ₹${product.price}. Please guide me on delivery.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-2 text-xs text-[#78716C]">
        <button
          onClick={onBack}
          className="flex items-center gap-1 hover:text-[#1A362B] font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span>/</span>
        <span>{product.categoryName}</span>
        <span>/</span>
        <span className="text-[#1C1917] font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#F5F2EB] border border-[#E7E2D9] shadow-sm">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-[#1A362B] text-[#EAD098] text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
                Bestseller
              </span>
            )}
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="absolute top-4 right-4 bg-[#B91C1C] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails if multiple images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#1A362B] shadow-sm' : 'border-[#E7E2D9] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions (7 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs text-[#78716C]">
              <span className="uppercase tracking-widest font-bold text-[#2D5A47]">
                {product.categoryName}
              </span>
              <span>SKU: {product.sku}</span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1C1917] leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Purity Trust */}
            <div className="flex items-center gap-3">
              <div className="flex text-[#D97706]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#57534E]">5.0 (Customer Verified)</span>
              <span className="text-xs text-[#A8A29E]">•</span>
              <span className="text-xs text-[#15803D] font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 100% Purity Certified
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E2D9] flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-[#1A362B]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-[#A8A29E] line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-[#78716C] ml-auto font-medium">
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Pack Size / Weight Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#44403C] mb-2">
                Net Weight / Pack Size
              </label>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-[#1A362B] text-[#EAD098] border border-[#1A362B] rounded-xl text-xs font-bold">
                  {product.weight}
                </div>
              </div>
            </div>

            {/* Stock Status Indicator */}
            <div>
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] px-3 py-1 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" /> Currently Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" /> Only {product.stockQuantity} units left in stock!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#F0FDF4] px-3 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready for Immediate Dispatch
                </span>
              )}
            </div>

            {/* Quantity Selector & Main Action Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E7E2D9] rounded-xl bg-white overflow-hidden p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#57534E] hover:bg-[#FAF8F5] rounded-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-[#1C1917]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#57534E] hover:bg-[#FAF8F5] rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Basket Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    isOutOfStock
                      ? 'bg-[#E7E2D9] text-[#A8A29E] cursor-not-allowed'
                      : addedNotice
                      ? 'bg-[#15803D] text-white'
                      : 'bg-[#1A362B] text-white hover:bg-[#2D5A47]'
                  }`}
                  id="pdp-add-to-cart-btn"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Basket!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Basket
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition-all ${
                    inWish
                      ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C]'
                      : 'border-[#E7E2D9] text-[#57534E] hover:bg-[#FAF8F5]'
                  }`}
                  title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${inWish ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-6 bg-[#EAD098] hover:bg-[#F2DEC0] text-[#142A21] text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50"
                id="pdp-buy-now-btn"
              >
                Buy Now (Direct Checkout)
              </button>

              {/* WhatsApp Quick Order */}
              <a
                href={`https://wa.me/919330713861?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-[#F4F9F6] border border-[#CDE5D7] hover:bg-[#E8F5ED] text-[#1A362B] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#25D366]" />
                <span>Order via WhatsApp (+91 9330713861)</span>
              </a>
            </div>

            {/* Delivery & Trust Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E7E2D9] text-xs text-[#57534E]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#2D5A47]" />
                <span>FREE Shipping on ₹799+</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2D5A47]" />
                <span>Pure & Natural Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#2D5A47]" />
                <span>Damage Replacement Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2D5A47]" />
                <span>No Artificial Colors or Preservatives</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Description, Ingredients, Benefits, Storage) */}
      <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-8">
        <div className="flex gap-4 border-b border-[#E7E2D9] overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('description')}
            className={`text-xs sm:text-sm font-bold uppercase tracking-wider py-2 transition-colors relative whitespace-nowrap ${
              activeTab === 'description'
                ? 'text-[#1A362B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1A362B]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`text-xs sm:text-sm font-bold uppercase tracking-wider py-2 transition-colors relative whitespace-nowrap ${
              activeTab === 'ingredients'
                ? 'text-[#1A362B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1A362B]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Ingredients & Purity
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`text-xs sm:text-sm font-bold uppercase tracking-wider py-2 transition-colors relative whitespace-nowrap ${
              activeTab === 'benefits'
                ? 'text-[#1A362B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1A362B]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Culinary & Health Benefits
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`text-xs sm:text-sm font-bold uppercase tracking-wider py-2 transition-colors relative whitespace-nowrap ${
              activeTab === 'storage'
                ? 'text-[#1A362B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1A362B]'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            Storage & Usage
          </button>
        </div>

        <div className="pt-6 text-xs sm:text-sm text-[#57534E] leading-relaxed space-y-4">
          {activeTab === 'description' && (
            <div className="space-y-3">
              <p className="font-medium text-[#1C1917]">{product.description}</p>
              <p>
                Every batch of MATIRA products is sourced directly from sustainable regional cooperatives across India. We strictly prohibit chemical polishing, ethylene oxide fumigation, artificial dyes, and starch fillers.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2D9]">
                <span className="font-bold text-[#1C1917]">Ingredients: </span>
                <span>{product.ingredients || '100% Single-origin natural whole product. No preservatives or chemical additives.'}</span>
              </div>
              <p className="text-xs text-[#78716C]">
                Allergen Information: Packed in a facility that also handles authentic spices, nuts, and natural pulses.
              </p>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-3">
              <p className="font-medium text-[#1C1917]">
                {product.benefits || 'Rich in natural bio-actives, antioxidants, and essential volatile oils that aid digestion, boost immunity, and bring warmth to daily meals.'}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Zero exposure to high heat during traditional stone-grinding</li>
                <li>Preserves delicate volatile aroma compounds and natural carotenoids</li>
                <li>Honest nutritional density matching ancient ayurvedic culinary traditions</li>
              </ul>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3">
              <p className="font-medium text-[#1C1917]">
                {product.storageInstructions || 'Store in a cool, dry place away from direct sunlight. After opening, transfer to an airtight glass or stainless steel jar to lock in freshness and aroma.'}
              </p>
              <p className="text-xs text-[#78716C]">
                Best Before: 12 months from packing date. Packed at MATIRA Natural Foods, Kolkata - 700136.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#1C1917]">
              You May Also Love
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
