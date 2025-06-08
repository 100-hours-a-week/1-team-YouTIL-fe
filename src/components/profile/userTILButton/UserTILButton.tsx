import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import './UserTILButton.scss';

interface Props {
  onClick: () => void;
}

const UserTILButton = ({ onClick }: Props) => {
  const { name } = useOtherUserInfoStore((state) => state.otherUserInfo);

  return (
    <button className="usertil-button" onClick={onClick}>
      <span className="usertil-button__nickname">{name}님의</span>
      <span className="usertil-button__highlight">TIL</span>
      <span className="usertil-button__text">보러가기 →</span>
    </button>
  );
};

export default UserTILButton;
