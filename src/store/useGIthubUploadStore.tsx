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

interface GithubUploadState {
  draftOrg: DraftOrganization | null;
  draftRepo: DraftRepository | null;
  draftBranch: DraftBranch | null;

  organizationId: number | null;
  repositoryId: number | null;
  branchName: string | null;

  setDraftOrg: (org: DraftOrganization | null) => void;
  setDraftRepo: (repo: DraftRepository | null) => void;
  setDraftBranch: (branch: DraftBranch | null) => void;

  setOrganizationId: (org: DraftOrganization | null) => void;
  setRepositoryId: (repo: DraftRepository | null) => void;
  setBranchName: (branch: DraftBranch | null) => void;

  commitUploadTarget: () => void;
  resetDraft: () => void;
  resetAll: () => void;
}

export const useGithubUploadStore = create<GithubUploadState>((set, get) => ({
  draftOrg: null,
  draftRepo: null,
  draftBranch: null,

  organizationId: null,
  repositoryId: null,
  branchName: null,

  setDraftOrg: (org) => set({ draftOrg: org }),
  setDraftRepo: (repo) => set({ draftRepo: repo }),
  setDraftBranch: (branch) => set({ draftBranch: branch }),

  setOrganizationId: (org) => set({ organizationId: org?.organization_id ?? null }),
  setRepositoryId: (repo) => set({ repositoryId: repo?.repositoryId ?? null }),
  setBranchName: (branch) => set({ branchName: branch?.branchName ?? null }),

  commitUploadTarget: () => {
    const { draftOrg, draftRepo, draftBranch } = get();
    set({
      organizationId: draftOrg?.organization_id ?? null,
      repositoryId: draftRepo?.repositoryId ?? null,
      branchName: draftBranch?.branchName ?? null,
    });
  },

  resetDraft: () =>
    set({
      draftOrg: null,
      draftRepo: null,
      draftBranch: null,
    }),

  resetAll: () =>
    set({
      draftOrg: null,
      draftRepo: null,
      draftBranch: null,
      organizationId: null,
      repositoryId: null,
      branchName: null,
    }),
}));
