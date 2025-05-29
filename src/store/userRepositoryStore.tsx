import { create } from 'zustand';

interface Repository {
  repositoryId: number;
  repositoryName: string;
}

interface UserRepositoryState {
  selectedRepository: Repository | null;
  setRepository: (repo: Repository | null) => void;
  clearRepository: () => void;
}

export const useUserRepositoryStore = create<UserRepositoryState>((set) => ({
  selectedRepository: null,
  setRepository: (repo) => set({ selectedRepository: repo }),
  clearRepository: () => set({ selectedRepository: null }),
}));
