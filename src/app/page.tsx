'use client';

import { redirect } from 'next/navigation';
import Heatmap from '@/components/main/heatmap/Heatmap';

const main = () => {
  // redirect('/login');
  return (
    <div>
      <Heatmap/>
    </div>
  )
};

export default main;
