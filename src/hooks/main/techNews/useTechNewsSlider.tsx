import { useCallback, useEffect, useRef, useState } from 'react';

const THUMNAIL_WIDTH = 300;
const THUMNAIL_GAP = 96; // = 6rem (16px * 6)
const ITEM_WIDTH = THUMNAIL_WIDTH + THUMNAIL_GAP;

interface NewsItem {
  title: string;
  link: string;
  thumbnail: string;
  createdAt: string;
  summary: string;
}

export const useTechNewsSlider = (data?: NewsItem[]) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
  const [isSliding, setIsSliding] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current || !data) return;
    const container = scrollRef.current;
    container.scrollTo({ left: index * ITEM_WIDTH, behavior: 'smooth' });

    setIsSliding(true);
    setTimeout(() => setIsSliding(false), 500);
  }, [data]);

  const scrollByItem = useCallback(
    (direction: 'left' | 'right', userTriggered = false) => {
      if (!scrollRef.current || !data) return;

      if (userTriggered) setAutoSlideEnabled(false);

      const container = scrollRef.current;
      const itemWidth = 300 + 96;
      const currentScroll = container.scrollLeft;
      const index = Math.round(currentScroll / itemWidth);

      const nextIndex =
        direction === 'right'
          ? (index + 1) % data.length
          : (index - 1 + data.length) % data.length;

      scrollToIndex(nextIndex);
    },
    [data, scrollToIndex]
  );

  useEffect(() => {
    if (!data || !autoSlideEnabled) return;

    intervalRef.current = setInterval(() => {
      scrollByItem('right');
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [data, autoSlideEnabled, scrollByItem]);

  return {
    scrollRef,
    scrollByItem,
    isSliding,
  };
};
