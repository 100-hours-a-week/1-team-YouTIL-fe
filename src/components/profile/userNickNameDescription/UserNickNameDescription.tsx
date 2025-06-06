'use client';

import './UserNickNameDescription.scss';
import useUserInfoStore from '@/store/useUserInfoStore';

const UserNickNameDescription = () => {
  const name = useUserInfoStore((state) => state.userInfo.name);

  return (
    <div className="user-nickname">
      <div className="user-nickname__box">
        {name ? `${name} 님의 마이페이지` : '닉네임 정보 없음'}
      </div>
    </div>
  );
};

export default UserNickNameDescription;
