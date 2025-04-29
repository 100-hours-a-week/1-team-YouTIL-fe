'use client';

import { useRouter } from 'next/navigation';

const HeaderBackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button onClick={handleBack} style={buttonStyle}>
      ← 뒤로가기
    </button>
  );
};

const buttonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
  color: '#333',
};

export default HeaderBackButton;
