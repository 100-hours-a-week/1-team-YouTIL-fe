'use client';

import { useState, useEffect, useRef } from 'react';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useModal } from '@/hooks/useModal';

export const useRepositoryTILList = () => {
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const { tilDate } = useRepositoryDateStore();
  const interviewModal = useModal();
  const deleteModal = useModal();
  const organizationModal = useModal();
  const repositoryModal = useModal();
  const branchModal = useModal();
  const connectResultModal = useModal();
  const [expandedTilId, setExpandedTilId] = useState<number | null>(null);
  const [selectedTilIds, setSelectedTilIds] = useState<number[]>([]);
  const [shakeDelete, setShakeDelete] = useState(false);
  const [editingTilId, setEditingTilId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const refs = useRef<Record<number, HTMLDivElement | null>>({});
  const [isConnectSuccess, setIsConnectSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const currentMenu = editingTilId !== null ? refs.current[editingTilId] : null;
      if (currentMenu && !currentMenu.contains(event.target as Node)) {
        setEditingTilId(null);
        setEditedTitle('');
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [editingTilId]);

  const toggleTILSelection = (tilId: number) => {
    setEditingTilId(null);
    setSelectedTilIds((prev) =>
      prev.includes(tilId) ? prev.filter((id) => id !== tilId) : [...prev, tilId]
    );
    if (expandedTilId === tilId) setExpandedTilId(null);
  };

  const handleDeleteClick = () => {
    if (selectedTilIds.length === 0) {
      setShakeDelete(true);
      setTimeout(() => setShakeDelete(false), 500);
    } else {
      deleteModal.open();
    }
  };

  const handleDeleteComplete = () => {
    setSelectedTilIds([]);
    deleteModal.close();
  };

  const handleClickTIL = (tilId: number) => {
    setEditingTilId(null);
    setExpandedTilId((prev) => (prev === tilId ? null : tilId));
  };

  const handleStartEdit = (
    e: React.MouseEvent,
    tilId: number,
    currentTitle: string
  ) => {
    e.stopPropagation();
    setEditingTilId(tilId);
    setEditedTitle(currentTitle);
  };

  return {
    refs,
    tilDate,
    accessToken,
    existAccess,
    expandedTilId,
    selectedTilIds,
    shakeDelete,
    editingTilId,
    editedTitle,
    isSubmitting,
    interviewModal,
    deleteModal,
    organizationModal,
    repositoryModal,
    branchModal,
    connectResultModal,
    isConnectSuccess,
    setEditedTitle,
    setSelectedTilIds,
    setEditingTilId,
    setIsSubmitting,
    handleClickTIL,
    toggleTILSelection,
    handleStartEdit,
    handleDeleteComplete,
    handleDeleteClick,
    setIsConnectSuccess
  };
};

