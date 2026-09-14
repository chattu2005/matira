import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { DeliveryAddress, Order } from '../types';
import { createOrder } from '../services/orderService';
import { getCustomerAddresses, saveCustomerAddress } from '../services/userService';

interface CheckoutViewProps {
  onOrderSuccess: (order: Order) => void;
  onNavigateToCart: () => void;
  onOpenAuth: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
];

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onOrderSuccess,
  onNavigateToCart,
  onOpenAuth
}) => {
  const { currentUser, userProfile } = useAuth();
  const { items, subtotal, coupon, couponDiscount, shippingFee, grandTotal, clearCart } = useCart();

  // Contact Info
  const [customerName, setCustomerName] = useState(userProfile?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phoneNumber || '');

  // Address
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('West Bengal');
  const [postalCode, setPostalCode] = useState('');
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online' | 'upi'>('cod');
  const [orderNotes, setOrderNotes] = useState('');

  // Processing state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load saved addresses if logged in
  useEffect(() => {
    if (currentUser) {
      if (!customerName && userProfile?.displayName) setCustomerName(userProfile.displayName);
      if (!customerEmail && currentUser.email) setCustomerEmail(currentUser.email);
      if (!customerPhone && userProfile?.phoneNumber) setCustomerPhone(userProfile.phoneNumber);

      getCustomerAddresses(currentUser.uid).then((addrs) => {
        setSavedAddresses(addrs);
        const def = addrs.find((a) => a.isDefault);
        if (def && def.id) {
          setSelectedAddressId(def.id);
        } else if (addrs.length > 0 && addrs[0].id) {
          setSelectedAddressId(addrs[0].id);
        }
      });
    }
  }, [currentUser, userProfile]);

  // If selectedAddressId changes to a saved address, populate fields
  useEffect(() => {
    if (selectedAddressId !== 'new') {
      const found = savedAddresses.find((a) => a.id === selectedAddressId);
      if (found) {
        setAddressLine1(found.addressLine1);
        setAddressLine2(found.addressLine2 || '');
        setLandmark(found.landmark || '');
        setCity(found.city);
        setState(found.state);
        setPostalCode(found.postalCode);
      }
    }
  }, [selectedAddressId, savedAddresses]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-heading text-2xl font-bold text-[#1C1917]">Your basket is empty</h2>
        <p className="text-xs sm:text-sm text-[#78716C]">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={onNavigateToCart}
          className="px-6 py-2.5 bg-[#1A362B] text-white text-xs font-semibold rounded-xl"
        >
          View Basket
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic validations
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMsg('Please complete customer contact details');
      return;
    }

    if (!addressLine1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setErrorMsg('Please complete all mandatory delivery address fields');
      return;
    }

    if (!/^\d{6}$/.test(postalCode.trim())) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN Code');
      return;
    }

    setSubmitting(true);

    try {
      const addressPayload: DeliveryAddress = {
        fullName: customerName.trim(),
        phoneNumber: customerPhone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        landmark: landmark.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: 'India',
        customerId: currentUser?.uid
      };

      // Save address for future use if requested and logged in
      if (currentUser && saveAddressForFuture && selectedAddressId === 'new') {
        try {
          await saveCustomerAddress({
            ...addressPayload,
            isDefault: savedAddresses.length === 0
          });
        } catch (e) {
          console.warn('Could not auto-save customer address:', e);
        }
      }

      // Call order service
      const createdOrder = await createOrder({
        customerId: currentUser?.uid || 'guest',
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        items,
        deliveryAddress: addressPayload,
        paymentMethod,
        couponCode: coupon?.code
      });

      if (createdOrder && createdOrder.id) {
        clearCart();
        onOrderSuccess(createdOrder);
      } else {
        setErrorMsg('Failed to complete order. Please try again.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred. Please verify your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#1C1917]">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          Complete your order with verified address and payment details.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Contact, Delivery, Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs sm:text-sm text-[#B91C1C] flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Order Placement Notice</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* 1. Customer Contact */}
          <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E2D9] pb-3">
              <h2 className="font-serif-heading text-lg font-bold text-[#1C1917] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A362B] text-white text-xs flex items-center justify-center">1</span>
                <span>Contact Details</span>
              </h2>
              {!currentUser && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="text-xs text-[#2D5A47] font-semibold hover:underline"
                >
                  Already registered? Sign In
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Email Address * (for invoices & tracking)
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Phone / WhatsApp * (for delivery updates)
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 space-y-4">
            <h2 className="font-serif-heading text-lg font-bold text-[#1C1917] flex items-center gap-2 border-b border-[#E7E2D9] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#1A362B] text-white text-xs flex items-center justify-center">2</span>
              <span>Delivery Address</span>
            </h2>

            {/* Saved Address Chooser if logged in */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#44403C]">
                  Choose Saved Address:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id!)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-[#1A362B] bg-[#F4F9F6] font-medium'
                          : 'border-[#E7E2D9] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C1917]">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-[#E8F3ED] text-[#1A362B] px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-[#57534E] mt-1 line-clamp-2">
                        {addr.addressLine1}, {addr.city}, {addr.postalCode}
                      </p>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setSelectedAddressId('new');
                      setAddressLine1('');
                      setAddressLine2('');
                      setLandmark('');
                      setCity('');
                      setPostalCode('');
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-center ${
                      selectedAddressId === 'new'
                        ? 'border-[#1A362B] bg-[#F4F9F6] font-bold text-[#1A362B]'
                        : 'border-[#E7E2D9] hover:bg-[#FAF8F5] text-[#57534E]'
                    }`}
                  >
                    + Enter New Address
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Street Address / House No. *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. Flat 4B, Greenview Apartments, Main Road"
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Apartment / Suite / Area (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="e.g. Action Area 1"
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Community Center"
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kolkata"
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  PIN Code (6 digits) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 700136"
                  className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full text-xs px-3 py-2.5 bg-[#EFE9DD] border border-[#E7E2D9] rounded-xl text-[#78716C]"
                />
              </div>
            </div>

            {currentUser && selectedAddressId === 'new' && (
              <label className="flex items-center gap-2 text-xs text-[#57534E] cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={saveAddressForFuture}
                  onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                  className="rounded text-[#1A362B]"
                />
                <span>Save this address to my customer profile for faster checkout</span>
              </label>
            )}
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 space-y-4">
            <h2 className="font-serif-heading text-lg font-bold text-[#1C1917] flex items-center gap-2 border-b border-[#E7E2D9] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#1A362B] text-white text-xs flex items-center justify-center">3</span>
              <span>Payment Option</span>
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#1A362B] bg-[#F4F9F6]'
                    : 'border-[#E7E2D9] hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-[#1A362B]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#15803D]" />
                    <span className="text-sm font-bold text-[#1C1917]">
                      Cash on Delivery (COD)
                    </span>
                    <span className="bg-[#E8F3ED] text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Zero Extra Fee
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C] mt-1">
                    Pay conveniently in cash or UPI QR code directly to the courier partner upon arrival at your doorstep.
                  </p>
                </div>
              </label>

              {/* UPI & Online Payment Gateway */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-[#1A362B] bg-[#F4F9F6]'
                    : 'border-[#E7E2D9] hover:bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mt-1 text-[#1A362B]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#1A362B]" />
                    <span className="text-sm font-bold text-[#1C1917]">
                      UPI / Card / NetBanking
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C] mt-1">
                    Instant online confirmation. In production, securely powered via razorpay/payment gateway. For immediate preview testing, order gets placed with confirmed online invoice.
                  </p>
                </div>
              </label>
            </div>

            {/* Optional Special Instructions */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#44403C] mb-1">
                Order Notes / Delivery Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Please leave package at reception or call before arrival"
                className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
              />
            </div>
          </div>
        </div>

        {/* Right Summary: Items, Pricing & Place Order Button (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 space-y-5 sticky top-24">
            <h2 className="font-serif-heading text-lg font-bold text-[#1C1917] border-b border-[#E7E2D9] pb-3">
              Order Basket ({items.length})
            </h2>

            {/* Scrollable mini items */}
            <div className="max-h-60 overflow-y-auto divide-y divide-[#E7E2D9] pr-1 space-y-2">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 pt-2">
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-[#F5F2EB] shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-[#1C1917] truncate">{item.product.name}</p>
                    <p className="text-[#78716C]">
                      {item.selectedWeight || item.product.weight} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1A362B]">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Applied Coupon Pill */}
            {coupon && (
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-2.5 flex items-center justify-between text-xs">
                <span className="text-[#15803D] font-medium flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Coupon <strong>{coupon.code}</strong> applied
                </span>
                <span className="text-[#15803D] font-bold">-₹{couponDiscount}</span>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-2 text-xs text-[#57534E] pt-2 border-t border-[#E7E2D9]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#15803D]">
                  <span>Discount</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Pan-India Shipping</span>
                <span>
                  {shippingFee === 0 ? <strong className="text-[#15803D]">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1A362B] pt-3 border-t border-[#E7E2D9]">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 bg-[#1A362B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#2D5A47] transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              id="place-order-btn"
            >
              {submitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order • ₹{grandTotal.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Trust Assurances */}
            <div className="space-y-1.5 text-[11px] text-[#78716C] pt-2 border-t border-[#F2ECE1]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A47]" />
                <span>Zero adulteration guarantee from MATIRA Natural Foods</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#2D5A47]" />
                <span>Dispatched within 24 hours from Newtown, Kolkata</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
