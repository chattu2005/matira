import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { validateCoupon } from '../services/orderService';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedWeight?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  coupon: Coupon | null;
  couponDiscount: number;
  couponError: string | null;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCouponCode: () => void;
  shippingFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  grandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'matira_cart_items_v2';
const COUPON_STORAGE_KEY = 'matira_cart_coupon_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const freeShippingThreshold = 799;

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [items]);

  // Persist coupon
  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Coupon storage error:', e);
    }
  }, [coupon]);

  // Recalculate subtotal
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Recalculate coupon discount whenever subtotal or coupon changes
  useEffect(() => {
    if (!coupon || subtotal === 0) {
      setCouponDiscount(0);
      return;
    }

    if (subtotal < coupon.minOrderValue) {
      setCouponDiscount(0);
      setCouponError(`Add items worth ₹${coupon.minOrderValue - subtotal} more to use ${coupon.code}`);
      return;
    }

    setCouponError(null);
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }
    setCouponDiscount(Math.min(discount, subtotal));
  }, [subtotal, coupon]);

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 50;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  const addToCart = (product: Product, quantity = 1, selectedWeight?: string) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.productId === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        // Check stock limit
        if (newQty > product.stockQuantity) {
          updated[existingIdx].quantity = product.stockQuantity;
        } else {
          updated[existingIdx].quantity = newQty;
        }
        return updated;
      } else {
        const initialQty = Math.min(quantity, Math.max(1, product.stockQuantity));
        return [
          ...prev,
          {
            productId: product.id,
            product,
            quantity: initialQty,
            selectedWeight: selectedWeight || product.weight
          }
        ];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const maxAvailable = item.product.stockQuantity || 999;
          return {
            ...item,
            quantity: Math.min(quantity, maxAvailable)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch (e) {}
  };

  const applyCouponCode = async (code: string): Promise<boolean> => {
    setCouponError(null);
    const res = await validateCoupon(code, subtotal);
    if (res.valid && res.coupon) {
      setCoupon(res.coupon);
      setCouponDiscount(res.discount);
      return true;
    } else {
      setCouponError(res.error || 'Invalid coupon code');
      return false;
    }
  };

  const removeCouponCode = () => {
    setCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
