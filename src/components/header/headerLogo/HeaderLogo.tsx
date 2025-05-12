'use client';

import Image from 'next/image';
import Link from 'next/link';
import logo from 'public/logo.png';

const HeaderLogo = () => {
  return (
    <Link href="/" className="header-logo">
      <Image
        src={logo}
        alt="YouTIL Logo"
        width={180}
        height={50}
        priority
      />
    </Link>
  );
};

export default HeaderLogo;
