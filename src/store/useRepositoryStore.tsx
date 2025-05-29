import { create } from 'zustand';

interface Repository {
  repositoryId: number;
  repositoryName: string;
}

interface useRepositoryState {
  selectedRepository: Repository | null;
  setSelectedRepository: (repo: Repository | null) => void;
  clearRepository: () => void;
}

export const useRepositoryStore = create<useRepositoryState>((set) => ({
  selectedRepository: null,
  setSelectedRepository: (repo) => set({ selectedRepository: repo }),
  clearRepository: () => set({ selectedRepository: null }),
}));
