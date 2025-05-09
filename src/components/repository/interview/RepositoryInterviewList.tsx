'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface InterviewItem{
  tilId: number;
  title: string;
  createdAt: string;
}

const RepositoryInterviewList = () => {
    const [data, setData] = useState<InterviewItem[]>([]);

  useEffect(() => {
    const today = new Date();
    const formatted = format(today, 'yyyy-MM-dd');
  }, []);

  return (
    <div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>
      <div>asdf</div>


    </div>
  );
};

export default RepositoryInterviewList;
