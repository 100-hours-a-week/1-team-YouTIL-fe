'use client';

import { useRef, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import './UserProfileInfo.scss';

import useOtherUserInfoStore from '@/store/useOtherUserInfoStore';
import useUserInfoStore from '@/store/useUserInfoStore';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import Image from 'next/image';

const UserProfileInfo = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessToken = useGetAccessToken();
  const { callApi } = useFetch();
  const queryClient = useQueryClient();

  const {
    profileUrl: originalProfileUrl,
    description: originalDescription,
    userId: otherUserId,
    name,
  } = useOtherUserInfoStore((state) => state.otherUserInfo);
  const setOtherUserInfo = useOtherUserInfoStore((state) => state.setOtherUserInfo);

  const myUserId = useUserInfoStore((state) => state.userInfo.userId);
  const isOwner = myUserId === otherUserId;

  const [editMode, setEditMode] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(originalProfileUrl);
  const [updatedDescription, setUpdatedDescription] = useState(originalDescription ?? '');

  useEffect(() => {
    setImagePreviewUrl(originalProfileUrl);
    setUpdatedDescription(originalDescription ?? '');
  }, [originalProfileUrl, originalDescription]);

  const mutation = useMutation({
    mutationFn: async () => {
      let newProfileImageUrl = originalProfileUrl;

      if (selectedImageFile) {
        const formData = new FormData();
        formData.append('image', selectedImageFile);

        const GCPImageUrl = await callApi<{ data: { imageUrl: string } }>({
          method: 'POST',
          endpoint: '/GCP/images',
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
          isFormData: true,
        });

        newProfileImageUrl = GCPImageUrl.data.imageUrl;
      }

      await callApi({
        method: 'PATCH',
        endpoint: '/users',
        body: {
          description: updatedDescription,
          profileImageUrl: newProfileImageUrl,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      setOtherUserInfo({
        userId: otherUserId,
        name,
        profileUrl: newProfileImageUrl,
        description: updatedDescription,
      });

      await queryClient.invalidateQueries({ queryKey: ['otheruser-info', otherUserId] });
      await queryClient.invalidateQueries({ queryKey: ['recent-tils'] });
      await queryClient.invalidateQueries({ queryKey: ['user-tils'] });
      setEditMode(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <div className="user-profile">
      {isOwner && (
        !editMode ? (
          <button className="user-profile__edit-button" onClick={() => setEditMode(true)}>
            수정
          </button>
        ) : (
          <button className="user-profile__edit-button" onClick={handleSubmit}>
            확인
          </button>
        )
      )}

      <div className="user-profile__content">
        <div
          className="user-profile__image-wrapper"
          onClick={() => {
            if (editMode && isOwner) fileInputRef.current?.click();
          }}
        >
          {imagePreviewUrl && (
            <Image
              src={imagePreviewUrl}
              alt="프로필 이미지"
              className="user-profile__image"
              width={120}
              height={120}
            />
          )}
          {editMode && isOwner && (
            <div className="user-profile__image-overlay">+</div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {!editMode ? (
          <div className="user-profile__introduction">
            {originalDescription ?? '유저 소개 없음'}
          </div>
        ) : (
          <div className="user-profile__textarea-wrapper">
            <textarea
              className="user-profile__textarea"
              value={updatedDescription}
              onChange={(e) => {
                if (e.target.value.length <= 40) {
                  setUpdatedDescription(e.target.value);
                }
              }}
              maxLength={40}
            />
            <div className="user-profile__textarea-count">
              {updatedDescription.length} / 40
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileInfo;
