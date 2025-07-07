import { create } from 'zustand';

type Category = 'ENTIRE' | 'FULLSTACK' | 'AI' | 'CLOUD';

interface CommunityNavigationState {
  selectedCategory: Category;
  setCategory: (category: Category) => void;
}

export const useCommunityNavigationStore = create<CommunityNavigationState>((set) => ({
  selectedCategory: 'ENTIRE',
  setCategory: (category) => set({ selectedCategory: category }),
}));
