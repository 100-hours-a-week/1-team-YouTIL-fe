'use client';

import './WelcomeDescription.scss';
import useUserInfoStore from '@/store/useUserInfoStore';

const WelcomeDescription = () => {
  const { userInfo } = useUserInfoStore();

  return (
    <article className="description">
      {userInfo.name}님 환영합니다
    </article>
  );
};

export default WelcomeDescription;
