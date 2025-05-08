import { create } from 'zustand';

interface CommitItem {
  commit_message: string;
  sha: string;
}

interface SelectedCommitListState {
  selectedCommits: CommitItem[];
  setSelectedCommits: (commits: CommitItem[]) => void;
  resetSelectedCommits: () => void;
}

export const useSelectedCommitListStore = create<SelectedCommitListState>((set) => ({
  selectedCommits: [],
  setSelectedCommits: (commits) => set({ selectedCommits: commits }),
  resetSelectedCommits: () => set({ selectedCommits: [] }),
}));
