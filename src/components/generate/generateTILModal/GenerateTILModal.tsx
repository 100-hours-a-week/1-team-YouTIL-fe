'use client';

import './GenerateTILModal.scss';
import FailedIcon from '@/components/icon/FailedIcon';

interface Props {
  isError?: boolean;
  onClose?: () => void;
}

const GenerateTILModal = ({ isError = false, onClose }: Props) => {
  return (
    <div className="generate-modal">
      <div
        className="generate-modal__overlay"
        onClick={isError && onClose ? onClose : undefined}
      />
      <div className="generate-modal__content">
        {isError ? (
          <div className="generate-modal__result generate-modal__result--error">
            <div className="generate-modal__text-group">
              <p className="generate-modal__line1">TIL 생성에 실패하였습니다</p>
              <p className="generate-modal__line2">다시 시도해주세요</p>
            </div>
            <FailedIcon />
          </div>
        ) : (
          <>
            <p className="generate-modal__text">
              <span className="generate-modal__spinner" />
              TIL 생성중...
            </p>
            <p className="generate-modal__subtext">
              TIL 생성 시 1분 정도의 시간이 소요됩니다
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerateTILModal;
