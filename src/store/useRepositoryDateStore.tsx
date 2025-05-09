import { create } from 'zustand';

interface RepositoryDateState {
  tilDate: string;
  interviewDate: string;
  setTilDate: (date: string) => void;
  setInterviewDate: (date: string) => void;
  resetDates: () => void;
}

export const useRepositoryDateStore = create<RepositoryDateState>((set, get) => ({
  tilDate: '',
  interviewDate: '',

  setTilDate: (date: string) => {
    set({ tilDate: date });
  },

  setInterviewDate: (date: string) => {
    set({ interviewDate: date });
  },

  resetDates: () => {
    set({ tilDate: '', interviewDate: '' });
  },
}));
