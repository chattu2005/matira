import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: string, param?: string) => void;
  onNavigateHome?: () => void;
  onNavigateShop?: (catId?: string) => void;
  onNavigateCategories?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onNavigateHome,
  onNavigateShop,
  onNavigateCategories,
  onNavigateAbout,
  onNavigateContact
}) => {
  const handleNav = (view: string, param?: string) => {
    if (onNavigate) {
      onNavigate(view, param);
      return;
    }
    if (view === 'home' && onNavigateHome) {
      onNavigateHome();
    } else if (view === 'shop' && onNavigateShop) {
      onNavigateShop(param);
    } else if (view === 'categories' && onNavigateCategories) {
      onNavigateCategories();
    } else if (view === 'about' && onNavigateAbout) {
      onNavigateAbout();
    } else if (view === 'contact' && onNavigateContact) {
      onNavigateContact();
    }
  };
  return (
    <footer className="bg-[#142A21] text-[#D1E0D7] border-t border-[#234436]">
      {/* Upper Footer: Value Highlights */}
      <div className="border-b border-[#234436] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A362B] border border-[#2D5A47] flex items-center justify-center text-[#EAD098]">
              🌱
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">100% Pure & Honest</h4>
              <p className="text-[11px] text-[#A3B8AC]">Direct from heritage farms</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A362B] border border-[#2D5A47] flex items-center justify-center text-[#EAD098]">
              🚚
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Free Delivery ₹799+</h4>
              <p className="text-[11px] text-[#A3B8AC]">Safe doorstep shipping across India</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A362B] border border-[#2D5A47] flex items-center justify-center text-[#EAD098]">
              🛡️
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Unadulterated Quality</h4>
              <p className="text-[11px] text-[#A3B8AC]">Stone-ground & cold-pressed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A362B] border border-[#2D5A47] flex items-center justify-center text-[#EAD098]">
              💬
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">WhatsApp Support</h4>
              <p className="text-[11px] text-[#A3B8AC]">+91 9330713861</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif-heading text-3xl font-bold tracking-[0.15em] text-[#EAD098]">
                MATIRA
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-[#A3B8AC] -mt-1 font-medium">
                Pure Indian Grocery & Spices
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A3B8AC] leading-relaxed max-w-sm">
              MATIRA Natural Foods brings uncompromised Indian kitchen staples—hand-sorted whole spices, stone-ground powders, raw unheated forest honey, and wood-churned oils—direct to your family table.
            </p>

            {/* Direct Contact Info */}
            <div className="space-y-2 pt-2 text-xs text-[#D1E0D7]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#EAD098] shrink-0 mt-0.5" />
                <span>Little Complex, Lalkuthi, Newtown, Kolkata - 700136</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#EAD098] shrink-0" />
                <a href="tel:+919330713861" className="hover:text-white transition-colors">
                  +91 9330713861
                </a>
                <span className="text-[#648373]">•</span>
                <a
                  href="https://wa.me/919330713861"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#88D49E] hover:underline"
                >
                  WhatsApp Chat
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#EAD098] shrink-0" />
                <a href="mailto:chattu1904@gmail.com" className="hover:text-white transition-colors">
                  chattu1904@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Shop Staples</h4>
            <ul className="space-y-2.5 text-xs text-[#A3B8AC]">
              <li>
                <button onClick={() => handleNav('shop', 'spices')} className="hover:text-white transition-colors">
                  Pure Spices & Jeera
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'honey')} className="hover:text-white transition-colors">
                  Raw Wild Honey
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'edible-oils')} className="hover:text-white transition-colors">
                  Cold Pressed Edible Oils
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'pulses')} className="hover:text-white transition-colors">
                  Unpolished Pulses & Dals
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'cereals')} className="hover:text-white transition-colors">
                  Heritage Rice & Cereals
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'natural-foods')} className="hover:text-white transition-colors">
                  Natural Foods
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-[#A3B8AC]">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  About MATIRA
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('account', 'orders')} className="hover:text-white transition-colors">
                  Track My Orders
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('account', 'profile')} className="hover:text-white transition-colors">
                  Customer Account
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('account', 'wishlist')} className="hover:text-white transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin')} className="text-[#EAD098] hover:underline flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Policies</h4>
            <ul className="space-y-2.5 text-xs text-[#A3B8AC]">
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shipping-policy')} className="hover:text-white transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('refund-policy')} className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-[#234436] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7B9688] gap-3">
          <p>© {new Date().getFullYear()} MATIRA Natural Foods. All rights reserved. Kolkata, India.</p>
          <p className="flex items-center gap-1">
            Handcrafted with honesty for pure Indian kitchens
          </p>
        </div>
      </div>
    </footer>
  );
};
