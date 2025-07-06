'use client';

import { create } from 'zustand';

type ProfileTab = 'til' | 'guestbook';

interface ProfileNavState {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
}

export const useProfileNavStore = create<ProfileNavState>((set) => ({
  activeTab: 'guestbook',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
