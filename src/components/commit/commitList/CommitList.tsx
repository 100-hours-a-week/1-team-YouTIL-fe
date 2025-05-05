'use client';

import { useState } from 'react';
import { useCommitListStore } from '@/store/userCommitListStore';
import NoCommitDescription from '@/components/description/noCommitDescription/NoCommitDescription';
import './CommitList.scss';

const CommitList = () => {
  const { commitMessages } = useCommitListStore();
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  if (!commitMessages || commitMessages.length === 0) {
    return <NoCommitDescription />;
  }

  const toggleSelection = (index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="commit-list">
      <ul className="commit-list__ul">
        {commitMessages.map((message, idx) => (
          <li
            key={idx}
            className={`commit-list__item ${
              selectedIndexes.includes(idx) ? 'commit-list__item--selected' : ''
            }`}
            onClick={() => toggleSelection(idx)}
          >
            <strong>{message}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitList;
