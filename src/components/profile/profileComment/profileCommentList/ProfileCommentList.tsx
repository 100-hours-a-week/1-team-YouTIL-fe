'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import { useState, useEffect, useRef } from 'react';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import Image from 'next/image';
import ProfileCommentUtils from '../profileCommentUtils/ProfileCommentUtils';
import CheckDeleteCommentModal from '../checkDeleteCommentModal/CheckDeleteCommentModal';
import ProfileEditCommentInput from '../profileEditCommentInput/ProfileEditCommentInput';
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
  const queryClient = useQueryClient();

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const refs = useRef<Record<number, HTMLDivElement | null>>({});
  

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuId !== null) {
        const dropdown = refs.current[openMenuId];
        if (dropdown && !dropdown.contains(e.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const { data } = useQuery<GuestbookResponse>({
    queryKey: ['guestbooks-list', userId],
    queryFn: async () => {
      return await callApi<GuestbookResponse>({
        method: 'GET',
        endpoint: `/users/${userId}/guestbooks?page=0&offset=20`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
    },
    enabled: !!userId && existAccess,
    staleTime: 300000,
    gcTime: 300000,
  });

  const handleToggleEdit = (targetId: number, content: string) => {
    if (editingId === targetId) {
      setEditingId(null);
      setEditingContent('');
    } else {
      setEditingId(targetId);
      setEditingContent(content);
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const renderItem = (item: GuestbookItem | GuestbookReply, isReply = false) => {
    const isMenuOpen = openMenuId === item.id;
    const isEditing = editingId === item.id;
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
                    originalContent={item.content}
                    onCloseDropdown={() => setOpenMenuId(null)}
                    onRequestDelete={(id) => setDeleteTargetId(id)}
                    onRequestEditToggle={handleToggleEdit}
                  />
                  )}
                </div>
              </div>
            </div>
            <div className="comment-list__text">
              {item.deleted ? (
                '삭제된 댓글입니다.'
              ) : isEditing ? (
                <ProfileEditCommentInput
                  originalContent={editingContent}
                  userId={item.guestId}
                  guestbookId={item.id}
                  onComplete={async () => {
                    setEditingId(null);
                    setEditingContent('');
                  }}
                />
              ) : (
                item.content
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="comment-list">
      {data?.data.guestbooks.map((comment) => (
        <div key={`group-${comment.id}`}>
          {renderItem(comment)}
          {comment.replies?.map((reply) => renderItem(reply, true))}
        </div>
      ))}

      {deleteTargetId !== null && (
        <CheckDeleteCommentModal
          guestbookId={deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onDeleteComplete={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  );
};

export default ProfileCommentList;
