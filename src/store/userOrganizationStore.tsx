import { create } from 'zustand';

interface SelectedOrganization {
  organization_id: number;
  organization_name: string;
}

interface UserOrganizationState {
  selectedOrganization: SelectedOrganization | null;
  setSelectedOrganization: (org: SelectedOrganization | null) => void;
  clearOrganization: () => void;
}

export const useUserOrganizationStore = create<UserOrganizationState>((set) => ({
  selectedOrganization: null,
  setSelectedOrganization: (org) => set({ selectedOrganization: org }),
  clearOrganization: () => set({ selectedOrganization: null }),
}));
