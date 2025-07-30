'use client';

import './DeadLineModal.scss';

interface DeadLineModalProps {
  onClose: () => void;
}

const DeadLineModal = ({ onClose }: DeadLineModalProps) => {
  return (
    <section className="deadline-modal">
      <div className="deadline-modal__overlay" onClick={onClose} />
      <article className="deadline-modal__content">
        <header>
          <h2 className="deadline-modal__title">현재 TIL 생성이 불가능합니다!</h2>
        </header>
        <p className="deadline-modal__description">
          생성 가능 시간: <strong>15:00 ~ 24:00</strong>
        </p>
        <footer>
        <button className="deadline-modal__close" onClick={onClose}>
          확인
        </button>
        </footer>
      </article>
    </section>
  );
};

export default DeadLineModal;
