'use client';

import { useEffect } from 'react';
import './RepositoryConnectResultModal.scss';
import SuccessIcon from '@/components/icon/SuccessIcon';
import FailedIcon from '@/components/icon/FailedIcon';

interface Props {
  isSuccess: boolean;
  onClose: () => void;
}

const RepositoryConnectResultModal = ({ isSuccess, onClose }: Props) => {
  useEffect(() => {
    if (!isSuccess) return;

    const timer = setTimeout(() => {
      onClose();
    }, 1500);

    return () => clearTimeout(timer);
  }, [isSuccess, onClose]);

  return (
    <section className="github-upload-modal">
      <div className="github-upload-modal__overlay" onClick={onClose} />
      <article className="github-upload-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="github-modal-title">
        <div
          className={`github-upload-modal__result ${
            isSuccess ? 'success' : 'error'
          }`}
        >
          {isSuccess ? (
            <>
              <p className="interview-level-modal__line1">
                깃허브 레포지토리 연결에 성공했습니다!
              </p>
              <SuccessIcon />
            </>
          ) : (
            <>
              <div className="interview-level-modal__text">
                <p className="interview-level-modal__line1">
                  깃허브 레포지토리 연결에 실패했습니다!
                </p>
                <p className="interview-level-modal__line2">다시 시도해주세요</p>
                <FailedIcon />
              </div>
            </>
          )}
        </div>
      </article>
    </section>
  );
};

export default RepositoryConnectResultModal;
