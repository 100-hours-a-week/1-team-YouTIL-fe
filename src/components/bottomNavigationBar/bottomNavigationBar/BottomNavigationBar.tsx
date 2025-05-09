'use client';

import BottomNavigationBarButton from '../bottomNavigationBarButton/BottomNavigationBarButton';
import './BottomNavigationBar.scss';

const navItems = [
  { label: '메인 페이지', href: '/' },
  { label: 'TIL 생성', href: '/commit' },
  { label: '커뮤니티', href: '/community' },
  { label: '레포지토리', href: '/repository' },
  { label: '프로필', href: '/profile' },
];

const BottomNavigationBar = () => {
  return (
    <div className='bottom-nav-bar'>
      <nav className="bottom-nav">
        {navItems.map(({ label, href }) => (
          <BottomNavigationBarButton key={href} label={label} href={href} />
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigationBar;
