import { create } from 'zustand';

interface SelectedCommitListState {
  selectedCommitMessages: string[];
  setSelectedCommitMessages: (messages: string[]) => void;
  resetSelectedCommitMessages: () => void;
}

export const useSelectedCommitListStore = create<SelectedCommitListState>((set) => ({
  selectedCommitMessages: [],
  setSelectedCommitMessages: (messages) => set({ selectedCommitMessages: messages }),
  resetSelectedCommitMessages: () => set({ selectedCommitMessages: [] }),
}));
