import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

const LOCAL_STORAGE_KEY = 'accessToken';
const SESSION_STORAGE_KEY = 'oauthState';
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,

      setAccessToken: (token: string) => set({ accessToken: token }),

      clearAuth: () => {
        set({ accessToken: null });

        if (typeof window !== 'undefined') {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      },
    }),
    {
      name: LOCAL_STORAGE_KEY,
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
