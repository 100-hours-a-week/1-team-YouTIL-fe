import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  clearOAuthState: () => void;
  clearAuth: () => void;
}

const SESSION_STORAGE_KEY = 'oauthState';

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,

  setAccessToken: (token: string) => set({ accessToken: token }),

  clearAccessToken: () => {
    set({ accessToken: null });
  },

  clearOAuthState: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  },

  clearAuth: () => {
    useAuthStore.getState().clearAccessToken();
    useAuthStore.getState().clearOAuthState();
  },
}));

export default useAuthStore;
