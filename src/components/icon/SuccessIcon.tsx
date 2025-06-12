'use client';

import Image from 'next/image';

import './Icon.scss';

const SuccessIcon = () => {
  return (
    <div className="icon icon--success">
      <Image src="/images/successIcon.png" alt="성공 아이콘" width={40} height={40} />
    </div>
  );
};

export default SuccessIcon;
