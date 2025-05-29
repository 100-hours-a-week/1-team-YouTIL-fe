import { create } from 'zustand';

interface SelectedOrganization {
  organization_id: number;
  organization_name: string;
}

interface useOrganizationState {
  selectedOrganization: SelectedOrganization | null;
  setSelectedOrganization: (org: SelectedOrganization | null) => void;
  clearOrganization: () => void;
}

export const useOrganizationStore = create<useOrganizationState>((set) => ({
  selectedOrganization: null,
  setSelectedOrganization: (org) => set({ selectedOrganization: org }),
  clearOrganization: () => set({ selectedOrganization: null }),
}));
