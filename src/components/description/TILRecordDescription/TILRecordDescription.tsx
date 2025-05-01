'use client';

import './TILRecordDescription.scss';
import useUserInfoStore from '@/store/userInfoStore';

const TILRecordDescription = () => {
  const { userInfo } = useUserInfoStore();
  return (
    <div className="description">
      {userInfo.name}님의 TIL 기록입니다.
    </div>
  );
};

export default TILRecordDescription;
