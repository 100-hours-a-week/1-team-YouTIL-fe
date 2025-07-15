'use client';

import './GenerateTILModal.scss';
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
  PROCESSING: 'TIL 생성 준비 중입니다...',
  GET_COMMIT_DATA_FROM_GITHUB: '커밋 데이터를 불러오고 있습니다...',
  COMMIT_ANALYSIS_START: '커밋 분석을 시작합니다...',
  SUPERVISOR_START: '검토 중입니다...',
  RESEARCH_TEAM_START: '연구팀에서 내용을 정리 중입니다...',
  INTRODUCTION_START: '도입부를 작성 중입니다...',
  CONCLUSION_START: '결론을 작성 중입니다...',
  FINISHED: 'TIL 생성이 완료되었습니다!',
};

const STATUS_ORDER: string[] = [
  'ERROR',
  'WAITING',
  'PROCESSING',
  'GET_COMMIT_DATA_FROM_GITHUB',
  'COMMIT_ANALYSIS_START',
  'SUPERVISOR_START',
  'RESEARCH_TEAM_START',
  'INTRODUCTION_START',
  'CONCLUSION_START',
  'FINISHED',
];

const GenerateTILModal = ({ isError, status, total, position, onClose }: Props) => {
  const statusMessage = status && STATUS_MESSAGE_MAP[status];
  const statusIndex = status ? STATUS_ORDER.indexOf(status) : 0;
  const progressPercent = Math.max(0, (statusIndex / (STATUS_ORDER.length - 1)) * 100);

  return (
    <div className="generate-til-modal">
      <div
        className="generate-til-modal__overlay"
        onClick={(isError || status === 'ERROR') && onClose ? onClose : undefined}
      />
      <div className="generate-til-modal__content">
        {(isError || status === 'ERROR') ? (
          <div className="generate-til-modal__result generate-til-modal__result--error">
            <div className="generate-til-modal__text-group">
              <p className="generate-til-modal__line1">TIL 생성에 실패하였습니다</p>
              <p className="generate-til-modal__line2">다시 시도해주세요</p>
            </div>
            <FailedIcon />
          </div>
        ) : (
          <>
            <p className="generate-til-modal__text">
              {status === 'WAITING'
                ? `현재 ${total}명 중 ${position}번째 입니다`
                : statusMessage ?? 'TIL 생성 중...'}
            </p>
            <div className="generate-til-modal__progress-wrapper">
              <div
                className="generate-til-modal__progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="generate-til-modal__subtext">
              <span className="generate-til-modal__spinner" />
              TIL 생성 시 1분 정도의 시간이 소요됩니다
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerateTILModal;
