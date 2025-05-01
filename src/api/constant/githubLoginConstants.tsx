export const GITHUB_AUTH_SCOPE =
  'read:user user:email read:org repo';

export const getGithubAuthUrl = (clientId: string) =>
  `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(
    GITHUB_AUTH_SCOPE
  )}`;
