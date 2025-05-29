'use client';

import Image from 'next/image';
import Link from 'next/link';

const HeaderLogo = () => {
  return (
    <Link href="/" className="header-logo">
      <Image
        src="/images/youtilLogo.png"
        alt="YouTIL Logo"
        width={180}
        height={50}
        priority
      />
    </Link>
  );
};

export default HeaderLogo;
