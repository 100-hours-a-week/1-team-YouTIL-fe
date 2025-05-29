import { create } from 'zustand';

interface DraftOrganization {
  organization_id: number;
  organization_name: string;
}

interface DraftRepository {
  repositoryId: number;
  repositoryName: string;
}

interface DraftBranch {
  branchName: string;
}

interface DraftSelectionState {
  draftOrg: DraftOrganization | null;
  draftRepo: DraftRepository | null;
  draftBranch: DraftBranch | null;

  setDraftOrg: (org: DraftOrganization | null) => void;
  setDraftRepo: (repo: DraftRepository | null) => void;
  setDraftBranch: (branch: DraftBranch | null) => void;

  setOrgAndReset: (org: DraftOrganization | null) => void;

  resetDraft: () => void;
}

export const useDraftSelectionStore = create<DraftSelectionState>((set) => ({
  draftOrg: null,
  draftRepo: null,
  draftBranch: null,

  setDraftOrg: (org) => set({ draftOrg: org }),
  setDraftRepo: (repo) => set({ draftRepo: repo }),
  setDraftBranch: (branch) => set({ draftBranch: branch }),

  setOrgAndReset: (org) =>
    set({
      draftOrg: org,
      draftRepo: null,
      draftBranch: null,
    }),

  resetDraft: () =>
    set({
      draftOrg: null,
      draftRepo: null,
      draftBranch: null,
    }),
}));
