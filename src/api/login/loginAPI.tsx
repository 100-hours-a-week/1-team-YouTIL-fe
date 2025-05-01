const GithubLogin = async (authorizationCode: string) => {
    try {
      const res = await fetch('http://34.22.84.164:8080/api/v1/users/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorizationCode,
        }),
      });
  
      if (!res.ok) {
        throw new Error(`서버 응답 오류: ${res.status}`);
      }
  
      const response = await res.json();

      return response.data;
    } catch (error) {
      console.error('GitHub 로그인 오류:', error);
      throw error;
    }
  };
  
  export default GithubLogin;