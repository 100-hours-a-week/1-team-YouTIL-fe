'use client';

import Link from 'next/link';
import './BottomNavigationBarButton.scss';

interface NavButtonProps {
  label: string;
  href: string;
}

const BottomNavigationBarButton = ({ label, href }: NavButtonProps) => {
  return (
    <Link href={href} className="nav-button">
      {label}
    </Link>
  );
};

export default BottomNavigationBarButton;
