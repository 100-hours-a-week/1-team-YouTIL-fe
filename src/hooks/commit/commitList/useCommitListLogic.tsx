import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelectedCommitListStore } from '@/store/useSelectedCommitListStore';

interface Commit {
  commit_message: string;
  sha: string;
}

export const useCommitListLogic = (commits: Commit[]) => {
  const router = useRouter();
  const { setSelectedCommits } = useSelectedCommitListStore();

  const MAX_SELECTABLE_COMMITS = 5;

  const [selectedCommitIndexes, setSelectedCommitIndexes] = useState<number[]>([]);
  const [selectedCommitsPreview, setSelectedCommitsPreview] = useState<Commit[]>([]);
  const [shake, setShake] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedCommitIndexes([]);
    setSelectedCommitsPreview([]);
  }, [commits]);

  const isCommitSelectable = (index: number) => !!commits[index];

  const isCommitAlreadySelected = (index: number, selectedIndexes: number[]) =>
    selectedIndexes.includes(index);

  const getNextCommitIndexes = (index: number, selectedIndexes: number[]): number[] | null => {
    if (isCommitAlreadySelected(index, selectedIndexes)) {
      return selectedIndexes.filter((i) => i !== index);
    }

    if (selectedIndexes.length >= MAX_SELECTABLE_COMMITS) {
      triggerShakeAt(index);
      return null;
    }

    return [...selectedIndexes, index];
  };

  const triggerShakeAt = (index: number) => {
    setShakeIndex(index);
    setTimeout(() => setShakeIndex(null), 500);
  };

  const updateSelectedCommitsPreview = (indexes: number[]) => {
    const selected = indexes.map((i) => commits[i]);
    setSelectedCommitsPreview(selected);
  };

  const handleCommitClick = (index: number) => {
    if (!isCommitSelectable(index)) return;

    setSelectedCommitIndexes((prev) => {
      const next = getNextCommitIndexes(index, prev);
      if (!next) return prev;

      updateSelectedCommitsPreview(next);
      return next;
    });
  };

  const handleGenerateClick = () => {
    if (selectedCommitsPreview.length === 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setSelectedCommits(selectedCommitsPreview);
    router.push('/generate');
  };

  return {
    selectedCommitIndexes,
    shake,
    shakeIndex,
    handleCommitClick,
    handleGenerateClick,
  };
};
