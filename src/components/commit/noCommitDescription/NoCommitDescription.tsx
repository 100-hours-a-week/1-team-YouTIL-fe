'use client';

import Image from 'next/image';
import './NoCommitDescription.scss';

const NoCommitDescription = () => {
  return (
    <section className="no-commit">
      <Image
        className="no-commit__image"
        src="/images/youtilSadLogo.png"
        alt="nocommit"
        width={60}
        height={80}
        priority
      />
      <div className="no-commit__text">커밋 내역이 존재하지 않습니다</div>
    </section>
  );
};

export default NoCommitDescription;
