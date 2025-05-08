'use client'

import './GenerateTILForm.scss';
import { useSelectedCommitListStore } from '@/store/selectedCommitListStore';
import { useState } from 'react';

const GenerateTILForm = () => {
  const { selectedCommits } = useSelectedCommitListStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('풀스택');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === '') {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    console.log({
      title,
      category,
      visibility,
      commits: selectedCommits,
    });
  };

  return (
    <div className="generate">
      <form className="generate__form">
        <label className="generate__label">
          선택된 커밋 목록
          <section className="generate__commits">
            <ul className="generate__commits-list">
              {selectedCommits.map((commit, index) => (
                <li key={index} className="generate__commit-item">
                  {commit.commit_message}
                </li>
              ))}
            </ul>
          </section>
        </label>

        <label className="generate__label">
          TIL 제목
          <input
            type="text"
            maxLength={40}
            placeholder="TIL 제목을 입력하세요 (최대 40자)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="generate__input"
          />
        </label>

        <label className="generate__label">
          카테고리
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="generate__select"
          >
            <option value="풀스택">풀스택</option>
            <option value="인공지능">인공지능</option>
            <option value="클라우드">클라우드</option>
          </select>
        </label>

        <div className="generate__visibility">
          <label>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === 'public'}
              onChange={() => setVisibility('public')}
            />{' '}
            <span className="generate__visibility-radio">
            <p className="generate__visibility-radio-label">public</p>
            <p className="generate__visibility-radio-desc">다른 사용자에게 공유됩니다.</p>
            </span>
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={visibility === 'private'}
              onChange={() => setVisibility('private')}
            />{' '}
            <span className="generate__visibility-radio">
            <p className="generate__visibility-radio-label">private</p>
            <p className="generate__visibility-radio-desc">다른 사용자에게 공유되지 않습니다.</p>
            </span>
          </label>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className={`generate__button ${shake ? 'error shake' : ''}`}
        >
          생성하기
        </button>
      </form>
    </div>
  );
};

export default GenerateTILForm;
