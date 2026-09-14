import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartViewProps {
  onNavigateToCheckout: () => void;
  onNavigateToShop: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  onNavigateToCheckout,
  onNavigateToShop
}) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    coupon,
    couponDiscount,
    couponError,
    applyCouponCode,
    removeCouponCode,
    shippingFee,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    grandTotal
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setLoadingCoupon(true);
    await applyCouponCode(couponInput.trim());
    setLoadingCoupon(false);
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[#EFE9DD] rounded-full flex items-center justify-center mx-auto text-[#78716C]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif-heading text-3xl font-bold text-[#1C1917]">Your Cart is Empty</h1>
        <p className="text-sm text-[#78716C] max-w-md mx-auto">
          You have not added any pure staples to your basket yet. Discover our fresh Rajasthan cumin seeds, cold-pressed oils, and raw forest honey.
        </p>
        <button
          onClick={onNavigateToShop}
          className="px-8 py-3.5 bg-[#1A362B] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#2D5A47] transition-all shadow-md"
        >
          Explore Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Shopping Basket
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          Review your selected pure Indian groceries and staples before checkout.
        </p>
      </div>

      {/* Free Shipping Progress */}
      <div className="bg-[#F4F9F6] border border-[#DDE9E2] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1A362B] mb-2">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#2D5A47]" />
            {amountNeededForFreeShipping > 0 ? (
              <span>
                Add items worth <strong>₹{amountNeededForFreeShipping}</strong> more to qualify for{' '}
                <strong className="text-[#15803D]">FREE Pan-India Delivery</strong>
              </span>
            ) : (
              <span className="text-[#15803D]">
                🎉 Congratulations! Your order qualifies for FREE Delivery across India!
              </span>
            )}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-[#DDE9E2] rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#15803D] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Cart Grid: Left Items, Right Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Items Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E7E2D9] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-[#E7E2D9] flex items-center justify-between">
            <span className="font-semibold text-sm text-[#1C1917]">
              Items ({items.length})
            </span>
            <button
              onClick={clearCart}
              className="text-xs text-[#B91C1C] hover:underline font-medium"
            >
              Clear Basket
            </button>
          </div>

          <div className="divide-y divide-[#E7E2D9]">
            {items.map((item) => (
              <div key={item.productId} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center flex-1 min-w-0">
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-[#F5F2EB] shrink-0 border border-[#E7E2D9]"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#2D5A47]">
                      {item.product.categoryName}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold text-[#1C1917] truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-[#78716C]">
                      Net Weight: {item.selectedWeight || item.product.weight}
                    </p>
                    <p className="text-xs font-bold text-[#1A362B] sm:hidden mt-1">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-[#E7E2D9] rounded-xl bg-[#FAF8F5] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#57534E] hover:bg-[#EFE9DD] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#1C1917]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#57534E] hover:bg-[#EFE9DD] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <span className="text-sm sm:text-base font-bold text-[#1A362B]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-[#A8A29E] hover:text-[#B91C1C] rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 space-y-4">
            <h2 className="font-serif-heading text-lg font-bold text-[#1C1917] border-b border-[#E7E2D9] pb-3">
              Order Summary
            </h2>

            {/* Coupon Application */}
            {coupon ? (
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#15803D] font-medium">
                  <Tag className="w-4 h-4" />
                  <span>Coupon <strong>{coupon.code}</strong> applied (-₹{couponDiscount})</span>
                </div>
                <button
                  onClick={removeCouponCode}
                  className="text-[#B91C1C] hover:underline font-bold text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="flex-1 text-xs px-3 py-2 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B] uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    disabled={loadingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-[#FAF8F5] border border-[#D6D0C4] hover:bg-[#EFE9DD] text-[#1A362B] text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {loadingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-[#B91C1C]">{couponError}</p>
                )}
                <div className="flex items-center gap-2 text-[11px] text-[#78716C]">
                  <span>Try:</span>
                  <button
                    type="button"
                    onClick={() => setCouponInput('WELCOME10')}
                    className="underline text-[#2D5A47]"
                  >
                    WELCOME10
                  </button>
                  <span>or</span>
                  <button
                    type="button"
                    onClick={() => setCouponInput('MATIRA100')}
                    className="underline text-[#2D5A47]"
                  >
                    MATIRA100
                  </button>
                </div>
              </form>
            )}

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-[#57534E] pt-2 border-t border-[#E7E2D9]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C1917]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#15803D]">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-[#15803D]">FREE</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1A362B] pt-3 border-t border-[#E7E2D9]">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onNavigateToCheckout}
              className="w-full py-4 px-6 bg-[#1A362B] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#2D5A47] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98"
              id="cart-proceed-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Assurance */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#78716C]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A47]" />
              <span>Safe & Encrypted Checkout • COD Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
