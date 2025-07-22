'use client';

import './GenerateInterviewModal.scss';
import FailedIcon from '@/components/icon/FailedIcon';

interface Props {
  isError: boolean;
  status: string | null;
  total: string | null;
  position: string | null;
  onClose?: () => void;
}

const STATUS_MESSAGE_MAP: Record<string, string> = {
  ERROR: '면접질문 생성에 실패했습니다...',
  WAITING: '대기열에 등록되었습니다...',
  PROCESSING: '면접질문 생성 준비 중입니다...',
  FINISHED: '면접질문 생성이 완료되었습니다!',
};

const STATUS_ORDER: string[] = [
  'ERROR',
  'WAITING',
  'PROCESSING_STAGE_1',
  'PROCESSING_STAGE_2',
  'FINISHED',
];

const GenerateInterviewModal = ({ isError, status, total, position, onClose }: Props) => {
  const internalStatus =
    status === 'PROCESSING' ? 'PROCESSING_STAGE_1' : status;

  const statusMessage = status && STATUS_MESSAGE_MAP[status];
  const statusIndex = internalStatus
    ? STATUS_ORDER.indexOf(internalStatus)
    : 0;

  const progressPercent = Math.max(
    0,
    (statusIndex / (STATUS_ORDER.length - 1)) * 100
  );

  return (
    <section className="generate-interview-modal">
      <div
        className="generate-interview-modal__overlay"
        onClick={(isError || status === 'ERROR') && onClose ? onClose : undefined}
      />
      <article className="generate-interview-modal__content" role="dialog" aria-modal="true">
        {(isError || status === 'ERROR') ? (
          <div className="generate-interview-modal__result generate-interview-modal__result--error">
            <header  className="generate-interview-modal__text-group">
              <p className="generate-interview-modal__line1">면접질문 생성에 실패하였습니다</p>
              <p className="generate-interview-modal__line2">다시 시도해주세요</p>
            </header>
            <FailedIcon />
          </div>
        ) : (
          <>
          <header>
            <p className="generate-interview-modal__text">
              {status === 'WAITING'
                ? `현재 ${total}명 중 ${position}번째 입니다`
                : statusMessage ?? '면접질문 생성 중...'}
            </p>
            </header>
            <div className="generate-interview-modal__progress-wrapper">
              <div
                className="generate-interview-modal__progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <footer>
            <p className="generate-interview-modal__subtext">
              <span className="generate-interview-modal__spinner" />
              면접질문 생성 시 1분 정도의 시간이 소요됩니다
            </p>
            </footer>
          </>
        )}
      </article>
    </section>
  );
};

export default GenerateInterviewModal;
