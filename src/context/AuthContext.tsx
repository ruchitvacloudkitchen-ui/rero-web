import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isMockMode } from '../lib/mockMode';
import { signInWithGoogle, signOutUser, subscribeToAuthChanges, toAppUser } from '../services/authService';
import type { AppUser } from '../types';

const MOCK_STORAGE_KEY = 'rero_mock_signed_in_user';

function readMockUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signIn: () => Promise<AppUser>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => (isMockMode() ? readMockUser() : null));
  const [loading, setLoading] = useState(!isMockMode());

  useEffect(() => {
    if (isMockMode()) return;
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser ? toAppUser(firebaseUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async () => {
        if (isMockMode()) {
          // No real Firebase config to sign in against — simulate a Google
          // sign-in so the booking flow stays testable without real keys.
          const mockUser: AppUser = {
            uid: 'mock-user-local',
            displayName: 'Guest User',
            email: 'guest@example.com',
            phoneNumber: null,
            photoUrl: null,
            isAnonymous: false,
          };
          localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));
          setUser(mockUser);
          return mockUser;
        }
        const signedIn = await signInWithGoogle();
        setUser(signedIn);
        return signedIn;
      },
      signOut: async () => {
        if (isMockMode()) {
          localStorage.removeItem(MOCK_STORAGE_KEY);
          setUser(null);
          return;
        }
        await signOutUser();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
