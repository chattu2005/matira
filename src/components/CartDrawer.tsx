import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToCart: () => void;
  onNavigateToShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCheckout,
  onNavigateToCart,
  onNavigateToShop
}) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    coupon,
    couponDiscount,
    couponError,
    applyCouponCode,
    removeCouponCode,
    shippingFee,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    grandTotal,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCouponCode(couponInput.trim());
    setCouponLoading(false);
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in" id="cart-drawer-modal">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E7E2D9] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E7E2D9] bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1A362B]" />
              <h2 className="font-serif-heading text-lg font-bold text-[#1A362B]">Your Basket</h2>
              <span className="text-xs font-semibold bg-[#EFE9DD] text-[#57534E] px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-full hover:bg-[#F5F2EB] transition-colors"
              id="close-cart-drawer-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#F4F9F6] border-b border-[#E0EBE4]">
            <div className="flex items-center justify-between text-xs font-medium text-[#1A362B] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#2D5A47]" />
                {amountNeededForFreeShipping > 0 ? (
                  <span>
                    Add <strong>₹{amountNeededForFreeShipping}</strong> more for{' '}
                    <strong className="text-[#15803D]">FREE Delivery</strong>
                  </span>
                ) : (
                  <span className="text-[#15803D] font-bold">
                    🎉 You unlocked FREE Delivery across India!
                  </span>
                )}
              </span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#DDE9E2] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#15803D] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EFE9DD] flex items-center justify-center text-[#78716C]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-lg font-semibold text-[#1C1917]">Your basket is empty</h3>
                  <p className="text-xs text-[#78716C] mt-1 max-w-xs">
                    Explore our pure Rajasthan cumin, stone-ground spices, raw honey and unpolished pulses.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToShop();
                  }}
                  className="px-5 py-2.5 bg-[#1A362B] text-white text-xs font-semibold rounded-xl hover:bg-[#2D5A47] transition-all shadow-sm"
                  id="drawer-shop-now-btn"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white p-3.5 rounded-xl border border-[#E7E2D9] flex gap-3 shadow-xs"
                >
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80'}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-lg object-cover bg-[#F5F2EB] flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-[#1C1917] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[#A8A29E] hover:text-[#B91C1C] p-1 -mr-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#78716C] mt-0.5">
                        {item.selectedWeight || item.product.weight}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#FAF8F5]">
                      <div className="flex items-center border border-[#E7E2D9] rounded-lg bg-[#FAF8F5] overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-[#EFE9DD] text-[#57534E] transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#1C1917] min-w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-[#EFE9DD] text-[#57534E] transition-colors"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#1A362B]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#E7E2D9] space-y-3">
              
              {/* Coupon input or applied badge */}
              {coupon ? (
                <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#15803D] font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{coupon.code}</strong> applied (-₹{couponDiscount})</span>
                  </div>
                  <button
                    onClick={removeCouponCode}
                    className="text-[#B91C1C] hover:underline text-[11px] font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      className="w-full text-xs px-3 py-2 border border-[#E7E2D9] rounded-lg focus:outline-none focus:border-[#1A362B] uppercase tracking-wider bg-[#FAF8F5]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-3 py-2 bg-[#FAF8F5] border border-[#D6D0C4] hover:bg-[#EFE9DD] text-[#1A362B] text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-[#B91C1C] font-medium">{couponError}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#57534E] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#15803D] font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>{shippingFee === 0 ? <strong className="text-[#15803D]">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-[#1A362B] pt-2 border-t border-[#E7E2D9]">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToCheckout();
                  }}
                  className="w-full py-3 px-4 bg-[#1A362B] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#2D5A47] flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                  id="drawer-proceed-checkout-btn"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToCart();
                  }}
                  className="w-full py-2 text-center text-xs font-medium text-[#57534E] hover:text-[#1A362B] transition-colors"
                  id="drawer-view-full-cart-btn"
                >
                  View Full Cart & Summary
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
