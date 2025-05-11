'use client';

import { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import './TechNews.scss';

interface NewsItem {
  title: string;
  link: string;
  thumbnail: string;
  createdAt: string;
  summary: string;
}

const TechNews = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true);
  const [isSliding, setIsSliding] = useState(false);

  const { data } = useQuery({
    queryKey: ['tech-news'],
    queryFn: async () => {
      const res = await callApi<{ data: { news: NewsItem[] } }>({
        method: 'GET',
        endpoint: '/news',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res.data.news;
    },
  });

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current || !data) return;
    const container = scrollRef.current;
    const itemWidth = 300 + 96;
    container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });

    setIsSliding(true);
    setTimeout(() => setIsSliding(false), 500);
  };

  const scrollByItem = (direction: 'left' | 'right', userTriggered = false) => {
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
  };

  useEffect(() => {
    if (!data || !autoSlideEnabled) return;

    intervalRef.current = setInterval(() => {
      scrollByItem('right');
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [data, autoSlideEnabled]);

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
            <img src={news.thumbnail} alt={news.title} className="technews__thumbnail" />
            <div className="technews__gradient" />
            <div className="technews__headline">{news.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TechNews;
