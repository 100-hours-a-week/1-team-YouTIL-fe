import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token: string) => set({ accessToken: token }),
      clearAuth: () => set({ accessToken: null }),
    }),
    {
      name: 'accessToken',
      storage: {
        getItem: (name) => {
          const token = localStorage.getItem(name);
          return token ? { state: { accessToken: token }, version: 0 } : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, value.state.accessToken ?? '');
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

export default useAuthStore;
