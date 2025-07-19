'use client';

import './CheckDeleteTILModal.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import { mainKeys } from '@/querykey/main.querykey';
import { repositoryKeys } from '@/querykey/repository.querykey';
import { profileKeys } from '@/querykey/profile.querykey';
import useGetAccessToken from '@/hooks/useGetAccessToken';

interface Props {
  tilIds: number[];
  onClose: () => void;
  onDeleteComplete: () => void;
}

const CheckDeleteTILModal = ({ tilIds, onClose, onDeleteComplete }: Props) => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      await callApi({
        method: 'DELETE',
        endpoint: `/tils`,
        body: {
          tilIds,
        },
        headers: { 
            Authorization: `Bearer ${accessToken}` 
        },
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mainKeys.newTILList().queryKey});
      queryClient.invalidateQueries({ queryKey: repositoryKeys.tilCalendar._def, exact:false})
      queryClient.invalidateQueries({ queryKey: repositoryKeys.tilList._def, exact: false})
      queryClient.invalidateQueries({ queryKey: profileKeys.tilList._def, exact: false})
      onDeleteComplete();
      onClose();
    },
  });

  return (
    <section className="til-delete-modal">
      <div className="til-delete-modal__overlay" onClick={onClose} />
      <article className="til-delete-modal__content" role="dialog" aria-modal="true">
        <header>
        <p className="til-delete-modal__text">선택한 TIL을 삭제하시겠습니까?</p>
        <p className="til-delete-modal__subtext">한 번 삭제한 댓글은 복구가 불가능합니다!</p>
        </header>
        <footer className="til-delete-modal__buttons">
          <button className="til-delete-modal__button til-delete-modal__button--cancel" onClick={onClose}>
            취소
          </button>
          <button className="til-delete-modal__button til-delete-modal__button--confirm" onClick={() => mutate()}>
            삭제
          </button>
        </footer>
      </article>
    </section>
  );
};

export default CheckDeleteTILModal;
