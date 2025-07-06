'use client';

import { useRouter } from 'next/navigation';

export default function useSaveScrollAndNavigate(key: string) {
  const router = useRouter();

  const navigate = (to: string) => {
    const scrollY =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    sessionStorage.setItem(`scroll-restore:${key}`, scrollY.toString());
    router.push(to);
  };

  return navigate;
}
