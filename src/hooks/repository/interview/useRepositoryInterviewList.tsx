'use client';

import { useState } from 'react';
import { useModal } from '@/hooks/useModal';

export const useRepositoryInterviewList = () => {
  const [expandedInterviewId, setExpandedInterviewId] = useState<number | null>(null);
  const [visibleAnswerMap, setVisibleAnswerMap] = useState<Record<number, boolean>>({});
  const [selectedInterviewIds, setSelectedInterviewIds] = useState<number[]>([]);
  const [shakeDelete, setShakeDelete] = useState(false);

  const deleteModal = useModal();

  const mapLevelToLabel = (level: 'EASY' | 'NORMAL' | 'HARD'): string => {
    switch (level) {
      case 'EASY': return '쉬움';
      case 'NORMAL': return '보통';
      case 'HARD': return '어려움';
      default: return '-';
    }
  };

  const handleClickInterview = (interviewId: number) => {
    if (selectedInterviewIds.includes(interviewId)) return;
    setExpandedInterviewId(prev => (prev === interviewId ? null : interviewId));
  };

  const toggleInterviewSelection = (interviewId: number) => {
    setSelectedInterviewIds(prev =>
      prev.includes(interviewId)
        ? prev.filter(id => id !== interviewId)
        : [...prev, interviewId]
    );
    if (expandedInterviewId === interviewId) {
      setExpandedInterviewId(null);
    }
  };

  const handleDeleteClick = () => {
    if (selectedInterviewIds.length === 0) {
      setShakeDelete(true);
      setTimeout(() => setShakeDelete(false), 500);
    } else {
      deleteModal.open();
    }
  };

  const handleDeleteComplete = () => {
    setSelectedInterviewIds([]);
    deleteModal.close();
  };

  return {
    expandedInterviewId,
    visibleAnswerMap,
    setVisibleAnswerMap,
    selectedInterviewIds,
    shakeDelete,
    setShakeDelete,
    mapLevelToLabel,
    handleDeleteClick,
    deleteModal,
    handleDeleteComplete,
    handleClickInterview,
    toggleInterviewSelection,
  };
};
