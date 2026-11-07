import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSigningIn: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isSigningIn: false,
  signInWithGoogle: async () => {},
  logout: async () => {},
  authError: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const signingInRef = useRef<boolean>(false);

  const isAdmin = user?.email === 'contact.elimarath@gmail.com' && !!user.emailVerified;

  // Intercept internal benign popup cancellation rejections from Firebase SDK
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reasonMsg = event.reason?.message || String(event.reason || '');
      const reasonCode = event.reason?.code || '';
      if (
        reasonMsg.includes('Pending promise was never set') ||
        reasonMsg.includes('cancelled-popup-request') ||
        reasonCode === 'auth/cancelled-popup-request' ||
        reasonCode === 'auth/popup-closed-by-user'
      ) {
        event.preventDefault(); // Suppress false-positive runtime crash
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user profile to Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) {
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Visitor',
              photoURL: currentUser.photoURL || '',
              role: currentUser.email === 'contact.elimarath@gmail.com' ? 'admin' : 'user',
              createdAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.warn('User profile sync note:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (signingInRef.current) {
      return; // Prevent duplicate overlapping popup operations
    }
    signingInRef.current = true;
    setIsSigningIn(true);
    setAuthError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      const code = err?.code;
      const msg = err?.message || '';

      // Gracefully handle normal user actions (closing popup window or tab)
      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        msg.includes('cancelled-popup-request') ||
        msg.includes('popup-closed-by-user') ||
        msg.includes('Pending promise was never set')
      ) {
        // Ignored as expected user dismiss action
        return;
      }
      console.warn('Google Sign-in status:', msg);
      setAuthError(msg || 'Authentication could not be completed.');
    } finally {
      signingInRef.current = false;
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await fbSignOut(auth);
    } catch (err: any) {
      console.warn('Sign-out error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isSigningIn, signInWithGoogle, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
