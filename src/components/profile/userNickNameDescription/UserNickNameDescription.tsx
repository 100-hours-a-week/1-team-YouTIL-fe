'use client';

import './UserNickNameDescription.scss';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';

const UserNickNameDescription = () => {
  const name = useOtherUserInfoStore((state) => state.otherUserInfo.name);

  return (
    <section  className="user-nickname">
      <div className="user-nickname__box">
        {name ? `${name} 님의 마이페이지` : '닉네임 정보 없음'}
      </div>
    </section >
  );
};

export default UserNickNameDescription;
