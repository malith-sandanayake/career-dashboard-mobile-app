import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../services/firebase';

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
    // Ensure persistence is set to local so session survives app restart
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // Check for redirect result on mount
    getRedirectResult(auth).then((result) => {
      if (result) {
        console.log('Redirect successful', result.user);
      }
    }).catch((err) => {
      console.error('Redirect sign-in error', err);
      setError(err.message || 'Authentication failed during redirect.');
    });

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
    const provider = new GoogleAuthProvider();
    // Force account selection to ensure fresh state
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithRedirect(auth, provider);
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.message || 'Login initiation failed.');
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
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
