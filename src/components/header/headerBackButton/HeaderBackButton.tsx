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
      <button onClick={handleBack} className="back-icon__button">
        <Image
          src={backicon}
          alt="backicon"
          width={50}
          height={50}
          priority
          className="back-icon__image"
        />
      </button>
    </div>
  );
};

export default HeaderBackButton;
