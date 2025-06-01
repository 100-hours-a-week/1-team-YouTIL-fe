'use client';

import './TILRecordDescription.scss';
import useUserInfoStore from '@/store/useUserInfoStore';

const TILRecordDescription = () => {
  const { userInfo } = useUserInfoStore();
  return (
    <article className="description">
      {userInfo.name}님의 TIL 기록입니다
    </article>
  );
};

export default TILRecordDescription;
