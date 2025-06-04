'use client';

import { useState } from 'react';
import './SelectInterviewLevelModal.scss';
import Image from 'next/image';

interface Props {
  onClose: () => void;
  onGenerate: (level: '쉬움' | '보통' | '어려움') => void;
}

const difficultyOptions: {
  label: '쉬움' | '보통' | '어려움';
  image: string;
}[] = [
  { label: '쉬움', image: '/images/intervieweasy.png' },
  { label: '보통', image: '/images/interviewmedium.png' },
  { label: '어려움', image: '/images/interviewhard.png' },
];

const SelectInterviewLevelModal = ({ onClose, onGenerate }: Props) => {
  const [selectedLevel, setSelectedLevel] = useState<null | string>(null);
  const [errorShake, setErrorShake] = useState(false);

  const toggleSelect = (level: string) => {
    setSelectedLevel((prev) => (prev === level ? null : level));
    setErrorShake(false);
  };

  const handleGenerate = () => {
    if (selectedLevel) {
      onGenerate(selectedLevel as '쉬움' | '보통' | '어려움');
    } else {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  return (
    <div className="interview-level-modal">
      <div className="interview-level-modal__overlay" onClick={onClose} />
      <div className="interview-level-modal__content">
        <h2 className="interview-level-modal__title">면접 난이도를 선택해주세요</h2>

        <div className="interview-level-modal__levels">
          {difficultyOptions.map(({ label, image }) => (
            <div
              key={label}
              className={`interview-level-modal__level ${
                selectedLevel === label ? 'selected' : ''
              }`}
              onClick={() => toggleSelect(label)}
            >
              <Image src={image} alt={label} width={40} height={47} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="interview-level-modal__buttons">
          <button className="interview-level-modal__button cancel" onClick={onClose}>
            취소
          </button>
          <button
            className={`interview-level-modal__button ${
              errorShake ? 'error shake' : ''
            }`}
            onClick={handleGenerate}
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectInterviewLevelModal;
