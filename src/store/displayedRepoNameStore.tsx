import { create } from 'zustand';

interface DisplayedRepoNameState {
  repoName: string;
  setRepoName: (name: string) => void;
  clearRepoName: () => void;
}

export const useDisplayedRepoNameStore = create<DisplayedRepoNameState>((set) => ({
  repoName: '',
  setRepoName: (name) => set({ repoName: name }),
  clearRepoName: () => set({ repoName: '' }),
}));
