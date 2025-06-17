'use client';

import { useEffect, useRef } from 'react';

interface UseInfinityScrollObserverProps {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const useInfinityScrollObserver = <T extends HTMLElement = HTMLDivElement>({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UseInfinityScrollObserverProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<T | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      }
    );

    observerRef.current.observe(target);

    return () => {
      observerRef.current?.disconnect();
    };
    
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return loadMoreRef;
};
