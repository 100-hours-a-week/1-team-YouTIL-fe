'use client';

import './RepositoryTILList.scss';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { useRepositoryTILList } from '@/hooks/repository/til/useRepositoryTILList';
import { useFetch } from '@/hooks/useFetch';
import SelectInterviewLevelModal from '../selectInterviewLevelModal/SelectInterviewLevelModal';
import CheckDeleteTILModal from '../checkDeleteModal/checkDeleteTILModal/CheckDeleteTILModal';
import Markdown from 'react-markdown';
import { mainKeys } from '@/querykey/main.querykey';
import { repositoryKeys } from '@/querykey/repository.querykey';
import { profileKeys } from '@/querykey/profile.querykey';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import SelectOrganizationModal from './selectOrganizationModal/SelectOrganizationModal';
import SelectRepositoryModal from './selectRepositoryModal/SelectRepositoryModal';
import SelectBranchModal from './selectBranchModal/SelectBranchModal';

interface TILItem {
  tilId: number;
  title: string;
  createdAt: string;
}

interface TILResponse {
  data: { 
    tils: TILItem[] 
  };
}

interface TILDetailResponse {
  data: TILDetailItem;
}

interface TILDetailItem {
  title: string;
  content: string;
  tag: string[];
  category: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  visitedCount: number;
  recommendCount: number;
  commentsCount: number;
}


const RepositoryTILList = () => {
  const {
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
    deleteModal,
    interviewModal,
    organizationModal,
    repositoryModal,
    branchModal,
    setEditedTitle,
    setEditingTilId,
    setIsSubmitting,
    handleClickTIL,
    toggleTILSelection,
    handleStartEdit,
    handleDeleteComplete,
    handleDeleteClick,
  } = useRepositoryTILList();

  const { callApi } = useFetch();
  const queryClient = useQueryClient();
  const [gitFetchEnabled, setGitFetchEnabled] = useState(false);
  const floatingRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (tilDate) {
      queryClient.removeQueries({ queryKey: ['disabled-query'] });
    }
  }, [tilDate]);

  useEffect(() => {
    const updateFloatingPosition = () => {
      const frame = document.querySelector('.layout__frame');
      const buttons = floatingRef.current;

      if (!frame || !buttons) return;

      const rect = frame.getBoundingClientRect();
      buttons.style.left = `${rect.right - 42}px`;
      buttons.style.bottom = '70px';
      buttons.style.opacity = '1';
    };

    updateFloatingPosition();
    window.addEventListener('resize', updateFloatingPosition);
    window.addEventListener('scroll', updateFloatingPosition);

    return () => {
      window.removeEventListener('resize', updateFloatingPosition);
      window.removeEventListener('scroll', updateFloatingPosition);
    };
  }, []);
  
  
  const {
    data: tilPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: tilDate
    ? repositoryKeys.tilList(tilDate).queryKey
    : ['disabled-query'], 
    queryFn: async ({ pageParam = 0 }) => {
      const targetDate = tilDate || format(new Date(), 'yyyy-MM-dd');
      const response = await callApi<TILResponse>({
        method: 'GET',
        endpoint: `/tils?page=${pageParam}&size=10&date=${targetDate}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const isLast = lastPage.data.tils.length < 10;
      return isLast ? undefined : allPages.length;
    },
    initialPageParam: 0,
    enabled: !!tilDate && existAccess,
    staleTime: 1800000,
    gcTime: 3600000,
  });

  const allTils = tilPages?.pages.flatMap((page) => page.data.tils) ?? [];

  const loadMoreRef = useInfinityScrollObserver<HTMLLIElement>({
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  });

  const { data: tilDetailData } = useQuery<TILDetailItem | null>({
    queryKey: expandedTilId !== null
    ? repositoryKeys.tilDetail(expandedTilId).queryKey
    : ['disabled-query'],
    queryFn: async () => {
      if (expandedTilId === null) return null;
      const response = await callApi<TILDetailResponse>({
        method: 'GET',
        endpoint: `/tils/${expandedTilId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      return response.data;
    },
    enabled: expandedTilId !== null && existAccess,
    staleTime: Infinity,
    gcTime: 3600000,
  });

  const { data: gitData } = useQuery({
    queryKey: ['github', 'upload'],
    queryFn: async () => {
      const response = await callApi({
        method: 'GET',
        endpoint: '/github',
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      console.log('📦 /github 응답:', response);
      return response;
    },
    enabled: gitFetchEnabled,
    staleTime: 0,
    gcTime: 0,
  });

  const handleConfirmEdit = async (
    e?: React.MouseEvent | React.KeyboardEvent,
    tilId?: number
  ) => {
    if (!tilId || isSubmitting || !editedTitle.trim()) return;
    e?.stopPropagation();
    setIsSubmitting(true);

    queryClient.setQueryData<TILItem[]>(repositoryKeys.tilList(tilDate).queryKey, (prev) =>
      prev?.map((til) =>
        til.tilId === tilId ? { ...til, title: editedTitle.trim() } : til
      ) ?? prev
    );

    try {
      await callApi({
        method: 'PUT',
        endpoint: '/tils',
        body: { tilId, title: editedTitle.trim() },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      setEditingTilId(null);
      queryClient.invalidateQueries({ queryKey: mainKeys.newTILList().queryKey });
      queryClient.invalidateQueries({ queryKey: profileKeys.tilList._def, exact: false });
      queryClient.invalidateQueries({ queryKey: repositoryKeys.tilList._def, exact: false });
      queryClient.invalidateQueries({ queryKey: repositoryKeys.tilDetail._def, exact: false });

    } catch (err) {
      console.error('TIL 수정 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGitUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setGitFetchEnabled(true);
  };

  return (
    <div className="repository-til-list">
      <div className="repository-til-list__header">
        <h2 className="repository-til-list__title">TIL 목록</h2>
        {allTils.length > 0 && (
          <button
            className={`repository-til-list__button${shakeDelete ? ' error shake' : ''}`}
            onClick={handleDeleteClick}
          >
            삭제
          </button>
        )}
      </div>
      <ul className="repository-til-list__items">
        {allTils.map((til, index) => {
          const parsedDate = parseISO(til.createdAt);
          const formattedDate = format(parsedDate, 'yyyy-MM-dd : HH:mm:ss');
          const isSelected = selectedTilIds.includes(til.tilId);
          const isExpanded = expandedTilId === til.tilId;
          const isLastItem = index === allTils.length - 1;
          return (
            <li
              key={til.tilId}
              className={`repository-til-list__item${isSelected ? ' selected' : ''}`}
              ref={isLastItem ? loadMoreRef : null}
            >
              <div className="repository-til-list__item-header-wrapper">
                <div
                  className="repository-til-list__item-header"
                  onClick={() => {
                    if (isSelected) return;
                    handleClickTIL(til.tilId);
                  }}
                >
                  <div className="repository-til-list__item-header-top">
                    {editingTilId === til.tilId ? (
                      <div
                        className="repository-til-list__item-edit-wrapper"
                        ref={(el) => {
                          refs.current[til.tilId] = el;
                        }}
                      >
                        <input
                          value={editedTitle}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const input = e.target.value;
                            if (input.length <= 40) {
                              setEditedTitle(input);
                            }
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleConfirmEdit(e, til.tilId)}
                          className="repository-til-list__item-edit-input"
                        />
                        <button
                          className="repository-til-list__item-edit-confirm"
                          onClick={(e) => handleConfirmEdit(e, til.tilId)}
                        >
                          확인
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3
                          className={`repository-til-list__item-title${
                            isExpanded ? ' repository-til-list__item-title--expanded' : ''
                          }`}
                        >
                          {til.title}
                        </h3>
                        <Image
                          src="/images/pencilEdit.png"
                          alt="edit icon"
                          width={16}
                          height={16}
                          className="repository-til-list__item-edit-icon"
                          onClick={(e) => handleStartEdit(e, til.tilId, til.title)}
                        />
                      </>
                    )}
                  </div>

                  <div
                    className={`repository-til-list__item-subheader${
                      isExpanded ? ' repository-til-list__item-subheader--expanded' : ''
                    }`}
                  >
                    <p className="repository-til-list__item-date">{formattedDate}</p>
                    {isExpanded && (
                      <>
                        <button
                          className="repository-til-list__item-generate-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            interviewModal.open();
                          }}
                        >
                          면접질문생성
                        </button>
                        <button
                          className="repository-til-list__item-upload-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGitUpload(e);
                          }}
                        >
                          git 업로드
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {expandedTilId !== til.tilId && (
                  <input
                    type="checkbox"
                    className="repository-til-list__item-checkbox"
                    checked={isSelected}
                    onChange={() => toggleTILSelection(til.tilId)}
                  />
                )}
              </div>

              {expandedTilId === til.tilId && tilDetailData && (
                <div
                  className="repository-til-list__item-detail"
                  onCopy={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(tilDetailData.content);
                  }}
                >
                  <Markdown>{tilDetailData.content}</Markdown>
                  <p className="repository-til-list__item-tags">
                    {tilDetailData.tag.map((tag, i) => (
                      <span key={i} className="repository-til-list__item-tag">#{tag}</span>
                    ))}
                  </p>
                  <p className="repository-til-list__item-meta">
                    조회수 {tilDetailData.visitedCount} · 추천 {tilDetailData.recommendCount} · 댓글 {tilDetailData.commentsCount}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="repository-til-list__floating-wrapper" ref={floatingRef}>
        <button
          className="repository-til-list__floating-button"
          onClick={() => {
            organizationModal.open();
          }}
        >
          🔄
        </button>
      </div>

      {interviewModal.isOpen && (
        <SelectInterviewLevelModal
          tilId={expandedTilId!}
          onClose={interviewModal.close}
        />
      )}

      {deleteModal.isOpen && (
        <CheckDeleteTILModal
          tilIds={selectedTilIds}
          onClose={deleteModal.close}
          onDeleteComplete={handleDeleteComplete}
        />
      )}


      {organizationModal.isOpen && (
        <SelectOrganizationModal
          onClose={organizationModal.close}
          onComplete={() => {
            organizationModal.close();
            repositoryModal.open();
          }}
        />
      )}

      {repositoryModal.isOpen && (
        <SelectRepositoryModal 
          onClose={repositoryModal.close} 
          onComplete={() =>{
            repositoryModal.close();
            branchModal.open();
          }}
        />
      )}

      {branchModal.isOpen && (
        <SelectBranchModal 
          onClose={branchModal.close} 
        />
      )}

    </div>
  );
};

export default RepositoryTILList;
