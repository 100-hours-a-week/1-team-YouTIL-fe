import { create } from 'zustand';

interface OtherUserInfo {
  userId: number | null;
  name: string | null;
  profileUrl: string | null;
  description: string | null;
}

interface OtherUserInfoState {
  otherUserInfo: OtherUserInfo;
  setOtherUserInfo: (data: OtherUserInfo) => void;
  clearOtherUserInfo: () => void;
}

const useOtherUserInfoStore = create<OtherUserInfoState>((set) => ({
  otherUserInfo: {
    userId: null,
    name: null,
    profileUrl: null,
    description: null,
  },
  setOtherUserInfo: (data) => set({ otherUserInfo: data }),
  clearOtherUserInfo: () =>
    set({
      otherUserInfo: {
        userId: null,
        name: null,
        profileUrl: null,
        description: null,
      },
    }),
}));

export default useOtherUserInfoStore;
