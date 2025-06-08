import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import './UserTILButton.scss';

interface Props {
  onClick: () => void;
  isTILMode: boolean;
}

const UserTILButton = ({ onClick, isTILMode }: Props) => {
  const { name } = useOtherUserInfoStore((state) => state.otherUserInfo);

  return (
    <button className="usertil-button" onClick={onClick}>
      <span className="usertil-button__nickname">{name}님의</span>
      <span className="usertil-button__highlight">
        {isTILMode ? '방명록' : 'TIL'}
      </span>
      <span className="usertil-button__text">보러가기 →</span>
    </button>
  );
};

export default UserTILButton;
