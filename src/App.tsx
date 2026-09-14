import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { HomeView } from './pages/HomeView';
import { ShopView } from './pages/ShopView';
import { CategoriesView } from './pages/CategoriesView';
import { ProductDetailView } from './pages/ProductDetailView';
import { CartView } from './pages/CartView';
import { CheckoutView } from './pages/CheckoutView';
import { OrderSuccessView } from './pages/OrderSuccessView';
import { AccountView } from './pages/AccountView';
import { AdminDashboardView } from './pages/AdminDashboardView';
import { AboutView } from './pages/AboutView';
import { ContactView } from './pages/ContactView';
import { PolicyView } from './pages/PolicyView';
import { Product, Category, Order } from './types';
import { getStoreProducts, getStoreCategories } from './services/productService';

type ViewType =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'categories'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'account'
  | 'admin'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'shipping-policy'
  | 'refund-policy';

function MainApp() {
  const { currentUser, isAdmin } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [accountInitialTab, setAccountInitialTab] = useState<string>('orders');

  // Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Products & Categories Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Load initial store data
  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        getStoreProducts(),
        getStoreCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

  // Handlers for Navigation
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryFilter(categoryId);
    setCurrentView('shop');
  };

  const handleNavigateToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleOrderSuccess = (order: Order) => {
    setLastOrder(order);
    setCurrentView('order-success');
  };

  const handleOpenAccount = (tab: string = 'orders') => {
    setAccountInitialTab(tab);
    if (!currentUser) {
      setIsAuthOpen(true);
    } else {
      setCurrentView('account');
    }
  };

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'home') {
      setCurrentView('home');
    } else if (view === 'shop') {
      setSelectedCategoryFilter(param || null);
      setCurrentView('shop');
    } else if (view === 'categories') {
      setCurrentView('categories');
    } else if (view === 'about') {
      setCurrentView('about');
    } else if (view === 'contact') {
      setCurrentView('contact');
    } else if (view === 'cart') {
      setCurrentView('cart');
    } else if (view === 'checkout') {
      handleNavigateToCheckout();
    } else if (view === 'account') {
      handleOpenAccount(param || 'profile');
    } else if (view === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView(view as any);
    }
  };

  // If in Admin Dashboard view, render admin interface
  if (currentView === 'admin') {
    return (
      <AdminDashboardView
        products={products}
        categories={categories}
        onRefreshData={loadData}
        onExitAdmin={() => setCurrentView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#EAD098] selection:text-[#1A362B]">
      {/* Top Global Announcement Bar */}
      <div className="bg-[#142A21] text-[#EAD098] text-[11px] font-semibold tracking-wider py-2 px-4 text-center border-b border-[#234436]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline">🌿 100% Pure, Stone-Ground Spices & Kachi Ghani Cold-Pressed Oils</span>
          <span className="mx-auto sm:mx-0">
            🚚 FREE Pan-India Shipping on Orders Over <strong>₹799</strong> | Code: <strong>WELCOME10</strong>
          </span>
          <span className="hidden sm:inline">📍 Newtown, Kolkata Hub</span>
        </div>
      </div>

      {/* Primary Sticky Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        categories={categories}
        onNavigateHome={() => setCurrentView('home')}
        onNavigateShop={(catId) => {
          setSelectedCategoryFilter(catId || null);
          setCurrentView('shop');
        }}
        onNavigateCategories={() => setCurrentView('categories')}
        onNavigateAbout={() => setCurrentView('about')}
        onNavigateContact={() => setCurrentView('contact')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={handleOpenAccount}
        onOpenAdmin={() => setCurrentView('admin')}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeView
            products={products}
            categories={categories}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
            onNavigate={handleNavigate}
            onNavigateShop={() => {
              setSelectedCategoryFilter(null);
              setCurrentView('shop');
            }}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            products={products}
            categories={categories}
            initialCategory={selectedCategoryFilter}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesView
            categories={categories}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            onNavigateBack={() => setCurrentView('shop')}
            onNavigateToCheckout={handleNavigateToCheckout}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            onNavigateToCheckout={handleNavigateToCheckout}
            onNavigateToShop={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            onOrderSuccess={handleOrderSuccess}
            onNavigateToCart={() => setCurrentView('cart')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === 'order-success' && lastOrder && (
          <OrderSuccessView
            order={lastOrder}
            onContinueShopping={() => setCurrentView('shop')}
            onViewMyOrders={() => {
              setAccountInitialTab('orders');
              setCurrentView('account');
            }}
          />
        )}

        {currentView === 'account' && (
          <AccountView
            initialTab={accountInitialTab}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigateToShop={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'about' && <AboutView />}

        {currentView === 'contact' && <ContactView />}

        {(currentView === 'privacy' ||
          currentView === 'terms' ||
          currentView === 'shipping-policy' ||
          currentView === 'refund-policy') && (
          <PolicyView type={currentView} />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onNavigateHome={() => setCurrentView('home')}
        onNavigateShop={(catId) => {
          setSelectedCategoryFilter(catId || null);
          setCurrentView('shop');
        }}
        onNavigateCategories={() => setCurrentView('categories')}
        onNavigateAbout={() => setCurrentView('about')}
        onNavigateContact={() => setCurrentView('contact')}
      />

      {/* Persistent WhatsApp Support Widget */}
      <WhatsAppFloat />

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleNavigateToCheckout}
        onNavigateToShop={() => {
          setIsCartOpen(false);
          setCurrentView('shop');
        }}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
        onSelectCategory={handleSelectCategory}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          if (currentView === 'checkout') {
            // keep on checkout
          } else {
            setCurrentView('account');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainApp />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
