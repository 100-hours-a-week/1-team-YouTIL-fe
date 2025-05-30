export const GITHUB_AUTH_SCOPE =
  'read:user user:email read:org repo';

  const generateState = () => window.crypto.randomUUID();

  export const getGithubAuthUrl = (clientId: string) => {
    const state = generateState();
    sessionStorage.setItem('oauthState', state);
  
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(
      GITHUB_AUTH_SCOPE
    )}&state=${state}`;
  };
