'use client';

import './RepositoryTILList.scss';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { useRepositoryTILList } from '@/hooks/repository/til/useRepositoryTILList';
import { useFetch } from '@/hooks/useFetch';
import SelectInterviewLevelModal from '../selectInterviewLevelModal/SelectInterviewLevelModal';
import CheckDeleteTILModal from '../checkDeleteModal/checkDeleteTILModal/CheckDeleteTILModal';
import { mainKeys } from '@/querykey/main.querykey';
import { repositoryKeys } from '@/querykey/repository.querykey';
import { profileKeys } from '@/querykey/profile.querykey';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import SelectOrganizationModal from './selectOrganizationModal/SelectOrganizationModal';
import SelectRepositoryModal from './selectRepositoryModal/SelectRepositoryModal';
import SelectBranchModal from './selectBranchModal/SelectBranchModal';
import RepositoryConnectResultModal from './repositoryConnectResultModal/RepositoryConnectResultModal';
import { useMutation } from '@tanstack/react-query';
import { useToastStore } from '@/store/useToastStore';
import UploadCompleteToast from './uploadCompleteToast/UploadCompleteToast';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';
import GenerateInterviewModal from '../generateInterviewModal/GenerateInterviewModal';
import dynamic from 'next/dynamic';

const MarkdownRenderer = dynamic(() => import('@/components/common/MarkdownRenderer'), {
  ssr: false,
  loading: () => <p>로딩 중...</p>,
});

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
    interviewModal,
    deleteModal,
    organizationModal,
    repositoryModal,
    branchModal,
    connectResultModal,
    isConnectSuccess,
    generateInterviewModal,
    setEditedTitle,
    setEditingTilId,
    setIsSubmitting,
    handleClickTIL,
    toggleTILSelection,
    handleStartEdit,
    handleDeleteComplete,
    handleDeleteClick,
    setIsConnectSuccess
  } = useRepositoryTILList();

  const { callApi } = useFetch();
  const queryClient = useQueryClient();
  const floatingRef = useRef<HTMLDivElement>(null);

  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<string | null>(null);
  const [currentTotal, setCurrentTotal] = useState<string | null>(null);
  const {setActiveTab} = useRepositoryDateStore();
  const isFirstRender = useRef(true);
  const [isError, setIsError] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!requestId) return;

    const eventSource = new EventSource(`${baseUrl}/tils/subscribe/${requestId}`);
  
    eventSource.addEventListener('status', (event) => {
      const data = JSON.parse(event.data);
  
      setCurrentStatus(data.status);
      setCurrentTotal(data.total);
      setCurrentPosition(data.position);
      
      if (data.status === 'FINISHED') {
        eventSource.close();
        setIsError(false);
        setTimeout(() => {
          generateInterviewModal.close();
          setCurrentStatus(null);
          setActiveTab('interview');
        }, 1000);
      }
    });
  }, [requestId]);
  
  
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

  const { mutate } = useMutation({
    mutationFn: async (expandedTilId: number) => {
      const response = await callApi({
        method: 'POST',
        endpoint: '/tils/upload',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: { tilId: expandedTilId },
      });
      return response;
    },
    onSuccess: () => {
      useToastStore.getState().addToast({
        type: 'success',
        message: '깃허브 업로드 성공!',
      });
    },
    onError: () => {
      useToastStore.getState().addToast({
        type: 'error',
        message: '깃허브 업로드 실패!',
      });
    },
  });

  const handleConfirmEdit = async (
    e?: React.MouseEvent | React.KeyboardEvent,
    tilId?: number
  ) => {
    if (!tilId || isSubmitting || !editedTitle.trim()) return;
    e?.stopPropagation();
    setIsSubmitting(true);

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
    if (expandedTilId !== null) {
      mutate(expandedTilId);
    } else {
      console.error('expandedTilId is null');
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
                      {isExpanded && tilDetailData && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(tilDetailData.content);
                          }}
                          className="repository-til-list__item-copy-button"
                        >
                          <Image
                            src="/images/copy.png"
                            alt="copy"
                            width={16}
                            height={16}
                            className="repository-til-list__item-copy-icon"
                          />
                        </button>
                      )}
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
                <div className="repository-til-list__item-detail">
                  <MarkdownRenderer content={tilDetailData.content} />
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
          <Image
            src="/images/gitIcon.png"
            alt="GitHub Icon"
            width={24}
            height={24}
          />
        </button>
      </div>

      {(currentStatus !== null || isError) && (
        <GenerateInterviewModal
          isError={isError}
          status={currentStatus}
          total={currentTotal}
          position={currentPosition}
          onClose={() => {
            setIsError(false);
            generateInterviewModal.close();
            setCurrentStatus(null);
          }}
        />
      )}

      <UploadCompleteToast />

      {interviewModal.isOpen && (
        <SelectInterviewLevelModal
          tilId={expandedTilId!}
          onClose={interviewModal.close}
          setRequestId={setRequestId}
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
          onComplete={(response) => {
            const success = !!response?.success;
            setIsConnectSuccess(success);
            connectResultModal.open();
          }}
        />
      )}

      {connectResultModal.isOpen && isConnectSuccess !== null && (
        <RepositoryConnectResultModal
          isSuccess={isConnectSuccess!}
          onClose={connectResultModal.close}
        />
      )}

    </div>
  );
};

export default RepositoryTILList;
