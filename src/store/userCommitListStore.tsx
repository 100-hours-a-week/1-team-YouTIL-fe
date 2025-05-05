import { create } from 'zustand';

interface CommitListState {
  commitMessages: string[];
  setCommitMessages: (messages: string[]) => void;
  resetCommitMessages: () => void;
}

export const useCommitListStore = create<CommitListState>((set) => ({
  commitMessages: [],
  setCommitMessages: (messages) => set({ commitMessages: messages }),
  resetCommitMessages: () => set({ commitMessages: [] }),
}));
