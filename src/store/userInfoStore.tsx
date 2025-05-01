// /store/userInfoStore.ts
import { create } from 'zustand';

interface UserInfo {
  userId: number | null;
  name: string | null;
  profileUrl: string | null;
  description: string | null;
}

interface UserInfoState {
  userInfo: UserInfo;
  setUserInfo: (data: UserInfo) => void;
  clearUserInfo: () => void;
}

const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: {
    userId: null,
    name: null,
    profileUrl: null,
    description: null,
  },
  setUserInfo: (data) => set({ userInfo: data }),
  clearUserInfo: () =>
    set({
      userInfo: {
        userId: null,
        name: null,
        profileUrl: null,
        description: null,
      },
    }),
}));

export default useUserInfoStore;
