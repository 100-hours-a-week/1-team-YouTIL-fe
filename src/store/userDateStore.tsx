import { create } from 'zustand';

interface SelectedDateState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const useSelectedDateStore = create<SelectedDateState>((set) => ({
  selectedDate: '',
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
