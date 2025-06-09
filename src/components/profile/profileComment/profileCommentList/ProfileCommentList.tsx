'use client';

import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import Image from 'next/image';
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

  const { data } = useQuery<GuestbookResponse>({
    queryKey: ['guestbooks-list', userId],
    queryFn: async () => {
      const response = await callApi<GuestbookResponse>({
        method: 'GET',
        endpoint: `/users/${userId}/guestbooks?page=0&offset=20`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response;
    },
    enabled: !!userId && existAccess,
    staleTime: 300000,
    gcTime: 300000,
  });

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const renderItem = (item: GuestbookItem | GuestbookReply, isReply = false) => (
    <div
      key={`comment-${item.id}-${isReply ? 'reply' : 'parent'}`}
      className={`comment-list__item`}
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
            <span className="comment-list__date">{formatDate(item.createdAt)}</span>
          </div>
          <div className="comment-list__text">
            {item.deleted ? '삭제된 댓글입니다.' : item.content}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="comment-list">
      {data?.data.guestbooks.map((comment) => (
        <div key={`group-${comment.id}`}>
          {renderItem(comment)}
          {comment.replies?.map((reply) => renderItem(reply, true))}
        </div>
      ))}
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
      <div>
        asdf
      </div>
    </div>
  );
};

export default ProfileCommentList;
