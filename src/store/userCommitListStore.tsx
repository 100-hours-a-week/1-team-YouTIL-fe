import { create } from 'zustand';

interface Commit {
  sha: string;
  commit_message: string;
}

interface CommitListState {
  commits: Commit[];
  setCommits: (commits: Commit[]) => void;
  resetCommits: () => void;
}

export const useCommitListStore = create<CommitListState>((set) => ({
  commits: [],
  setCommits: (commits) => set({ commits }),
  resetCommits: () => set({ commits: [] }),
}));
