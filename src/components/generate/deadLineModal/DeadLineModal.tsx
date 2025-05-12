'use client';

import './DeadLineModal.scss';

interface DeadLineModalProps {
  onClose: () => void;
}

const DeadLineModal = ({ onClose }: DeadLineModalProps) => {
  return (
    <div className="deadline-modal">
      <div className="deadline-modal__overlay" onClick={onClose} />
      <div className="deadline-modal__content">
        <h2 className="deadline-modal__title">현재 TIL 생성이 불가능합니다!</h2>
        <p className="deadline-modal__description">
          생성 가능 시간: <strong>15:00 ~ 24:00</strong>
        </p>
        <button className="deadline-modal__close" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default DeadLineModal;
