import { create } from 'zustand';

interface Repository {
  repositoryId: number;
  repositoryName: string;
}

interface UserRepositoryState {
  selectedRepository: Repository | null;
  setRepository: (repo: Repository) => void;
}

export const useUserRepositoryStore = create<UserRepositoryState>((set) => ({
  selectedRepository: null,
  setRepository: (repo) => set({ selectedRepository: repo }),
}));
