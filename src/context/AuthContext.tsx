import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  User,
  setPersistence,
  browserLocalPersistence,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { Capacitor } from '@capacitor/core';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize GoogleAuth for native environments using the plugin registry
    const initNativeAuth = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Sneaky import to hide from Rollup static analysis
          const pkg = ['@codetrix-studio', 'capacitor-google-auth'].join('/');
          const { GoogleAuth } = await import(/* @vite-ignore */ pkg).catch(() => ({ GoogleAuth: null }));
          if (GoogleAuth) {
            await GoogleAuth.initialize();
          }
        } catch (e) {
          console.error('Native Auth initialization failed', e);
        }
      }
    };
    
    initNativeAuth();

    // Ensure persistence is set to local so session survives app restart
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // Check for redirect result on mount (Web only)
    if (!Capacitor.isNativePlatform()) {
      getRedirectResult(auth).then((result) => {
        if (result) {
          console.log('Redirect successful', result.user);
        }
      }).catch((err) => {
        console.error('Redirect sign-in error', err);
        setError(err.message || 'Authentication failed during redirect.');
      });
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        localStorage.setItem('user_uid', u.uid);
      } else {
        localStorage.removeItem('user_uid');
      }
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      if (Capacitor.isNativePlatform()) {
        // --- NATIVE LOGIN (APK) ---
        // Sneaky import to hide from Rollup static analysis
        const pkg = ['@codetrix-studio', 'capacitor-google-auth'].join('/');
        const { GoogleAuth } = await import(/* @vite-ignore */ pkg);
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        await signInWithCredential(auth, credential);
      } else {
        // --- WEB LOGIN (PREVIEW) ---
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
      }
    } catch (err: any) {
      console.error('Login failed', err);
      // Fallback for missing module or native error
      if (err.message?.includes('Cannot find module') || err.name === 'TypeError') {
        setError('Login bridge unavailable. Please ensure your APK is synced properly.');
      } else {
        setError(err.message || 'Login initiation failed.');
      }
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const pkg = ['@codetrix-studio', 'capacitor-google-auth'].join('/');
        const { GoogleAuth } = await import(/* @vite-ignore */ pkg);
        await GoogleAuth.signOut();
      }
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
