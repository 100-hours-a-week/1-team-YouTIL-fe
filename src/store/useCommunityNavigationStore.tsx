import { create } from 'zustand';

type Category = 'ENTIRE' | 'FULLSTACK' | 'AI' | 'CLOUD' | null;

interface CommunityNavigationState {
  selectedCategory: Category;
  setCategory: (category: Category) => void;
}

export const useCommunityNavigationStore = create<CommunityNavigationState>((set) => ({
  selectedCategory: null,
  setCategory: (category) => set({ selectedCategory: category }),
}));
