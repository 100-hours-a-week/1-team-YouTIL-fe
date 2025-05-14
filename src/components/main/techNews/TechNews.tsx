'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import './TechNews.scss';
import useAuthStore from '@/store/authStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';

interface NewsItem {
  title: string;
  link: string;
  thumbnail: string;
  createdAt: string;
  summary: string;
}

const TechNews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
  const [isSliding, setIsSliding] = useState(false);
  const [data, setData] = useState<NewsItem[] | null>(null);

  const fetchNews = useCallback(async () => {
    const accessToken = useGetAccessToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/news`, {
        method: 'GET',
        credentials: 'include',
	      headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch tech news');
      }

      const json = await res.json();
      setData(json.data.news);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current || !data) return;
    const container = scrollRef.current;
    const itemWidth = 300 + 96;
    container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });

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

  return (
    <div className="technews">
      <div className="technews__controls">
        <button onClick={() => scrollByItem('left', true)}>&lt;</button>
        <button onClick={() => scrollByItem('right', true)}>&gt;</button>
      </div>

      <div className="technews__wrapper" ref={scrollRef}>
        {data?.map((news, index) => (
          <a
            key={index}
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`technews__item ${isSliding ? 'no-hover' : ''}`}
          >
            <Image
              src={news.thumbnail}
              alt={news.title}
              width={300}
              height={180}
              className="technews__thumbnail"
              unoptimized
            />
            <div className="technews__gradient" />
            <div className="technews__headline">{news.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TechNews;
