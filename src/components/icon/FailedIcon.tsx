'use client';

import Image from 'next/image';

import './Icon.scss';

const FailedIcon = () => {
  return (
    <div className="icon icon--failed">
      <Image src="/images/failedIcon.png" alt="실패 아이콘" width={40} height={40} />
    </div>
  );
};

export default FailedIcon;
