import { create } from 'zustand';

interface CommitQueryGuardState {
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;
}

export const useCommitQueryGuardStore = create<CommitQueryGuardState>((set) => ({
  isLocked: true,
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
}));
