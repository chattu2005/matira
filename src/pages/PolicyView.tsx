import React from 'react';
import { BUSINESS_INFO } from '../services/notificationService';

interface PolicyViewProps {
  type: 'privacy' | 'terms' | 'shipping-policy' | 'refund-policy';
}

export const PolicyView: React.FC<PolicyViewProps> = ({ type }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {type === 'privacy' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-8 sm:p-12 space-y-6">
          <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1C1917]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#78716C]">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

          <div className="space-y-4 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <p>
              MATIRA Natural Foods respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy describes how your personal data is collected, stored, and utilized when you visit or make a purchase from our store.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">1. Information We Collect</h3>
            <p>
              When you browse our catalogue or place an order, we collect details necessary to fulfill your shipment: full name, delivery address, email address, phone number, and selected items.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">2. How We Use Your Information</h3>
            <p>
              We use order information to process payments, arrange dispatch with trusted courier partners, generate tax invoices, and transmit order confirmations and status alerts via email and WhatsApp.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">3. Zero Selling of Data</h3>
            <p>
              We do NOT sell, rent, or lease your personal information to any third-party advertisers. Your information is strictly used for order fulfillment and customer support.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">4. Contacting Us</h3>
            <p>
              For any privacy inquiries or data removal requests, please contact our grievance officer at{' '}
              <a href={`mailto:${BUSINESS_INFO.adminEmail}`} className="text-[#1A362B] underline">
                {BUSINESS_INFO.adminEmail}
              </a>{' '}
              or via WhatsApp at{' '}
              <a href="tel:+919330713861" className="text-[#1A362B] underline">
                {BUSINESS_INFO.phone}
              </a>.
            </p>
          </div>
        </div>
      )}

      {type === 'terms' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-8 sm:p-12 space-y-6">
          <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1C1917]">
            Terms & Conditions
          </h1>
          <p className="text-xs text-[#78716C]">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

          <div className="space-y-4 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <p>
              Welcome to MATIRA Natural Foods. By using our website and purchasing our authentic Indian spices, cold-pressed oils, honey, and pantry staples, you agree to the following terms and conditions.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">1. Product Quality & Variations</h3>
            <p>
              Our products are 100% natural, unadulterated, and free from synthetic colorings. Because agricultural harvests vary slightly depending on season, regional rain, and soil, minor natural variations in spice shade or honey texture may occur without affecting purity.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">2. Pricing & Currency</h3>
            <p>
              All prices displayed on MATIRA are in Indian Rupees (INR ₹) and are inclusive of applicable goods and services taxes.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">3. Intellectual Property</h3>
            <p>
              The MATIRA name, branding, logo, product text, and photographic imagery are property of MATIRA Natural Foods, Kolkata.
            </p>
          </div>
        </div>
      )}

      {type === 'shipping-policy' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-8 sm:p-12 space-y-6">
          <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1C1917]">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-[#78716C]">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

          <div className="space-y-4 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">1. Pan-India Delivery</h3>
            <p>
              We deliver pure groceries to serviceable postal PIN codes across India. Every order is packed in multi-layer aroma barrier containers to safeguard whole spices, unpolished dals, and bottled oils during transit.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">2. Free Shipping Threshold</h3>
            <p>
              Orders with an order total of <strong>₹799 or more qualify for FREE Standard Delivery</strong> across India. For orders below ₹799, a nominal shipping charge of ₹50 is applied at checkout.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">3. Dispatch & Transit Timelines</h3>
            <p>
              All confirmed orders are packed and dispatched within <strong>24 to 48 hours</strong> from our central hub at Little Complex, Lalkuthi, Newtown, Kolkata - 700136. Delivery typically takes <strong>2 to 5 business days</strong> depending on your destination city.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">4. Live Tracking</h3>
            <p>
              Once your shipment is picked up, tracking details are sent directly to your registered email and WhatsApp number.
            </p>
          </div>
        </div>
      )}

      {type === 'refund-policy' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-8 sm:p-12 space-y-6">
          <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#1C1917]">
            Refund & Cancellation Policy
          </h1>
          <p className="text-xs text-[#78716C]">Last updated: {new Date().toLocaleDateString('en-IN')}</p>

          <div className="space-y-4 text-xs sm:text-sm text-[#57534E] leading-relaxed">
            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">1. Our Purity Guarantee</h3>
            <p>
              At MATIRA, your family's health and satisfaction are our absolute priority. If you receive an item with transit damage, seal compromise, or quality discrepancy, we will replace or refund it promptly.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">2. Replacement Window</h3>
            <p>
              Please notify us within <strong>7 days of delivery</strong> by emailing a photo of the damaged package or item to{' '}
              <a href={`mailto:${BUSINESS_INFO.adminEmail}`} className="text-[#1A362B] underline">
                {BUSINESS_INFO.adminEmail}
              </a>{' '}
              or messaging our WhatsApp support at{' '}
              <a href="https://wa.me/919330713861" className="text-[#1A362B] underline">
                +91 9330713861
              </a>.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">3. Refund Processing</h3>
            <p>
              Approved refunds are credited directly to your original payment method within <strong>3 to 5 business days</strong>. For Cash on Delivery orders, refunds are issued via direct UPI transfer or bank NEFT upon verification.
            </p>

            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917] pt-2">4. Order Cancellations</h3>
            <p>
              Orders may be cancelled before shipment dispatch by contacting customer support with your Order Number. Once dispatched, return and replacement guidelines apply.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
