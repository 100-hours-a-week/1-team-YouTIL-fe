'use client';

import { useEffect } from 'react';

export default function useScrollRestoreOnReturn(key: string) {
  const STORAGE_KEY = `scroll-restore:${key}`;

  useEffect(() => {
    const savedY = sessionStorage.getItem(STORAGE_KEY);
    if (!savedY) return;

    const y = parseInt(savedY, 10);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.scrollTo({ top: y, behavior: 'auto' });
        sessionStorage.removeItem(STORAGE_KEY);
      });
    });
  }, [STORAGE_KEY]);
}
