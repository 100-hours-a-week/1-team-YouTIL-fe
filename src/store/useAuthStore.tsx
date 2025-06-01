import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
}

const SESSION_STORAGE_KEY = 'oauthState';

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,

  setAccessToken: (token: string) => set({ accessToken: token }),

  clearAuth: () => {
    set({ accessToken: null });

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  },
}));

export default useAuthStore;
