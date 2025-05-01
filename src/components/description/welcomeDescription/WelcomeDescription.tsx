'use client';

import './WelcomeDescription.scss';
import useUserInfoStore from '@/store/userInfoStore';

const WelcomeDescription = () => {
  const { userInfo } = useUserInfoStore();

  return (
    <div className="description">
      {userInfo.name}님 환영합니다
    </div>
  );
};

export default WelcomeDescription;
