import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, DeliveryAddress, Coupon, Order } from '../types';

// Fetch customer profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
  }
  return null;
}

// Save or update customer profile
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await setDoc(
    doc(db, 'users', profile.id),
    {
      ...profile,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
}

// Fetch addresses for customer
export async function getCustomerAddresses(customerId: string): Promise<DeliveryAddress[]> {
  try {
    const q = query(
      collection(db, 'addresses'),
      where('customerId', '==', customerId)
    );
    const snap = await getDocs(q);
    const list: DeliveryAddress[] = [];
    snap.forEach((d) => list.push({ ...d.data(), id: d.id } as DeliveryAddress));
    return list;
  } catch (err) {
    console.error('Error fetching addresses:', err);
    return [];
  }
}

// Save or create customer address
export async function saveCustomerAddress(address: DeliveryAddress): Promise<DeliveryAddress> {
  const addressId = address.id || `addr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const toSave: DeliveryAddress = {
    ...address,
    id: addressId,
    updatedAt: new Date().toISOString()
  };
  if (!address.id) {
    toSave.createdAt = new Date().toISOString();
  }

  // If set to default, unset other defaults
  if (toSave.isDefault && toSave.customerId) {
    try {
      const existing = await getCustomerAddresses(toSave.customerId);
      for (const item of existing) {
        if (item.id && item.id !== addressId && item.isDefault) {
          await updateDoc(doc(db, 'addresses', item.id), { isDefault: false });
        }
      }
    } catch (e) {
      console.warn('Error clearing old default addresses:', e);
    }
  }

  await setDoc(doc(db, 'addresses', addressId), toSave, { merge: true });
  return toSave;
}

// Delete customer address
export async function deleteCustomerAddress(addressId: string): Promise<void> {
  await deleteDoc(doc(db, 'addresses', addressId));
}

// Admin: Get all registered customers with their order stats
export async function getAllCustomersAdmin(): Promise<
  Array<UserProfile & { orderCount: number; totalSpend: number }>
> {
  try {
    const [usersSnap, ordersSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'orders'))
    ]);

    const ordersByUser: Record<string, { count: number; total: number }> = {};
    ordersSnap.forEach((d) => {
      const ord = d.data() as Order;
      if (!ordersByUser[ord.customerId]) {
        ordersByUser[ord.customerId] = { count: 0, total: 0 };
      }
      ordersByUser[ord.customerId].count += 1;
      ordersByUser[ord.customerId].total += ord.total;
    });

    const customers: Array<UserProfile & { orderCount: number; totalSpend: number }> = [];
    usersSnap.forEach((d) => {
      const user = d.data() as UserProfile;
      customers.push({
        ...user,
        orderCount: ordersByUser[user.id]?.count || 0,
        totalSpend: ordersByUser[user.id]?.total || 0
      });
    });

    return customers;
  } catch (err) {
    console.error('Error fetching admin customers:', err);
    return [];
  }
}

// Admin: Get all coupons
export async function getAllCouponsAdmin(): Promise<Coupon[]> {
  try {
    const snap = await getDocs(collection(db, 'coupons'));
    const list: Coupon[] = [];
    snap.forEach((d) => list.push(d.data() as Coupon));
    return list;
  } catch (err) {
    console.error('Error fetching coupons:', err);
    return [];
  }
}

// Admin: Save coupon
export async function saveCouponAdmin(coupon: Coupon): Promise<void> {
  const ref = doc(db, 'coupons', coupon.id);
  await setDoc(ref, coupon, { merge: true });
}

// Admin: Delete coupon
export async function deleteCouponAdmin(couponId: string): Promise<void> {
  await deleteDoc(doc(db, 'coupons', couponId));
}
