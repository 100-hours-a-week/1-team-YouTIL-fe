'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      document.body.scrollTo({ top: 0, behavior: 'auto' })
    });
  }, [pathname]);

  return null;
}
