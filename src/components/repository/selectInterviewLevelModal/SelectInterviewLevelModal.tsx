'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import './SelectInterviewLevelModal.scss';
import Image from 'next/image';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';

interface Props {
  tilId: number;
  onClose: () => void;
}

const difficultyOptions: {
  label: '쉬움' | '보통' | '어려움';
  image: string;
  value: 3 | 2 | 1;
}[] = [
  { label: '쉬움', image: '/images/intervieweasy.png', value: 3 },
  { label: '보통', image: '/images/interviewmedium.png', value: 2 },
  { label: '어려움', image: '/images/interviewhard.png', value: 1 },
];

const SelectInterviewLevelModal = ({ onClose, tilId }: Props) => {
  const [selectedLevel, setSelectedLevel] = useState<null | 1 | 2 | 3>(null);
  const [errorShake, setErrorShake] = useState(false);
  const { callApi } = useFetch();
  const queryClient = useQueryClient();
  const accessToken = useGetAccessToken();
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSelect = (value: 1 | 2 | 3) => {
    setSelectedLevel((prev) => (prev === value ? null : value));
    setErrorShake(false);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      return await callApi<{ message: string }>({
        method: 'POST',
        endpoint: '/interviews',
        body: {
          tilId,
          level: selectedLevel,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
    },
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviewList'] });
      onClose();
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });
  

  const handleGenerate = () => {
    if (selectedLevel) {
      mutation.mutate();
    } else {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  return (
    <div className="interview-level-modal">
      <div className="interview-level-modal__overlay" onClick={isGenerating ? undefined : onClose}/>
      <div className={`interview-level-modal__content ${ mutation.isPending ? 'interview-level-modal__content--loading' : '' }`}
    >
  {mutation.isPending ? (
    <div className="interview-level-modal__loading">
      <div className="interview-level-modal__loading-spinner-text">
        <div className="spinner" />
        <p className="loading__text">면접질문 생성중...</p>
      </div>
      <p className="loading__subtext">면접질문 생성시 30초 정도의 시간이 소요 됩니다</p>
    </div>
        ) : (
          <>
            <h2 className="interview-level-modal__title">면접 난이도를 선택해주세요</h2>
            <div className="interview-level-modal__levels">
              {difficultyOptions.map(({ label, image, value }) => (
                <div
                  key={label}
                  className={`interview-level-modal__level ${
                    selectedLevel === value ? 'selected' : ''
                  }`}
                  onClick={() => toggleSelect(value)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default SelectInterviewLevelModal;
