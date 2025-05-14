import useAuthStore from '@/store/authStore';  

export const refreshAccess = async () => {
  const setAccessToken = useAuthStore.getState().setAccessToken;
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) return;

  try {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/news`, {
      method: 'GET',
      headers: {
            Authorization: `Bearer ${accessToken}`,
        },
      credentials:'include',
    });

    const authHeader = response.headers.get('authorization');
    console.log(response);

    if (authHeader?.startsWith('Bearer ')) {
      const newAccessToken = authHeader.replace('Bearer ', '').trim();

      setAccessToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
    }
  } catch (err) {
    console.error('accessToken 확인 실패:', err);
  }
};
