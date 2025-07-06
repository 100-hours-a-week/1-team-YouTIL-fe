'use client';

import './RepositoryTILList.scss';
import Image from 'next/image';
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

  const {
    data: tilPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: repositoryKeys.repositoryTIL(tilDate).queryKey,
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
    enabled: existAccess,
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
    // querykey: [til-detail, expandedTilId]
    queryKey: repositoryKeys.repositoryTILDetail(expandedTilId ?? undefined).queryKey,
    queryFn: async () => {
      if (expandedTilId === null) return null;
      const response = await callApi<{ data: TILDetailItem }>({
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

  const handleConfirmEdit = async (
    e?: React.MouseEvent | React.KeyboardEvent,
    tilId?: number
  ) => {
    if (!tilId || isSubmitting || !editedTitle.trim()) return;
    e?.stopPropagation();
    setIsSubmitting(true);

    queryClient.setQueryData<TILItem[]>(['til-list', tilDate], (prev) =>
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
      queryClient.invalidateQueries({ queryKey: profileKeys.profileTIL._def, exact: false });
      queryClient.invalidateQueries({ queryKey: repositoryKeys.repositoryTIL._def, exact: false });
      queryClient.invalidateQueries({ queryKey: repositoryKeys.repositoryTILDetail._def, exact: false });

    } catch (err) {
      console.error('TIL 수정 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
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
                      <button
                        className="repository-til-list__item-generate-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          interviewModal.open();
                        }}
                      >
                        면접질문생성
                      </button>
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
    </div>
  );
};

export default RepositoryTILList;
