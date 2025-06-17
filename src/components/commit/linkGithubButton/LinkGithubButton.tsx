'use client';

import SelectOrganizationModal from '../selectOrganizationModal/SelectOrganizationModal';
import SelectRepositoryModal from '../selectRepositoryModal/SelectRepositoryModal';
import SelectBranchModal from '../selectBranchModal/SelectBranchModal';
import './LinkGithubButton.scss';

import { useRepositoryStore } from '@/store/useRepositoryStore';
import { useBranchStore } from '@/store/useBranchStore';
import { useModal } from '@/hooks/useModal';

const LinkGithubButton = () => {
  const organizationModal = useModal();
  const repositoryModal = useModal();
  const branchModal = useModal();

  const selectedRepository = useRepositoryStore((state) => state.selectedRepository);
  const selectedBranchName = useBranchStore((state) => state.selectedBranch);

  const handleCompleteOrganizationSelection = () => {
    organizationModal.close();
    repositoryModal.open();
  };

  const handleCompleteRepositorySelection = () => {
    repositoryModal.close();
    branchModal.open();
  };

  return (
    <>
      {selectedRepository && selectedBranchName ? (
        <div className="link-github-button__info">
          <span className="link-github-button__repo-name">{selectedRepository.repositoryName}</span>
          <button
            className="link-github-button__change"
            onClick={organizationModal.open}
          >
            변경
          </button>
        </div>
      ) : (
        <div className="link-github-button" onClick={organizationModal.open}>
          깃허브 연동하기
        </div>
      )}

      {organizationModal.isOpen && (
        <SelectOrganizationModal
          onClose={organizationModal.close}
          onComplete={handleCompleteOrganizationSelection}
        />
      )}

      {repositoryModal.isOpen && (
        <SelectRepositoryModal
          onClose={repositoryModal.close}
          onComplete={handleCompleteRepositorySelection}
        />
      )}

      {branchModal.isOpen && (
        <SelectBranchModal
          onClose={branchModal.close}
        />
      )}
    </>
  );
};

export default LinkGithubButton;
