'use client';

import { useTILInfoStore } from '@/store/TILInfoStore';
import { useSelectedCommitListStore } from '@/store/selectedCommitListStore';
import { useUserOrganizationStore } from '@/store/userOrganizationStore';
import { useUserRepositoryStore } from '@/store/userRepositoryStore';
import { useUserBranchStore } from '@/store/userBranchStore';

const RepositoryTILList = () => {
  const { title, category, visibility } = useTILInfoStore();
  const { selectedCommits } = useSelectedCommitListStore();

  const selectedOrganization = useUserOrganizationStore((state) => state.selectedOrganization);
  const selectedRepository = useUserRepositoryStore((state) => state.selectedRepository);
  const selectedBranch = useUserBranchStore((state) => state.selectedBranch);

  return (
    <div>
      {/* <h2>TIL 정보</h2>
      <p>제목: {title}</p>
      <p>카테고리: {category}</p>
      <p>공개 여부: {visibility}</p>

      <h2>선택된 GitHub 정보</h2>
      <p>조직: {selectedOrganization?.organization_name ?? '없음'}</p>
      <p>저장소: {selectedRepository?.repositoryName ?? '없음'}</p>
      <p>브랜치: {selectedBranch?.branchName ?? '없음'}</p>

      <h2>선택된 커밋 목록</h2>
      <ul>
        {selectedCommits.map((commit, idx) => (
          <li key={idx}>
            {commit.commit_message} ({commit.sha})
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default RepositoryTILList;
