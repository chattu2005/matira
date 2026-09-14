import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  ArrowRight,
  Phone,
  Clock,
  Download,
  Share2
} from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessViewProps {
  order: Order;
  onContinueShopping: () => void;
  onViewMyOrders: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  onContinueShopping,
  onViewMyOrders
}) => {
  const steps = [
    { label: 'Order Placed', active: true, done: true },
    { label: 'Confirmed', active: order.status !== 'cancelled', done: true },
    { label: 'Processing', active: ['processing', 'packed', 'shipped', 'delivered'].includes(order.status), done: ['packed', 'shipped', 'delivered'].includes(order.status) },
    { label: 'Shipped', active: ['shipped', 'delivered'].includes(order.status), done: order.status === 'delivered' },
    { label: 'Delivered', active: order.status === 'delivered', done: order.status === 'delivered' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
      {/* Success Hero Header */}
      <div className="bg-[#1A362B] text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl border border-[#2D5A47]">
        <div className="w-16 h-16 bg-[#25D366]/20 border border-[#25D366]/40 rounded-full flex items-center justify-center mx-auto text-[#25D366]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#EAD098]">
            Order Confirmed & Logged
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-white mt-1">
            Thank You for Choosing MATIRA!
          </h1>
          <p className="text-xs sm:text-sm text-[#D1E0D7] mt-2 max-w-lg mx-auto">
            Your pure Indian groceries are being hand-packed with care at our Newtown Kolkata facility.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#EAD098]">
          <span>Order Number: <strong>{order.orderNumber}</strong></span>
          <span>•</span>
          <span>Payment: <strong>{order.paymentMethod.toUpperCase()}</strong></span>
        </div>
      </div>

      {/* Visual Order Progress Timeline */}
      <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 sm:p-8 space-y-6">
        <h2 className="font-serif-heading text-lg font-bold text-[#1C1917]">
          Order Fulfillment Status
        </h2>

        <div className="relative">
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#E7E2D9] -translate-y-1/2 z-0" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step.active
                      ? 'bg-[#1A362B] text-[#EAD098] ring-4 ring-[#E8F3ED]'
                      : 'bg-[#FAF8F5] border border-[#E7E2D9] text-[#A8A29E]'
                  }`}
                >
                  {step.done ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-xs ${
                    step.active ? 'font-bold text-[#1A362B]' : 'text-[#78716C]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details Card: Left Delivery, Right Items & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Delivery Details */}
        <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 space-y-4">
          <h3 className="font-serif-heading text-base font-bold text-[#1C1917] flex items-center gap-2 border-b border-[#E7E2D9] pb-3">
            <MapPin className="w-4 h-4 text-[#2D5A47]" />
            <span>Delivery Destination</span>
          </h3>

          <div className="space-y-1.5 text-xs text-[#57534E]">
            <p className="font-bold text-sm text-[#1C1917]">{order.customerName}</p>
            <p>{order.deliveryAddress.addressLine1}</p>
            {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
            {order.deliveryAddress.landmark && <p>Near: {order.deliveryAddress.landmark}</p>}
            <p>
              {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}
            </p>
            <p className="pt-2 font-medium text-[#1C1917]">
              Contact: {order.customerPhone} • {order.customerEmail}
            </p>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2D9] text-xs text-[#78716C] space-y-1">
            <div className="flex items-center gap-1.5 text-[#1A362B] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Estimated Delivery Timeline</span>
            </div>
            <p>2 to 4 business days. You will receive courier SMS tracking upon dispatch.</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 space-y-4">
          <h3 className="font-serif-heading text-base font-bold text-[#1C1917] flex items-center gap-2 border-b border-[#E7E2D9] pb-3">
            <Package className="w-4 h-4 text-[#2D5A47]" />
            <span>Order Summary ({order.items.length} items)</span>
          </h3>

          <div className="max-h-48 overflow-y-auto divide-y divide-[#E7E2D9] space-y-2 pr-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-xs pt-2">
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-[#1C1917] truncate">{item.name}</p>
                  <p className="text-[#78716C]">{item.weight} × {item.quantity}</p>
                </div>
                <span className="font-bold text-[#1A362B] shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-xs text-[#57534E] pt-3 border-t border-[#E7E2D9]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-[#15803D]">
                <span>Coupon Discount ({order.appliedCoupon?.code})</span>
                <span>-₹{order.couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{order.shippingFee === 0 ? <strong className="text-[#15803D]">FREE</strong> : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#1A362B] pt-2 border-t border-[#E7E2D9]">
              <span>Total Paid / Payable</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#1A362B] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#2D5A47] transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onViewMyOrders}
          className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#E7E2D9] text-[#1C1917] hover:bg-[#FAF8F5] text-xs sm:text-sm font-semibold rounded-xl transition-all"
        >
          View in My Orders
        </button>

        <a
          href={`https://wa.me/919330713861?text=Hello%20MATIRA%20Natural%20Foods,%20I%20have%20an%20inquiry%20regarding%20my%20order%20${order.orderNumber}`}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Phone className="w-4 h-4 fill-current" />
          <span>Need Help on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
