'use client';

import { useRouter } from 'next/navigation';

const HeaderBackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button onClick={handleBack}>
      ← 뒤로가기
    </button>
  );
};


export default HeaderBackButton;
