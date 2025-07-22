'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import { useState, useEffect, useRef } from 'react';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import CommunityCommentUtils from '../communityCommentUtils/CommunityCommentUtils';
import CheckDeleteCommentModal from '../checkDeleteCommentModal/CheckDeleteCommentModal';
import CommunityEditCommentInput from '../communityEditCommentInput/CommunityEditCommentInput';
import CommunityReplyCommentInput from '../communityReplyCommentInput/CommunityReplyCommentInput';
import { useModal } from '@/hooks/useModal';
import './CommunityCommentList.scss';
import { communityKeys } from '@/querykey/community.querykey';

interface CommunityCommentItem {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  topCommentId: number | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  replies: CommunityCommentItem[];
}

interface CommunityCommentResponse {
  message: string;
  success: boolean;
  code: string;
  responseAt: string;
  data: {
    comments: CommunityCommentItem[];
    currentPage: number;
    pageSize: number;
  };
}

const CommunityCommentList = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const { otherUserInfo } = useOtherUserInfoStore();
  const userId = otherUserInfo.userId;
  const existAccess = useCheckAccess(accessToken);
  const router = useRouter();
  const { tilId } = useParams();
  const tilIdNumber = Number(tilId);

  const deleteModal = useModal();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyTopId, setReplyTopId] = useState<number | null>(null);

  const refs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const currentMenu = openMenuId !== null ? refs.current[openMenuId] : null;
      if (currentMenu && !currentMenu.contains(event.target as Node)) {
        setOpenMenuId(null);
      }

      const clickedElement = event.target as HTMLElement;
      if (!clickedElement.closest('.edit-comment-input')) {
        setEditingId(null);
        setEditingContent('');
      }
      if (!clickedElement.closest('.reply-comment-input')) {
        setReplyingToId(null);
        setReplyTopId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: communityKeys.comment(tilIdNumber).queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await callApi<CommunityCommentResponse>({
        method: 'GET',
        endpoint: `/community/${tilIdNumber}/comments?page=${pageParam}&offset=20`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.comments.length < 20) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !!tilId && existAccess,
    staleTime: 300000,
    gcTime: 300000,
  });

  const loadMoreRef = useInfinityScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleToggleEdit = (targetId: number, content: string) => {
    setEditingId(prev => (prev === targetId ? null : targetId));
    setEditingContent((editingId === targetId ? '' : content));
  };

  const handleReply = (commentId: number, topId: number) => {
    setReplyingToId(prev => (prev === commentId ? null : commentId));
    setReplyTopId((replyingToId === commentId ? null : topId));
  };

  const handleMoveToProfile = (guestId: number) => {
    router.push(`/profile/${guestId}`);
  };

  const handleRequestDelete = (id: number) => {
    setDeleteTargetId(id);
    deleteModal.open();
  };
  
  const formatDate = (iso: string) => new Date(iso).toLocaleString();
  
  const renderItem = (item: CommunityCommentItem, isReply = false) => {
    const isMenuOpen = openMenuId === item.id;
    const isEditing = editingId === item.id;
    const isReplying = replyingToId === item.id;
    
    return (
      <article
      key={`comment-${item.id}-${isReply ? 'reply' : 'parent'}`}
      className="community-comment-list__item"
      >
        <header className="community-comment-list__header">
          {isReply && (
            <Image
              src="/images/replyIcon.png"
              alt="대댓글 아이콘"
              width={16}
              height={16}
              className="community-comment-list__reply-icon"
              />
            )}
          <Image
            src={item.profileImageUrl}
            alt={`${item.nickname}의 프로필`}
            width={32}
            height={32}
            className="community-comment-list__profile-image"
            onClick={() => handleMoveToProfile(item.userId)}
            />
          <div className="community-comment-list__info">
            <div className="community-comment-list__meta">
              <span
                className="community-comment-list__nickname"
                onClick={() => handleMoveToProfile(item.userId)}
              >
                {item.nickname}
              </span>
              <div className="community-comment-list__meta-right">
                <time  className="community-comment-list__date">{formatDate(item.createdAt)}</time >
                <div
                  className="community-comment-list__menu-wrapper"
                  ref={(el) => {
                    refs.current[item.id] = el;
                  }}
                >
                  <button
                    className="community-comment-list__menu-button"
                    aria-label="댓글 옵션 열기"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId((prev) => (prev === item.id ? null : item.id));
                    }}
                  >
                    <span />
                    <span />
                    <span />
                  </button>
                  {isMenuOpen && (
                    <CommunityCommentUtils
                      commentOwnerId={item.userId}
                      commentId={item.id}
                      topCommentId={item.topCommentId ?? null}
                      originalContent={item.content}
                      profileOwnerId={userId}
                      onCloseDropdown={() => setOpenMenuId(null)}
                      onRequestDelete={handleRequestDelete}
                      onRequestEditToggle={handleToggleEdit}
                      onRequestReply={(resolvedId) => handleReply(item.id, resolvedId)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="community-comment-list__text">
              {item.deleted || item.content === '페이지 소유자가 삭제한 댓글입니다.' ? (
                <del>{item.content}</del>
              ) : isEditing ? (
                <CommunityEditCommentInput
                  originalContent={editingContent}
                  commentId={item.id}
                  tilId={tilIdNumber}
                  onComplete={() => {
                    setEditingId(null);
                    setEditingContent('');
                  }}
                />
              ) : (
                item.content
              )}
            </div>
            {isReplying && replyTopId !== null && (
              <CommunityReplyCommentInput
                topCommentId={replyTopId}
                tilId={tilIdNumber}
                onComplete={() => {
                  setReplyingToId(null);
                  setReplyTopId(null);
                }}
              />
            )}
          </div>
        </header >

        {item.replies?.map((reply) => renderItem(reply, true))}
      </article>
    );
  };

  return (
    <div className="community-comment-list">
      {data?.pages.flatMap((page) =>
        page.data.comments.map((comment) => (
          <div key={`group-${comment.id}`}>
            {renderItem(comment)}
          </div>
        ))
      )}

      {deleteModal.isOpen && deleteTargetId !== null && (
        <CheckDeleteCommentModal
          commentId={deleteTargetId}
          tilId={tilIdNumber}
          onClose={() => {
            deleteModal.close();
            setDeleteTargetId(null);
          }}
          onDeleteComplete={() => {
            deleteModal.close();
            setDeleteTargetId(null);
          }}
        />
      )}

      <div ref={loadMoreRef} style={{ height: '1px' }} />
    </div>
  );
};

export default CommunityCommentList;
