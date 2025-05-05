'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCommitListStore } from '@/store/userCommitListStore';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useUserBranchStore } from '@/store/userBranchStore';
import { useSelectedDateStore } from '@/store/userDateStore';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import NoCommitDescription from '@/components/description/noCommitDescription/NoCommitDescription';
import './CommitList.scss';

interface Commit {
  commit_message: string;
  sha: string;
}

interface CommitDetailResponse {
  data: {
    commits: Commit[];
  };
}

const CommitList = () => {
  const router = useRouter();
  const { commitMessages, setCommitMessages } = useCommitListStore();
  const selectedOrganizaion = useUserOrganizationStore((state) => state.selectedOrganization);
  const selectedRepository = useUserRepositoryStore((state) => state.selectedRepository);
  const selectedDate = useSelectedDateStore((state) => state.selectedDate);
  const selectedBranchName = useUserBranchStore((state) => state.selectedBranch);
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [shake, setShake] = useState(false);

  const toggleSelection = (index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const refreshCommitList = async () => {
    if (!selectedRepository || !selectedBranchName || !selectedDate) return;
    try {
      const response = await callApi<CommitDetailResponse>({
        method: 'GET',
        endpoint: `/github/commits?&organizationId=${selectedOrganizaion?.organization_id ?? ''}&repositoryId=${selectedRepository.repositoryId}&branchId=${selectedBranchName.branchName}&date=${selectedDate}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commits = response?.data?.commits ?? [];
      const messages = commits.map((commit) => commit.commit_message);
      setCommitMessages(messages);
      setSelectedIndexes([]);
    } catch (err) {
      console.error('커밋 새로고침 실패:', err);
    }
  };

  const handleGenerateClick = () => {
    if (!commitMessages || commitMessages.length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    router.push('/generate');
  };

  const canShowButtons = selectedRepository && selectedBranchName && selectedDate;

  return (
    <div className="commit-list">
      {canShowButtons && (
        <div className="commit-list__actions">
          <button className="commit-list__button" onClick={refreshCommitList}>
            🔄 새로고침
          </button>
          <button
            className={`commit-list__button ${shake ? 'shake error' : ''}`}
            onClick={handleGenerateClick}
          >
            생성
          </button>
        </div>
      )}

      {(!commitMessages || commitMessages.length === 0) ? (
        <NoCommitDescription />
      ) : (
        <ul className="commit-list__ul">
          {commitMessages.map((message, idx) => (
            <li
              key={idx}
              className={`commit-list__item ${selectedIndexes.includes(idx) ? 'commit-list__item--selected' : ''}`}
              onClick={() => toggleSelection(idx)}
            >
              <strong>{message}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommitList;
