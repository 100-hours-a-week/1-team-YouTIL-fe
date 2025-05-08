import { create } from 'zustand';

interface RepositoryDateState {
  tilDate: string;
  interviewDate: string;
  setTilDate: (date: string) => void;
  setInterviewDate: (date: string) => void;
  resetDates: () => void;
}

export const useRepositoryDateStore = create<RepositoryDateState>((set) => ({
  tilDate: '',
  interviewDate: '',
  setTilDate: (date) => set({ tilDate: date }),
  setInterviewDate: (date) => set({ interviewDate: date }),
  resetDates: () => set({ tilDate: '', interviewDate: '' }),
}));
