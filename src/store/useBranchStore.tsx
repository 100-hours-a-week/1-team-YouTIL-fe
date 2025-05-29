import { create } from 'zustand';

interface Branch {
  branchName: string;
}

interface BranchState {
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
  clearBranch: () => void;
}

export const useBranchStore = create<BranchState>((set) => ({
  selectedBranch: null,
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  clearBranch: () => set({ selectedBranch: null }),
}));
