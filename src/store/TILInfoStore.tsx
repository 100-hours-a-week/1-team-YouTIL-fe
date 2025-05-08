import { create } from 'zustand';

interface TILInfoState {
  title: string;
  category: string;
  visibility: 'public' | 'private';
  setTILInfo: (info: { title: string; category: string; visibility: 'public' | 'private' }) => void;
  resetTILInfo: () => void;
}

export const useTILInfoStore = create<TILInfoState>((set) => ({
  title: '',
  category: '풀스택',
  visibility: 'public',
  setTILInfo: ({ title, category, visibility }) => set({ title, category, visibility }),
  resetTILInfo: () => set({ title: '', category: '풀스택', visibility: 'public' }),
}));
