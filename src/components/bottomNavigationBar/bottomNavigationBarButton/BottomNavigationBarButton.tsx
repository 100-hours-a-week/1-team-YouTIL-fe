'use client';

import Link from 'next/link';
import './BottomNavigationBarButton.scss';

interface Props {
  label: string;
  href: string;
}

const BottomNavigationBarButton = ({ label, href }: Props) => {
  return (
    <Link href={href} className="nav-button">
      {label}
    </Link>
  );
};

export default BottomNavigationBarButton;