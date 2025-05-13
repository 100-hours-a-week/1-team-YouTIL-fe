import { create } from 'zustand';

interface Branch {
  branchName: string;
}

interface UserBranchState {
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
  clearBranch: () => void;
}

export const useUserBranchStore = create<UserBranchState>((set) => ({
  selectedBranch: null,
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  clearBranch: () => set({ selectedBranch: null }),
}));
