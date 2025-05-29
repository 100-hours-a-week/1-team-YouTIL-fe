import { create } from 'zustand';

interface CommitQueryGuardState {
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;
}

export const useCommitQueryGuardStore = create<CommitQueryGuardState>((set) => ({
  isLocked: false,
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
}));
