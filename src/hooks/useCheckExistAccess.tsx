const useCheckAccess = (accessToken: string | null | undefined): boolean => {
  return Boolean(accessToken && accessToken.trim() !== '');
};

export default useCheckAccess;