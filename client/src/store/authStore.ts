import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tenantSlug: string;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      tenantSlug: (import.meta as unknown as { env: Record<string, string> }).env.VITE_TENANT_SLUG || 'autoescuela-angu',
      login: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
      setAccessToken: (token) => set({ accessToken: token }),
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user, refreshToken: s.refreshToken, tenantSlug: s.tenantSlug }) }
  )
);
