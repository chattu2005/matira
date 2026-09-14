import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, ADMIN_PRIMARY_EMAIL } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync profile & admin status from Firestore and server verification
  const syncUserData = async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      const isAuthorizedAdmin = (user.email || '').toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase();

      if (isAuthorizedAdmin) {
        // Register in admins collection if not present
        try {
          await setDoc(
            doc(db, 'admins', user.uid),
            {
              email: user.email,
              role: 'super_admin',
              addedAt: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (adminErr) {
          console.warn('[MATIRA] Admin registry sync notice:', adminErr);
        }
      }

      let profileData: UserProfile;

      if (userSnap.exists()) {
        profileData = userSnap.data() as UserProfile;
        if (isAuthorizedAdmin && profileData.role !== 'admin') {
          profileData.role = 'admin';
          await setDoc(userDocRef, { role: 'admin' }, { merge: true });
        }
      } else {
        profileData = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Valued Customer',
          phoneNumber: user.phoneNumber || '',
          role: isAuthorizedAdmin ? 'admin' : 'customer',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profileData);
      }

      setUserProfile(profileData);
      setIsAdmin(isAuthorizedAdmin);
    } catch (err) {
      console.error('[MATIRA] Profile sync error:', err);
      // Fallback
      setUserProfile({
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Customer',
        role: (user.email || '').toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase() ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      });
      setIsAdmin((user.email || '').toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserData(user);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    if (cred.user) {
      await syncUserData(cred.user);
    }
  };

  const register = async (email: string, pass: string, name: string, phone?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      const isAuthorizedAdmin = email.trim().toLowerCase() === ADMIN_PRIMARY_EMAIL.toLowerCase();
      const newProfile: UserProfile = {
        id: cred.user.uid,
        email: email.trim(),
        displayName: name,
        phoneNumber: phone || '',
        role: isAuthorizedAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
      setIsAdmin(isAuthorizedAdmin);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await syncUserData(currentUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        login,
        register,
        logout,
        resetPassword,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
