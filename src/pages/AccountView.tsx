import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  LogOut,
  ShoppingBag,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Order, DeliveryAddress, Product } from '../types';
import { getCustomerOrders } from '../services/orderService';
import {
  getCustomerAddresses,
  saveCustomerAddress,
  deleteCustomerAddress,
  saveUserProfile
} from '../services/userService';
import { ProductCard } from '../components/ProductCard';

interface AccountViewProps {
  initialTab?: string;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenAuth: () => void;
  onNavigateToShop: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  initialTab = 'orders',
  allProducts,
  onSelectProduct,
  onOpenAuth,
  onNavigateToShop
}) => {
  const { currentUser, userProfile, isAdmin, logout, refreshProfile } = useAuth();
  const { wishlistIds } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>(
    (initialTab as any) || 'orders'
  );

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Addresses state
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);

  // Profile edit state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileName(userProfile?.displayName || '');
      setProfilePhone(userProfile?.phoneNumber || '');

      // Load Orders
      setLoadingOrders(true);
      getCustomerOrders(currentUser.uid).then((ordList) => {
        setOrders(ordList);
        setLoadingOrders(false);
      });

      // Load Addresses
      getCustomerAddresses(currentUser.uid).then((addrs) => {
        setAddresses(addrs);
      });
    }
  }, [currentUser, userProfile]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-[#EFE9DD] rounded-full flex items-center justify-center mx-auto text-[#1A362B]">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif-heading text-2xl font-bold text-[#1C1917]">
          Sign In to Your Account
        </h2>
        <p className="text-xs sm:text-sm text-[#78716C]">
          Access your recent grocery orders, track live dispatch status, and manage saved delivery addresses.
        </p>
        <button
          onClick={onOpenAuth}
          className="w-full py-3 px-6 bg-[#1A362B] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#2D5A47] shadow-md transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Handle Save Address
  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAddr: DeliveryAddress = {
      id: editingAddress?.id,
      customerId: currentUser.uid,
      fullName: String(formData.get('fullName')),
      phoneNumber: String(formData.get('phoneNumber')),
      addressLine1: String(formData.get('addressLine1')),
      addressLine2: String(formData.get('addressLine2')) || undefined,
      landmark: String(formData.get('landmark')) || undefined,
      city: String(formData.get('city')),
      state: String(formData.get('state')),
      postalCode: String(formData.get('postalCode')),
      country: 'India',
      isDefault: formData.get('isDefault') === 'on'
    };

    await saveCustomerAddress(newAddr);
    setShowAddressModal(false);
    setEditingAddress(null);
    const updated = await getCustomerAddresses(currentUser.uid);
    setAddresses(updated);
  };

  // Handle Delete Address
  const handleDeleteAddress = async (addrId: string) => {
    if (!confirm('Are you sure you want to remove this address?')) return;
    await deleteCustomerAddress(addrId);
    setAddresses((prev) => prev.filter((a) => a.id !== addrId));
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    setProfileSaving(true);
    await saveUserProfile({
      ...userProfile,
      displayName: profileName.trim(),
      phoneNumber: profilePhone.trim()
    });
    await refreshProfile();
    setProfileSaving(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  // Filter wishlist products
  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Header */}
      <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1A362B] text-[#EAD098] flex items-center justify-center font-serif-heading text-2xl font-bold">
            {userProfile?.displayName?.charAt(0) || 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#1C1917]">
                {userProfile?.displayName}
              </h1>
              {isAdmin && (
                <span className="text-[10px] uppercase font-bold text-[#1A362B] bg-[#E8F3ED] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#78716C]">{currentUser.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 border border-[#E7E2D9] text-[#B91C1C] hover:bg-[#FEF2F2] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {/* Main Account Tabs & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3 space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#1A362B] text-white'
                : 'text-[#57534E] hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#1A362B] text-white'
                : 'text-[#57534E] hover:bg-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'wishlist'
                ? 'bg-[#1A362B] text-white'
                : 'text-[#57534E] hover:bg-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlistIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#1A362B] text-white'
                : 'text-[#57534E] hover:bg-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Tab Content (9 cols) */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-lg font-bold text-[#1C1917]">
                Order History
              </h2>

              {loadingOrders ? (
                <div className="bg-white p-8 rounded-2xl border border-[#E7E2D9] text-center text-xs text-[#78716C]">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-[#E7E2D9] text-center space-y-3">
                  <Package className="w-10 h-10 text-[#A8A29E] mx-auto" />
                  <h3 className="font-serif-heading text-base font-bold text-[#1C1917]">No orders yet</h3>
                  <p className="text-xs text-[#78716C]">You haven't placed any orders yet. Start your journey with our Rajasthan whole cumin and cold-pressed oils!</p>
                  <button
                    onClick={onNavigateToShop}
                    className="px-5 py-2 bg-[#1A362B] text-white text-xs font-semibold rounded-xl"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    const isExpanded = expandedOrderId === ord.id;
                    return (
                      <div
                        key={ord.id}
                        className="bg-white rounded-2xl border border-[#E7E2D9] overflow-hidden shadow-xs"
                      >
                        {/* Summary Header */}
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]/50 border-b border-[#E7E2D9]">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#1A362B]">
                                {ord.orderNumber}
                              </span>
                              <span className="capitalize text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E8F3ED] text-[#1A362B]">
                                {ord.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#78716C] mt-0.5">
                              Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <span className="text-base font-bold text-[#1C1917]">
                              ₹{ord.total.toLocaleString('en-IN')}
                            </span>
                            <button
                              onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                              className="text-xs text-[#2D5A47] font-semibold hover:underline"
                            >
                              {isExpanded ? 'Hide Details' : 'View Details'}
                            </button>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="p-4 sm:p-5 space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {ord.items.map((item, idx) => (
                              <span key={idx} className="text-xs bg-[#FAF8F5] border border-[#E7E2D9] px-2.5 py-1 rounded-lg text-[#57534E]">
                                {item.name} ({item.weight}) × {item.quantity}
                              </span>
                            ))}
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="pt-4 mt-3 border-t border-[#E7E2D9] space-y-4 animate-fade-in">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                  <p className="font-bold text-[#1C1917] mb-1">Delivery Address</p>
                                  <p className="text-[#57534E]">{ord.deliveryAddress.fullName}</p>
                                  <p className="text-[#57534E]">{ord.deliveryAddress.addressLine1}</p>
                                  {ord.deliveryAddress.addressLine2 && <p className="text-[#57534E]">{ord.deliveryAddress.addressLine2}</p>}
                                  <p className="text-[#57534E]">{ord.deliveryAddress.city}, {ord.deliveryAddress.state} - {ord.deliveryAddress.postalCode}</p>
                                </div>
                                <div>
                                  <p className="font-bold text-[#1C1917] mb-1">Payment & Dispatch</p>
                                  <p className="text-[#57534E]">Method: {ord.paymentMethod.toUpperCase()}</p>
                                  <p className="text-[#57534E]">Tracking Number: {ord.trackingNumber || 'Pending Dispatch'}</p>
                                  {ord.appliedCoupon && (
                                    <p className="text-[#15803D]">Coupon Applied: {ord.appliedCoupon.code} (-₹{ord.couponDiscount})</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-heading text-lg font-bold text-[#1C1917]">
                  Delivery Addresses
                </h2>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressModal(true);
                  }}
                  className="px-3.5 py-2 bg-[#1A362B] text-white text-xs font-semibold rounded-xl hover:bg-[#2D5A47] flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#E7E2D9] text-center space-y-2">
                  <MapPin className="w-8 h-8 text-[#A8A29E] mx-auto" />
                  <p className="text-xs text-[#78716C]">No saved addresses. Add your home or workplace address for faster 1-click checkout.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white p-5 rounded-2xl border border-[#E7E2D9] space-y-3 relative"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-sm text-[#1C1917]">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="ml-2 text-[10px] uppercase font-bold bg-[#E8F3ED] text-[#1A362B] px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingAddress(addr);
                              setShowAddressModal(true);
                            }}
                            className="p-1.5 text-[#78716C] hover:text-[#1A362B] rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => addr.id && handleDeleteAddress(addr.id)}
                            className="p-1.5 text-[#78716C] hover:text-[#B91C1C] rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-[#57534E] space-y-0.5">
                        <p>{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        {addr.landmark && <p>Near {addr.landmark}</p>}
                        <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                        <p className="pt-1 font-medium text-[#1C1917]">Phone: {addr.phoneNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h2 className="font-serif-heading text-lg font-bold text-[#1C1917]">
                Saved Wishlist Items
              </h2>

              {wishlistProducts.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-[#E7E2D9] text-center space-y-3">
                  <Heart className="w-10 h-10 text-[#A8A29E] mx-auto" />
                  <h3 className="font-serif-heading text-base font-bold text-[#1C1917]">Your wishlist is empty</h3>
                  <p className="text-xs text-[#78716C]">Save your favorite pure spices, cold-pressed oils and dals to purchase anytime.</p>
                  <button
                    onClick={onNavigateToShop}
                    className="px-5 py-2 bg-[#1A362B] text-white text-xs font-semibold rounded-xl"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-[#E7E2D9] p-6 sm:p-8 max-w-xl space-y-6">
              <h2 className="font-serif-heading text-lg font-bold text-[#1C1917]">
                Personal Information
              </h2>

              {profileSuccess && (
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#15803D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email || ''}
                    className="w-full text-xs px-3 py-2.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl text-[#78716C]"
                  />
                  <p className="text-[11px] text-[#A8A29E] mt-1">Email is tied to your login credentials.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#E7E2D9] rounded-xl focus:outline-none focus:border-[#1A362B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 bg-[#1A362B] text-white text-xs font-semibold rounded-xl hover:bg-[#2D5A47] transition-all disabled:opacity-50"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Address Edit/Add Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E7E2D9] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-heading text-lg font-bold text-[#1C1917]">
              {editingAddress ? 'Edit Address' : 'Add New Delivery Address'}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">Full Name *</label>
                <input
                  name="fullName"
                  required
                  defaultValue={editingAddress?.fullName || userProfile?.displayName || ''}
                  className="w-full text-xs px-3 py-2 border border-[#E7E2D9] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">Phone Number *</label>
                <input
                  name="phoneNumber"
                  required
                  defaultValue={editingAddress?.phoneNumber || userProfile?.phoneNumber || ''}
                  className="w-full text-xs px-3 py-2 border border-[#E7E2D9] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">Street Address *</label>
                <input
                  name="addressLine1"
                  required
                  defaultValue={editingAddress?.addressLine1 || ''}
                  className="w-full text-xs px-3 py-2 border border-[#E7E2D9] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">Area / Flat</label>
                  <input
                    name="addressLine2"
                    defaultValue={editingAddress?.addressLine2 || ''}
                    className="w-full text-xs px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">Landmark</label>
                  <input
                    name="landmark"
                    defaultValue={editingAddress?.landmark || ''}
                    className="w-full text-xs px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">City *</label>
                  <input
                    name="city"
                    required
                    defaultValue={editingAddress?.city || 'Kolkata'}
                    className="w-full text-xs px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">State *</label>
                  <input
                    name="state"
                    required
                    defaultValue={editingAddress?.state || 'West Bengal'}
                    className="w-full text-xs px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">PIN Code *</label>
                  <input
                    name="postalCode"
                    required
                    maxLength={6}
                    defaultValue={editingAddress?.postalCode || ''}
                    className="w-full text-xs px-3 py-2 border border-[#E7E2D9] rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-[#44403C] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDefault"
                    defaultChecked={editingAddress?.isDefault || addresses.length === 0}
                    className="rounded text-[#1A362B]"
                  />
                  <span>Set as default delivery address</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E7E2D9]">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border border-[#E7E2D9] text-[#57534E] text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A362B] text-white text-xs font-semibold rounded-xl hover:bg-[#2D5A47]"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
