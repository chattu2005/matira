import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Users,
  Tag,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  DollarSign,
  Search,
  Filter,
  ExternalLink,
  Bell,
  Settings,
  RefreshCw,
  LogOut,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_PRIMARY_EMAIL } from '../lib/firebase';
import { Product, Category, Order, UserProfile, Coupon } from '../types';
import {
  saveProduct,
  deleteProduct,
  saveCategory,
  deleteCategory,
  updateProductStock
} from '../services/productService';
import {
  getAllOrdersAdmin,
  updateOrderStatus,
  getRecentNotificationsAdmin
} from '../services/orderService';
import {
  getAllCustomersAdmin,
  getAllCouponsAdmin,
  saveCouponAdmin,
  deleteCouponAdmin
} from '../services/userService';

interface AdminDashboardViewProps {
  products: Product[];
  categories: Category[];
  onRefreshData: () => Promise<void>;
  onExitAdmin: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  products,
  categories,
  onRefreshData,
  onExitAdmin
}) => {
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'categories' | 'orders' | 'customers' | 'inventory' | 'coupons' | 'notifications'
  >('overview');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Customers State
  const [customers, setCustomers] = useState<Array<UserProfile & { orderCount: number; totalSpend: number }>>([]);
  
  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Coupon Modal State
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Tracking number edit state
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('');

  // Status message
  const [feedback, setFeedback] = useState<string | null>(null);

  // Load Admin Data
  const loadData = async () => {
    setLoadingOrders(true);
    const [ordList, custList, coupList, notifList] = await Promise.all([
      getAllOrdersAdmin(),
      getAllCustomersAdmin(),
      getAllCouponsAdmin(),
      getRecentNotificationsAdmin()
    ]);
    setOrders(ordList);
    setCustomers(custList);
    setCoupons(coupList);
    setNotifications(notifList);
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Auth Guard
  const isAuthorized =
    currentUser &&
    (currentUser.email || '').toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase();

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto text-[#B91C1C]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-serif-heading text-2xl font-bold text-[#1C1917]">Admin Portal Access Restricted</h2>
        <p className="text-xs sm:text-sm text-[#78716C]">
          This control center is exclusively reserved for the primary store administrator (<strong>{ADMIN_PRIMARY_EMAIL}</strong>).
        </p>
        <button
          onClick={onExitAdmin}
          className="px-6 py-2.5 bg-[#1A362B] text-white text-xs font-semibold rounded-xl"
        >
          Return to Store
        </button>
      </div>
    );
  }

  // Derived Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const pendingOrdersCount = orders.filter((o) => ['pending', 'confirmed'].includes(o.status)).length;
  const lowStockCount = products.filter((p) => p.stockQuantity <= 15).length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  // Handle Update Order Status
  const handleStatusChange = async (orderId: string, newStatus: any) => {
    await updateOrderStatus(orderId, newStatus);
    showToast(`Order status updated to ${newStatus}`);
    await loadData();
  };

  // Handle Save Tracking Number
  const handleSaveTracking = async (orderId: string) => {
    await updateOrderStatus(orderId, 'Shipped', trackingNumberInput.trim());
    setEditingTrackingId(null);
    setTrackingNumberInput('');
    showToast('Tracking number attached & marked as Shipped');
    await loadData();
  };

  // Handle Save Product
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prodId = editingProduct?.id || `matira-prod-${Date.now()}`;
    const catId = String(formData.get('categoryId'));
    const catObj = categories.find((c) => c.id === catId);

    const price = Number(formData.get('price'));
    const compareAt = Number(formData.get('compareAtPrice')) || undefined;
    const discount = compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
    const name = String(formData.get('name'));

    const productPayload: Product = {
      id: prodId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: String(formData.get('shortDescription')),
      fullDescription: String(formData.get('description')),
      price,
      compareAtPrice: compareAt,
      discountPercentage: discount,
      weight: String(formData.get('weight')),
      categoryId: catId,
      categoryName: catObj?.name || 'Spices',
      images: [
        String(formData.get('imageUrl')) ||
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
      ],
      stockQuantity: Number(formData.get('stockQuantity')),
      stockStatus: Number(formData.get('stockQuantity')) > 15 ? 'in_stock' : Number(formData.get('stockQuantity')) > 0 ? 'low_stock' : 'out_of_stock',
      isFeatured: formData.get('isFeatured') === 'on',
      isBestSeller: formData.get('isBestSeller') === 'on',
      sku: String(formData.get('sku')) || `MAT-${Date.now().toString().slice(-4)}`,
      ingredients: String(formData.get('ingredients')),
      benefits: [String(formData.get('benefits'))],
      storageInfo: String(formData.get('storageInstructions')),
      isActive: true,
      updatedAt: new Date().toISOString()
    };

    await saveProduct(productPayload);
    setShowProductModal(false);
    setEditingProduct(null);
    showToast('Product saved successfully');
    await onRefreshData();
  };

  // Handle Delete Product
  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await deleteProduct(prodId);
    showToast('Product removed');
    await onRefreshData();
  };

  // Handle Stock Change In-place
  const handleQuickStock = async (prodId: string, qty: number) => {
    await updateProductStock(prodId, qty);
    showToast('Stock quantity updated');
    await onRefreshData();
  };

  // Handle Save Category
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const catName = String(formData.get('name'));
    const catId = editingCategory?.id || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const categoryPayload: Category = {
      id: catId,
      name: catName,
      slug: catId,
      description: String(formData.get('description')),
      image: String(formData.get('image')) || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      displayOrder: editingCategory?.displayOrder || categories.length + 1,
      isActive: true
    };
    await saveCategory(categoryPayload);
    setShowCategoryModal(false);
    setEditingCategory(null);
    showToast('Category updated');
    await onRefreshData();
  };

  // Handle Save Coupon
  const handleSaveCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = String(formData.get('code')).toUpperCase().trim();
    const couponPayload: Coupon = {
      id: `coup-${code}`,
      code,
      discountType: formData.get('discountType') as any,
      discountValue: Number(formData.get('discountValue')),
      minOrderValue: Number(formData.get('minOrderValue')) || 0,
      maxDiscount: Number(formData.get('maxDiscount')) || undefined,
      isActive: true,
      timesUsed: 0
    };
    await saveCouponAdmin(couponPayload);
    setShowCouponModal(false);
    showToast(`Coupon ${code} activated`);
    await loadData();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-20 right-6 z-50 bg-[#1A362B] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-[#EAD098]">
          <CheckCircle2 className="w-4 h-4 text-[#88D49E]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bg-[#142A21] text-white border-b border-[#234436] px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAD098] text-[#142A21] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-heading font-bold text-lg text-white">
                  MATIRA Command Center
                </span>
                <span className="text-[10px] font-bold bg-[#E8F3ED] text-[#1A362B] px-2 py-0.5 rounded">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-[#A3B8AC]">Logged in: {ADMIN_PRIMARY_EMAIL}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={async () => {
                await loadData();
                await onRefreshData();
                showToast('Store catalog & orders synchronized');
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
            </button>
            <button
              onClick={onExitAdmin}
              className="px-4 py-1.5 rounded-lg bg-[#EAD098] hover:bg-[#F2DEC0] text-[#142A21] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> View Public Store
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="bg-white border-b border-[#E7E2D9] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-3 no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-[#1A362B] text-white' : 'text-[#57534E] hover:bg-[#FAF8F5]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-[#1A362B] text-white' : 'text-[#57534E] hover:bg-[#FAF8F5]'
            }`}
          >
            <span>Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#D97706] text-white text-[10px] flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'products' ? 'bg-[#1A362B] text-white' : 'text-[#57534E] hover:bg-[#FAF8F5]'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'inventory' ? 'bg-[#1A362B] text-white' : 'text-[#57534E] hover:bg-[#FAF8F5]'
            }`}
          >
            <span>Inventory</span>
            {lowStockCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#B91C1C] text-white text-[10px] flex items-center justify-center">
                {lowStockCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'categories' ? 'bg-[#1A362B] text-white' : 'text-[#57534E] hover:bg-[#FAF8F5]'
            }`}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'customers' ? 'bg-[#1A362B] text-white' : 'text-[#57534E] hover:bg-[#FAF8F5]'
            }`}
          >
            Customers ({customers.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'coupons' ? 'bg-[#1A362B] text-white' : 'text-[#57534E] hover:bg-[#FAF8F5]'
            }`}
          >
            Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'notifications' ? 'bg-[#1A362B] text-white' : 'text-[#57534E] hover:bg-[#FAF8F5]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Bird & WhatsApp Logs</span>
          </button>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-[#E7E2D9] space-y-2">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Gross Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center">
                    ₹
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#1A362B]">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-[#78716C]">{orders.length} total orders recorded</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E7E2D9] space-y-2">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#D97706]">
                  {pendingOrdersCount}
                </p>
                <p className="text-[11px] text-[#78716C]">Requires packing or dispatch</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E7E2D9] space-y-2">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Products</span>
                  <div className="w-8 h-8 rounded-lg bg-[#E8F3ED] text-[#1A362B] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  {products.length}
                </p>
                <p className="text-[11px] text-[#78716C]">Across {categories.length} categories</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E7E2D9] space-y-2">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Low Stock Warnings</span>
                  <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#B91C1C]">
                  {lowStockCount}
                </p>
                <p className="text-[11px] text-[#78716C]">Items below 15 units</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-heading text-lg font-bold text-[#1C1917]">
                  Recent Customer Orders
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#1A362B] hover:underline"
                >
                  View All Orders
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-[#78716C] py-4 text-center">No orders yet. Place a test order from the store.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E7E2D9] text-[#78716C]">
                        <th className="pb-3 font-semibold">Order</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold">Payment</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E2D9]">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-3 font-bold text-[#1A362B]">{ord.orderNumber}</td>
                          <td className="py-3">
                            <p className="font-semibold text-[#1C1917]">{ord.customerName}</p>
                            <p className="text-[11px] text-[#78716C]">{ord.customerPhone}</p>
                          </td>
                          <td className="py-3 font-bold text-[#1C1917]">₹{ord.total.toLocaleString('en-IN')}</td>
                          <td className="py-3 uppercase text-[10px] font-bold text-[#57534E]">{ord.paymentMethod}</td>
                          <td className="py-3">
                            <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3ED] text-[#1A362B]">
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setActiveTab('orders');
                                setOrderSearch(ord.orderNumber);
                              }}
                              className="text-xs text-[#2D5A47] font-semibold hover:underline"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#1C1917]">
                  Order Fulfillment & Management
                </h2>
                <p className="text-xs text-[#78716C]">
                  View, filter, and dispatch incoming customer orders.
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order, name, phone..."
                    className="text-xs pl-8 pr-3 py-1.5 bg-white border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                  />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 bg-white border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#E7E2D9] overflow-hidden shadow-xs">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#78716C]">
                  No orders match the current search/filter.
                </div>
              ) : (
                <div className="divide-y divide-[#E7E2D9]">
                  {filteredOrders.map((ord) => (
                    <div key={ord.id} className="p-5 space-y-4 hover:bg-[#FAF8F5]/50">
                      {/* Top Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1A362B]">
                              {ord.orderNumber}
                            </span>
                            <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3ED] text-[#1A362B]">
                              {ord.status}
                            </span>
                            <span className="text-[11px] text-[#78716C]">
                              • {new Date(ord.createdAt).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-xs text-[#1C1917] font-semibold mt-0.5">
                            Customer: {ord.customerName} ({ord.customerPhone}) • {ord.customerEmail}
                          </p>
                        </div>

                        {/* Status Select Dropdown */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-[#78716C]">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="text-xs font-bold px-3 py-1.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-lg focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items & Address */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#FAF8F5] p-3 rounded-xl border border-[#E7E2D9]">
                        <div>
                          <p className="font-bold text-[#1C1917] mb-1">Items ({ord.items.length}):</p>
                          <ul className="space-y-1 text-[#57534E]">
                            {ord.items.map((item, idx) => (
                              <li key={idx}>
                                {item.name} ({item.weight}) × {item.quantity} — ₹{item.price * item.quantity}
                              </li>
                            ))}
                          </ul>
                          <div className="pt-2 font-bold text-[#1A362B]">
                            Total Paid: ₹{ord.total.toLocaleString('en-IN')} ({ord.paymentMethod.toUpperCase()})
                          </div>
                        </div>

                        <div>
                          <p className="font-bold text-[#1C1917] mb-1">Delivery Destination:</p>
                          <p className="text-[#57534E]">
                            {ord.deliveryAddress.addressLine1}, {ord.deliveryAddress.city}, {ord.deliveryAddress.state} - {ord.deliveryAddress.postalCode}
                          </p>
                          {ord.deliveryAddress.landmark && (
                            <p className="text-[#78716C]">Landmark: {ord.deliveryAddress.landmark}</p>
                          )}
                          
                          {/* Tracking Number Input */}
                          <div className="pt-2">
                            {editingTrackingId === ord.id ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={trackingNumberInput}
                                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                                  placeholder="Courier Tracking ID (e.g. DELHIVERY123)"
                                  className="text-xs px-2 py-1 bg-white border border-[#E7E2D9] rounded"
                                />
                                <button
                                  onClick={() => handleSaveTracking(ord.id)}
                                  className="px-2 py-1 bg-[#1A362B] text-white rounded text-[11px]"
                                >
                                  Save & Ship
                                </button>
                                <button
                                  onClick={() => setEditingTrackingId(null)}
                                  className="px-2 py-1 text-[#78716C] text-[11px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="text-[#78716C]">
                                  Tracking: <strong>{ord.trackingNumber || 'None Assigned'}</strong>
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingTrackingId(ord.id);
                                    setTrackingNumberInput(ord.trackingNumber || '');
                                  }}
                                  className="text-[#2D5A47] font-semibold underline"
                                >
                                  {ord.trackingNumber ? 'Edit' : 'Assign Tracking'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#1C1917]">
                  Product Catalog
                </h2>
                <p className="text-xs text-[#78716C]">
                  Add, edit, or remove pure grocery items and whole spices.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductModal(true);
                }}
                className="px-4 py-2 bg-[#1A362B] text-white text-xs font-semibold rounded-xl hover:bg-[#2D5A47] flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#E7E2D9] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E2D9] text-[#78716C] bg-[#FAF8F5]">
                      <th className="p-4 font-semibold">Product</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Weight</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Stock</th>
                      <th className="p-4 font-semibold">Badges</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2D9]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-[#F5F2EB] shrink-0"
                            />
                            <div>
                              <p className="font-bold text-[#1C1917]">{p.name}</p>
                              <p className="text-[10px] text-[#78716C]">SKU: {p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[#57534E]">{p.categoryName}</td>
                        <td className="p-4 text-[#57534E]">{p.weight}</td>
                        <td className="p-4 font-bold text-[#1A362B]">₹{p.price.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span
                            className={`font-semibold ${
                              p.stockQuantity <= 15 ? 'text-[#B91C1C]' : 'text-[#15803D]'
                            }`}
                          >
                            {p.stockQuantity} units
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {p.isBestSeller && (
                              <span className="text-[9px] font-bold bg-[#1A362B] text-[#EAD098] px-1.5 py-0.5 rounded">
                                Bestseller
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="text-[9px] font-bold bg-[#8B5E3C] text-white px-1.5 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setShowProductModal(true);
                              }}
                              className="p-1 text-[#78716C] hover:text-[#1A362B]"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1 text-[#78716C] hover:text-[#B91C1C]"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-heading text-xl font-bold text-[#1C1917]">
                Quick Stock & Inventory Control
              </h2>
              <p className="text-xs text-[#78716C]">
                Instantly adjust inventory levels with real-time Firestore synchronization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white p-4 rounded-2xl border space-y-3 ${
                    p.stockQuantity <= 15 ? 'border-[#FECACA] bg-[#FEF2F2]/20' : 'border-[#E7E2D9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover bg-[#F5F2EB]"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#1C1917] truncate">{p.name}</p>
                      <p className="text-[11px] text-[#78716C]">
                        {p.categoryName} • {p.weight}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E7E2D9]">
                    <span className="text-xs font-semibold text-[#57534E]">Available Stock:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuickStock(p.id, Math.max(0, p.stockQuantity - 5))}
                        className="px-2 py-1 bg-[#FAF8F5] border border-[#E7E2D9] rounded hover:bg-[#EFE9DD] text-xs font-bold"
                      >
                        -5
                      </button>
                      <span className="text-xs font-bold text-[#1C1917] min-w-8 text-center">
                        {p.stockQuantity}
                      </span>
                      <button
                        onClick={() => handleQuickStock(p.id, p.stockQuantity + 10)}
                        className="px-2 py-1 bg-[#FAF8F5] border border-[#E7E2D9] rounded hover:bg-[#EFE9DD] text-xs font-bold"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#1C1917]">
                  Store Departments & Categories
                </h2>
                <p className="text-xs text-[#78716C]">
                  Configure navigation collections and imagery.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setShowCategoryModal(true);
                }}
                className="px-4 py-2 bg-[#1A362B] text-white text-xs font-semibold rounded-xl hover:bg-[#2D5A47] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-[#E7E2D9] overflow-hidden shadow-xs"
                >
                  <img src={c.image} alt={c.name} className="w-full h-36 object-cover" />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#1C1917]">{c.name}</h3>
                      <button
                        onClick={() => {
                          setEditingCategory(c);
                          setShowCategoryModal(true);
                        }}
                        className="p-1 text-[#78716C] hover:text-[#1A362B]"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-[#78716C] line-clamp-2">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-heading text-xl font-bold text-[#1C1917]">
                Customer Accounts & Order Volumes
              </h2>
              <p className="text-xs text-[#78716C]">
                Insights into registered customers, order frequency, and cumulative value.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E7E2D9] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E7E2D9] text-[#78716C] bg-[#FAF8F5]">
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Contact Email</th>
                      <th className="p-4 font-semibold">Phone Number</th>
                      <th className="p-4 font-semibold">Total Orders</th>
                      <th className="p-4 font-semibold text-right">Lifetime Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2D9]">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF8F5]">
                        <td className="p-4 font-bold text-[#1C1917]">{c.displayName}</td>
                        <td className="p-4 text-[#57534E]">{c.email}</td>
                        <td className="p-4 text-[#57534E]">{c.phoneNumber || '—'}</td>
                        <td className="p-4 font-semibold text-[#1A362B]">{c.orderCount} orders</td>
                        <td className="p-4 text-right font-bold text-[#1C1917]">
                          ₹{c.totalSpend.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-[#1C1917]">
                  Discounts & Coupon Codes
                </h2>
                <p className="text-xs text-[#78716C]">
                  Configure percentage and flat promotional codes.
                </p>
              </div>
              <button
                onClick={() => setShowCouponModal(true)}
                className="px-4 py-2 bg-[#1A362B] text-white text-xs font-semibold rounded-xl hover:bg-[#2D5A47] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coup) => (
                <div key={coup.id} className="bg-white p-5 rounded-2xl border border-[#E7E2D9] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm font-mono text-[#1A362B] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#E7E2D9]">
                      {coup.code}
                    </span>
                    <button
                      onClick={async () => {
                        await deleteCouponAdmin(coup.id);
                        showToast(`Coupon ${coup.code} removed`);
                        await loadData();
                      }}
                      className="p-1 text-[#78716C] hover:text-[#B91C1C]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-[#1C1917]">
                    {coup.discountType === 'percentage'
                      ? `${coup.discountValue}% Discount (Max ₹${coup.maxDiscount || 'No Limit'})`
                      : `Flat ₹${coup.discountValue} Discount`}
                  </p>
                  <p className="text-[11px] text-[#78716C]">
                    Min order threshold: ₹{coup.minOrderValue}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif-heading text-xl font-bold text-[#1C1917]">
                Notification Audit Log
              </h2>
              <p className="text-xs text-[#78716C]">
                Real-time tracking of automated Bird Email & WhatsApp Cloud API notifications.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 space-y-4">
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E7E2D9] text-xs text-[#57534E] space-y-2">
                <p className="font-bold text-[#1A362B] flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#1A362B]" /> Third-Party Messaging Services Status
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <strong>Bird Email Channel:</strong> Active in production when <code>EMAIL_SERVICE_API_KEY</code> is set in settings.
                  </div>
                  <div>
                    <strong>WhatsApp Cloud API:</strong> Active when <code>WHATSAPP_API_TOKEN</code> is set.
                  </div>
                </div>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-[#78716C] text-center py-6">
                  No notifications recorded in this session yet. Notifications are created automatically upon order placement.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E7E2D9] text-[#78716C]">
                        <th className="pb-3 font-semibold">Order</th>
                        <th className="pb-3 font-semibold">Recipient</th>
                        <th className="pb-3 font-semibold">Channel</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Logged At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E2D9]">
                      {notifications.map((n) => (
                        <tr key={n.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-3 font-bold text-[#1A362B]">{n.orderNumber}</td>
                          <td className="py-3">{n.recipient}</td>
                          <td className="py-3 uppercase font-bold text-[10px] text-[#57534E]">{n.channel}</td>
                          <td className="py-3">
                            <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F3ED] text-[#1A362B]">
                              {n.status}
                            </span>
                          </td>
                          <td className="py-3 text-[11px] text-[#78716C]">
                            {new Date(n.timestamp).toLocaleTimeString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#E7E2D9] p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-heading text-xl font-bold text-[#1C1917]">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#44403C] mb-1">Product Name *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingProduct?.name || ''}
                    placeholder="e.g. Pure Whole Cumin Seeds (Jeera)"
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#44403C] mb-1">Category *</label>
                  <select
                    name="categoryId"
                    required
                    defaultValue={editingProduct?.categoryId || categories[0]?.id}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-[#44403C] mb-1">Selling Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    required
                    defaultValue={editingProduct?.price || 500}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#44403C] mb-1">MRP / Compare At (₹)</label>
                  <input
                    name="compareAtPrice"
                    type="number"
                    defaultValue={editingProduct?.compareAtPrice || 599}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#44403C] mb-1">Pack Size / Net Weight *</label>
                  <input
                    name="weight"
                    required
                    defaultValue={editingProduct?.weight || '1 kg'}
                    placeholder="e.g. 1 kg, 500g"
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#44403C] mb-1">Stock Quantity *</label>
                  <input
                    name="stockQuantity"
                    type="number"
                    required
                    defaultValue={editingProduct?.stockQuantity ?? 100}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#44403C] mb-1">SKU Code</label>
                  <input
                    name="sku"
                    defaultValue={editingProduct?.sku || ''}
                    placeholder="e.g. MAT-CUM-1001"
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#44403C] mb-1">High-Res Image URL</label>
                <input
                  name="imageUrl"
                  defaultValue={editingProduct?.images?.[0] || ''}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#44403C] mb-1">Short Description *</label>
                <input
                  name="shortDescription"
                  required
                  defaultValue={editingProduct?.shortDescription || ''}
                  placeholder="e.g. Sun-dried Rajasthan cumin seeds rich in natural aromatic oils."
                  className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#44403C] mb-1">Full Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct?.description || ''}
                  className="w-full p-3 border border-[#E7E2D9] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#44403C] mb-1">Ingredients</label>
                  <input
                    name="ingredients"
                    defaultValue={editingProduct?.ingredients || '100% Pure Natural Whole Product'}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#44403C] mb-1">Benefits</label>
                  <input
                    name="benefits"
                    defaultValue={editingProduct?.benefits || 'Rich in natural bio-actives and essential oils.'}
                    className="w-full px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={editingProduct?.isFeatured}
                    className="rounded text-[#1A362B]"
                  />
                  <span>Featured on Home Page</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    defaultChecked={editingProduct?.isBestSeller}
                    className="rounded text-[#1A362B]"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E7E2D9]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-[#E7E2D9] rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1A362B] text-white rounded-xl font-semibold hover:bg-[#2D5A47]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#E7E2D9] p-6 shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917]">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Category Name *</label>
                <input
                  name="name"
                  required
                  defaultValue={editingCategory?.name || ''}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  defaultValue={editingCategory?.description || ''}
                  className="w-full p-3 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Cover Image URL *</label>
                <input
                  name="image"
                  required
                  defaultValue={editingCategory?.image || ''}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A362B] text-white rounded-xl font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#E7E2D9] p-6 shadow-2xl space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917]">
              Create New Coupon
            </h3>
            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code (Uppercase) *</label>
                <input
                  name="code"
                  required
                  placeholder="e.g. FESTIVE20"
                  className="w-full px-3 py-2 border rounded-xl uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Discount Type *</label>
                  <select name="discountType" className="w-full px-3 py-2 border rounded-xl">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Value *</label>
                  <input
                    name="discountValue"
                    type="number"
                    required
                    placeholder="10 or 100"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Min Order Value (₹)</label>
                  <input
                    name="minOrderValue"
                    type="number"
                    defaultValue={499}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Discount Cap (₹)</label>
                  <input
                    name="maxDiscount"
                    type="number"
                    placeholder="e.g. 200"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A362B] text-white rounded-xl font-semibold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
