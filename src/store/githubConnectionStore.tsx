import { create } from 'zustand';

interface GithubConnectionState {
  isGithubConnected: boolean;
  setConnected: () => void;
  resetConnected: () => void;
}

export const useGithubConnectionStore = create<GithubConnectionState>((set) => ({
  isGithubConnected: false,
  setConnected: () => set({ isGithubConnected: true }),
  resetConnected: () => set({ isGithubConnected: false }),
}));
