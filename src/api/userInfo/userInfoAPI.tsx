import useAuthStore from '@/store/authStore';
import useUserInfoStore from '@/store/userInfoStore';

const getUserInfo = async () => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const setUserInfo = useUserInfoStore.getState().setUserInfo;

    const response = await fetch('http://34.22.84.164:8080/api/v1/users?userId=2', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const result = await response.json();
    const { userId, name, profileUrl, description } = result.data;

    setUserInfo({ userId, name, profileUrl, description });

    return result.data;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
    throw error;
  }
};

export default getUserInfo;
