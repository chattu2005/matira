import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  Phone,
  Package,
  LogOut,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  currentView?: string;
  onNavigate?: (view: string, param?: string) => void;
  onOpenSearch?: () => void;
  onOpenAuth?: (initialMode?: 'login' | 'register') => void;
  onOpenCart?: () => void;
  onOpenAccount?: (tab?: string) => void;
  onOpenAdmin?: () => void;
  onNavigateHome?: () => void;
  onNavigateShop?: (catId?: string) => void;
  onNavigateCategories?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  categories?: any[];
  announcementText?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'home',
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  onOpenCart,
  onOpenAccount,
  onOpenAdmin,
  onNavigateHome,
  onNavigateShop,
  onNavigateCategories,
  onNavigateAbout,
  onNavigateContact,
  announcementText = '✨ FREE Shipping across India on orders above ₹799! Pure & Honest Grocery.'
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlistIds } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
    } else if (view === 'admin' && onOpenAdmin) {
      onOpenAdmin();
    } else if (view === 'account') {
      if (onOpenAccount) onOpenAccount(param);
    }
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop', view: 'shop' },
    { label: 'Categories', view: 'categories' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2D9] transition-all">
      {/* Announcement Bar */}
      <div className="bg-[#1A362B] text-[#EAD098] px-4 py-2 text-xs md:text-sm font-medium text-center tracking-wide flex items-center justify-center gap-2">
        <span>{announcementText}</span>
        <a
          href="https://wa.me/919330713861"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1 text-white/90 hover:text-white underline ml-2 text-xs"
        >
          <Phone className="w-3 h-3" /> WhatsApp Help: +91 9330713861
        </a>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNav('home')}
              className="text-left group flex flex-col focus:outline-none"
              id="brand-logo-btn"
            >
              <span className="font-serif-heading text-2xl sm:text-3xl font-bold tracking-[0.15em] text-[#1A362B] group-hover:text-[#2D5A47] transition-colors">
                MATIRA
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium text-[#78716C] -mt-1">
                Pure Indian Grocery & Spices
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNav(link.view)}
                className={`text-sm font-medium tracking-wide transition-colors py-1 relative ${
                  currentView === link.view
                    ? 'text-[#1A362B] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1A362B]'
                    : 'text-[#57534E] hover:text-[#1A362B]'
                }`}
                id={`nav-link-${link.view}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#44403C] hover:text-[#1A362B] hover:bg-[#F2ECE1] rounded-full transition-colors"
              title="Search products"
              id="search-toggle-btn"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNav('account', 'wishlist')}
              className="p-2 text-[#44403C] hover:text-[#1A362B] hover:bg-[#F2ECE1] rounded-full transition-colors relative"
              title="Wishlist"
              id="wishlist-nav-btn"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#8B2500] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => (onOpenCart ? onOpenCart() : setIsCartOpen(true))}
              className="p-2 text-[#44403C] hover:text-[#1A362B] hover:bg-[#F2ECE1] rounded-full transition-colors relative"
              title="Shopping Cart"
              id="cart-nav-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#1A362B] text-[#EAD098] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Account Dropdown */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1 px-3 rounded-full text-sm font-medium text-[#1A362B] bg-[#EFE9DD] hover:bg-[#E5DDCF] transition-colors"
                  id="user-menu-btn"
                >
                  <UserIcon className="w-4 h-4 text-[#1A362B]" />
                  <span className="hidden lg:inline max-w-[100px] truncate">
                    {userProfile?.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuth('login')}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wide py-2 px-4 rounded-full bg-[#1A362B] text-[#FFFFFF] hover:bg-[#2D5A47] transition-all shadow-sm"
                  id="sign-in-nav-btn"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Account Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#E7E2D9] rounded-xl shadow-xl py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E7E2D9]">
                    <p className="text-xs text-[#78716C]">Signed in as</p>
                    <p className="text-sm font-semibold text-[#1C1917] truncate">{currentUser.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#1A362B] bg-[#E8F0EB] px-2 py-0.5 rounded mt-1">
                        <ShieldCheck className="w-3 h-3" /> Store Admin
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNav('account', 'profile');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#44403C] hover:bg-[#FAF8F5] flex items-center gap-2.5"
                    id="menu-my-account"
                  >
                    <UserIcon className="w-4 h-4 text-[#78716C]" /> My Profile
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNav('account', 'orders');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#44403C] hover:bg-[#FAF8F5] flex items-center gap-2.5"
                    id="menu-my-orders"
                  >
                    <Package className="w-4 h-4 text-[#78716C]" /> My Orders
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNav('account', 'addresses');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#44403C] hover:bg-[#FAF8F5] flex items-center gap-2.5"
                    id="menu-saved-addresses"
                  >
                    <MapPin className="w-4 h-4 text-[#78716C]" /> Saved Addresses
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNav('account', 'wishlist');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#44403C] hover:bg-[#FAF8F5] flex items-center gap-2.5"
                    id="menu-wishlist"
                  >
                    <Heart className="w-4 h-4 text-[#78716C]" /> Wishlist
                  </button>

                  {isAdmin && (
                    <div className="border-t border-[#E7E2D9] my-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNav('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-semibold text-[#1A362B] bg-[#F4F9F6] hover:bg-[#E8F3ED] flex items-center gap-2.5"
                        id="menu-admin-panel"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#1A362B]" /> Admin Dashboard
                      </button>
                    </div>
                  )}

                  <div className="border-t border-[#E7E2D9] my-1 pt-1">
                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                        handleNav('home');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2.5"
                      id="menu-logout"
                    >
                      <LogOut className="w-4 h-4 text-[#B91C1C]" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#44403C] hover:text-[#1A362B] rounded-lg transition-colors"
              id="mobile-menu-toggle-btn"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E7E2D9] px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  handleNav(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium tracking-wide transition-colors ${
                  currentView === link.view
                    ? 'bg-[#1A362B] text-white'
                    : 'text-[#44403C] hover:bg-[#EFE9DD]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="border-t border-[#E7E2D9] pt-3 space-y-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    handleNav('account', 'profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#44403C] hover:bg-[#EFE9DD] flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" /> My Account ({userProfile?.displayName})
                </button>
                <button
                  onClick={() => {
                    handleNav('account', 'orders');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#44403C] hover:bg-[#EFE9DD] flex items-center gap-2"
                >
                  <Package className="w-4 h-4" /> My Orders
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      handleNav('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#1A362B] bg-[#E8F3ED] flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#1A362B]" /> Admin Dashboard
                  </button>
                )}
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    handleNav('home');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1A362B] text-white font-medium text-center tracking-wide"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
