'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import { useState, useEffect, useRef } from 'react';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useInfinityScrollObserver } from '@/hooks/useInfinityScrollObserver';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ProfileCommentUtils from '../profileCommentUtils/ProfileCommentUtils';
import CheckDeleteCommentModal from '../checkDeleteCommentModal/CheckDeleteCommentModal';
import ProfileEditCommentInput from '../profileEditCommentInput/ProfileEditCommentInput';
import ProfileReplyCommentInput from '../profileReplyCommentInput/ProfileReplyCommentInput';
import { useModal } from '@/hooks/useModal';
import { profileKeys } from '@/querykey/profile.querykey';
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

const ProfileCommentList = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const { otherUserInfo } = useOtherUserInfoStore();
  const userId = otherUserInfo.userId;
  const existAccess = useCheckAccess(accessToken);
  const router = useRouter();

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
    queryKey: profileKeys.profileCommentList(userId ?? undefined).queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await callApi<GuestbookResponse>({
        method: 'GET',
        endpoint: `/users/${userId}/guestbooks?page=${pageParam}&offset=20`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.guestbooks.length < 20) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    enabled: !!userId && existAccess,
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

  const renderItem = (item: GuestbookItem | GuestbookReply, isReply = false) => {
    const isMenuOpen = openMenuId === item.id;
    const isEditing = editingId === item.id;
    const isReplying = replyingToId === item.id;

    return (
      <div
        key={`comment-${item.id}-${isReply ? 'reply' : 'parent'}`}
        className="profile-comment-list__item"
      >
        <div className="profile-comment-list__header">
          {isReply && (
            <Image
              src="/images/replyIcon.png"
              alt="대댓글 아이콘"
              width={16}
              height={16}
              className="profile-comment-list__reply-icon"
            />
          )}
          <Image
            src={item.guestProfileImageUrl}
            alt={`${item.guestNickname}의 프로필`}
            width={32}
            height={32}
            className="profile-comment-list__profile-image"
            onClick={() => handleMoveToProfile(item.guestId)}
          />
          <div className="profile-comment-list__info">
            <div className="profile-comment-list__meta">
              <span
                className="profile-comment-list__nickname"
                onClick={() => handleMoveToProfile(item.guestId)}
              >
                {item.guestNickname}
              </span>
              <div className="profile-comment-list__meta-right">
                <span className="profile-comment-list__date">{formatDate(item.createdAt)}</span>
                <div
                  className="profile-comment-list__menu-wrapper"
                  ref={(el) => {
                    refs.current[item.id] = el;
                  }}
                >
                  <button
                    className="profile-comment-list__menu-button"
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
            <div className="profile-comment-list__text">
              {item.deleted || item.content === '페이지 소유자가 삭제한 댓글입니다.' ? (
                <del>{item.content}</del>
              ) : isEditing ? (
                <ProfileEditCommentInput
                  originalContent={editingContent}
                  profileUserId={userId}
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
    <div className="profile-comment-list">
      {data?.pages.flatMap((page) =>
        page.data.guestbooks.map((comment) => (
          <div key={`group-${comment.id}`}>
            {renderItem(comment)}
            {comment.replies?.map((reply) => renderItem(reply, true))}
          </div>
        ))
      )}

      {deleteModal.isOpen && deleteTargetId !== null && (
        <CheckDeleteCommentModal
          guestbookId={deleteTargetId}
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

export default ProfileCommentList;
