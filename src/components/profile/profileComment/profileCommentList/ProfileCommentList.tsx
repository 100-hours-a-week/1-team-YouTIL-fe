'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import { useState, useEffect, useRef, useCallback } from 'react';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import Image from 'next/image';
import ProfileCommentUtils from '../profileCommentUtils/ProfileCommentUtils';
import CheckDeleteCommentModal from '../checkDeleteCommentModal/CheckDeleteCommentModal';
import ProfileEditCommentInput from '../profileEditCommentInput/ProfileEditCommentInput';
import ProfileReplyCommentInput from '../profileReplyCommentInput/ProfileReplyCommentInput';
import './ProfileCommentList.scss';

interface GuestbookReply {
  id: number;
  content: string;
  createdAt: string;
  deleted: boolean;
  guestId: number;
  guestNickname: string;
  guestProfileImageUrl: string;
  topGuestbookId: number;
  replies: null;
  updatedAt: string;
}

interface GuestbookItem {
  id: number;
  content: string;
  createdAt: string;
  deleted: boolean;
  guestId: number;
  guestNickname: string;
  guestProfileImageUrl: string;
  topGuestbookId: null;
  updatedAt: string;
  replies: GuestbookReply[] | null;
}

interface GuestbookResponse {
  data: {
    guestbooks: GuestbookItem[];
    currentPage: number;
    totalCount: number;
    pageSize: number;
  };
}

const PAGE_SIZE = 20;

const ProfileCommentList = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const { otherUserInfo } = useOtherUserInfoStore();
  const userId = otherUserInfo.userId;
  const existAccess = useCheckAccess(accessToken);

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyTopId, setReplyTopId] = useState<number | null>(null);

  const refs = useRef<Record<number, HTMLDivElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['guestbooks-list', userId],
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
      return await callApi<GuestbookResponse>({
        method: 'GET',
        endpoint: `/users/${userId}/guestbooks?page=${pageParam}&offset=${PAGE_SIZE}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalCount, pageSize } = lastPage.data;
      const maxPage = Math.ceil(totalCount / pageSize) - 1;
      return currentPage < maxPage ? currentPage + 1 : undefined;
    },
    initialPageParam: 0,
    enabled: !!userId && existAccess,
    staleTime: 300000,
    gcTime: 300000,
  });

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1.0 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  const handleToggleEdit = (targetId: number, content: string) => {
    setEditingId(prev => (prev === targetId ? null : targetId));
    setEditingContent(prev => (editingId === targetId ? '' : content));
  };

  const handleReply = (commentId: number, topId: number) => {
    setReplyingToId(prev => (prev === commentId ? null : commentId));
    setReplyTopId(prev => (replyingToId === commentId ? null : topId));
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const renderItem = (item: GuestbookItem | GuestbookReply, isReply = false) => {
    const isMenuOpen = openMenuId === item.id;
    const isEditing = editingId === item.id;
    const isReplying = replyingToId === item.id;

    return (
      <div
        key={`comment-${item.id}-${isReply ? 'reply' : 'parent'}`}
        className="comment-list__item"
      >
        <div className="comment-list__header">
          {isReply && (
            <Image
              src="/images/replyIcon.png"
              alt="대댓글 아이콘"
              width={16}
              height={16}
              className="comment-list__reply-icon"
            />
          )}
          <Image
            src={item.guestProfileImageUrl}
            alt={`${item.guestNickname}의 프로필`}
            width={32}
            height={32}
            className="comment-list__profile-image"
          />
          <div className="comment-list__info">
            <div className="comment-list__meta">
              <span className="comment-list__nickname">{item.guestNickname}</span>
              <div className="comment-list__meta-right">
                <span className="comment-list__date">{formatDate(item.createdAt)}</span>
                <div
                  className="comment-list__menu-wrapper"
                  ref={(el) => {
                    refs.current[item.id] = el;
                  }}
                >
                  <button
                    className="comment-list__menu-button"
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
                    <ProfileCommentUtils
                      guestId={item.guestId}
                      guestbookId={item.id}
                      topGuestbookId={item.topGuestbookId ?? null}
                      originalContent={item.content}
                      onCloseDropdown={() => setOpenMenuId(null)}
                      onRequestDelete={(id) => setDeleteTargetId(id)}
                      onRequestEditToggle={handleToggleEdit}
                      onRequestReply={(resolvedId) => handleReply(item.id, resolvedId)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="comment-list__text">
              {item.deleted ? (
                <del>삭제된 댓글입니다.</del>
              ) : isEditing ? (
                <ProfileEditCommentInput
                  originalContent={editingContent}
                  userId={item.guestId}
                  guestbookId={item.id}
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
              <ProfileReplyCommentInput
                topGuestbookId={replyTopId}
                userId={userId}
                onComplete={() => {
                  setReplyingToId(null);
                  setReplyTopId(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="comment-list">
      {data?.pages.flatMap((page) =>
        page.data.guestbooks.map((comment) => (
          <div key={`group-${comment.id}`}>
            {renderItem(comment)}
            {comment.replies?.map((reply) => renderItem(reply, true))}
          </div>
        ))
      )}

      {deleteTargetId !== null && (
        <CheckDeleteCommentModal
          guestbookId={deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onDeleteComplete={() => setDeleteTargetId(null)}
        />
      )}

      <div ref={loadMoreRef} style={{ height: '1px' }} />
    </div>
  );
};

export default ProfileCommentList;
