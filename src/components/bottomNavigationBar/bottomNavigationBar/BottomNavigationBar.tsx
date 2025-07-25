'use client';

import BottomNavigationBarButton from '../bottomNavigationBarButton/BottomNavigationBarButton';
import './BottomNavigationBar.scss';
import useUserInfoStore from '@/store/useUserInfoStore';

const BottomNavigationBar = () => {
  const userId = useUserInfoStore((state) => state.userInfo.userId);

  const navItems = [
    { label: '메인 페이지', href: '/' },
    { label: '커뮤니티', href: '/community' },
    { label: 'TIL 생성', href: '/commit' },
    { label: '레포지토리', href: '/repository' },
    { label: '프로필', href: `/profile/${userId}`},
  ];

  return (
    <div className="bottom-nav__container">
      <nav className="bottom-nav__nav">
        {navItems.map(({ label, href }) => (
          <BottomNavigationBarButton key={href} label={label} href={href} />
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigationBar;
