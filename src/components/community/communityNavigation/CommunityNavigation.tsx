'use client';

import { useEffect } from 'react';
import { useCommunityNavigationStore } from '@/store/useCommunityNavigationStore';
import './CommunityNavigation.scss';

const CommunityNavigation = () => {
  const { selectedCategory, setCategory } = useCommunityNavigationStore();

  const categories = [
    { label: '전체', value: 'ENTIRE' },
    { label: '풀스택', value: 'FULLSTACK' },
    { label: '인공지능', value: 'AI' },
    { label: '클라우드', value: 'CLOUD' },
  ] as const;

  useEffect(() => {
    if (selectedCategory === null) {
      setCategory('ENTIRE');
    }
  }, [selectedCategory, setCategory]);

  const getLabel = (value: string) =>
    categories.find((c) => c.value === value)?.label ?? '';

  return (
    <div className="community-nav">
      <div className="community-nav__button-wrapper">
        {categories.map((category) => (
          <button
            key={category.value}
            className={`community-nav__button ${
              selectedCategory === category.value ? 'community-nav__button--active' : ''
            }`}
            onClick={() => setCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="community-nav__text-wrapper">
          <p className="community-nav__description">
            <span className="community-nav__category">{getLabel(selectedCategory)}</span> 게시판 입니다
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityNavigation;
