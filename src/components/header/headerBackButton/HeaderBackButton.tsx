'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import backicon from 'public/backicon.png';
import './HeaderBackButton.scss';

const HeaderBackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="back-icon">
      <button onClick={handleBack}>
        <Image
          src={backicon}
          alt="backicon"
          width={50}
          height={50}
          priority
          />
      </button>
    </div>
  );
};


export default HeaderBackButton;
