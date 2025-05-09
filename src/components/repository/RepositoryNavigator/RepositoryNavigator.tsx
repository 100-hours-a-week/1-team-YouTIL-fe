'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './RepositoryNavigator.scss';

const RepositoryNavigator = () => {
  const pathname = usePathname();
  const isTIL = pathname === '/repository/til';
  const isInterview = pathname === '/repository/interview';

  return (
    <div className="repository-navigator">
      <div className="repository-navigator__tabs">
        <Link
          href="/repository/til"
          className={`repository-navigator__tab ${isTIL ? 'active' : ''}`}
        >
          TIL
        </Link>
        <Link
          href="/repository/interview"
          className={`repository-navigator__tab ${isInterview ? 'active' : ''}`}
        >
          면접질문
        </Link>
        <div
          className="repository-navigator__underline"
          style={{
            transform: isTIL ? 'translateX(0%)' : 'translateX(100%)',
          }}
        />
      </div>
    </div>
  );
};

export default RepositoryNavigator;
