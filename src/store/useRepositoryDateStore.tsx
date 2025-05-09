import { create } from 'zustand';

interface RepositoryDateStore {
  activeTab: 'til' | 'interview';
  setActiveTab: (tab: 'til' | 'interview') => void;

  tilDate: string;
  interviewDate: string;
  setTilDate: (date: string) => void;
  setInterviewDate: (date: string) => void;
}

export const useRepositoryDateStore = create<RepositoryDateStore>((set) => ({
  activeTab: 'til',
  setActiveTab: (tab) => set({ activeTab: tab }),

  tilDate: '',
  interviewDate: '',
  setTilDate: (date) => set({ tilDate: date }),
  setInterviewDate: (date) => set({ interviewDate: date }),
}));
