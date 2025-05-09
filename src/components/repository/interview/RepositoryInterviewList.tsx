'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';

interface InterviewItem{
  tilId: number;
  title: string;
  createdAt: string;
}

const RepositoryInterviewList = () => {
  const setInterviewDate = useRepositoryDateStore((state) => state.setInterviewDate);
    const [data, setData] = useState<InterviewItem[]>([]);

  // 현재 날짜 저장
  useEffect(() => {
    const today = new Date();
    const formatted = format(today, 'yyyy-MM-dd');
    setInterviewDate(formatted);
  }, [setInterviewDate]);

  return (
    <div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>
    </div>
  );
};

export default RepositoryInterviewList;
