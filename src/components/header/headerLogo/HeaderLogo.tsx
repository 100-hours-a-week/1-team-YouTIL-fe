'use client';

import Image from 'next/image';
import logo from 'public/logo.png';

const HeaderLogo = () => {
  return (
    <div>
      <Image
        src={logo}
        alt="YouTIL Logo"
        width={180}
        height={50}
        priority
      />
    </div>
  );
};

export default HeaderLogo;
