import './NewTILList.scss';

const NewTILList = () => {
    const NewTILListDm = [
      {
        title: '로그인 및 회원가입 기능 구현',
        image: 'img',
        tags: ['jwt', 'redis'],
        nickname: 'jun.jang',
        views: 12,
        likes: 0,
        date: '2024.12.12 : 18:30:20',
      },
      {
        title: 'Github OAuth 로그인 연동',
        image: 'img',
        tags: ['OAuth', 'NextAuth'],
        nickname: 'hee.lee',
        views: 20,
        likes: 3,
        date: '2024.12.11 : 10:15:45',
      },
      {
        title: 'PostgreSQL DB Schema 설계',
        image: 'img',
        tags: ['PostgreSQL', 'ERD'],
        nickname: 'kim.dev',
        views: 8,
        likes: 1,
        date: '2024.12.10 : 09:42:00',
      },
      {
        title: 'Infinite Scroll 구현하기',
        image: 'img',
        tags: ['IntersectionObserver', 'scroll'],
        nickname: 'dong.min',
        views: 15,
        likes: 2,
        date: '2024.12.09 : 21:10:05',
      },
      {
        title: 'Zustand 상태관리 도입',
        image: 'img',
        tags: ['zustand', 'global-state'],
        nickname: 'hyeon.kang',
        views: 25,
        likes: 5,
        date: '2024.12.08 : 14:05:12',
      },
      {
        title: 'React Query 캐싱 전략 최적화',
        image: 'img',
        tags: ['react-query', 'cache'],
        nickname: 'eun.ji',
        views: 11,
        likes: 0,
        date: '2024.12.07 : 12:30:40',
      },
      {
        title: 'Next.js App Router 적용',
        image: 'img',
        tags: ['Next.js', 'App Router'],
        nickname: 'choi.dev',
        views: 30,
        likes: 4,
        date: '2024.12.06 : 17:50:25',
      },
      {
        title: 'CI/CD 파이프라인 구성',
        image: 'img',
        tags: ['GitHub Actions', 'CI/CD'],
        nickname: 'hye.seo',
        views: 18,
        likes: 2,
        date: '2024.12.05 : 08:30:30',
      },
      {
        title: 'S3 이미지 업로드 기능',
        image: 'img',
        tags: ['AWS', 'S3'],
        nickname: 'jung.ho',
        views: 22,
        likes: 3,
        date: '2024.12.04 : 11:20:15',
      },
      {
        title: 'Tailwind에서 SCSS로 마이그레이션',
        image: 'img',
        tags: ['Tailwind', 'SCSS'],
        nickname: 'park.jun',
        views: 19,
        likes: 1,
        date: '2024.12.03 : 19:45:50',
      },
    ];
  
    return (
        <div className="til-list">
          {NewTILListDm.map((til, index) => (
            <div key={index} className="til-list__card">
              <div className="til-list__header">
                <p className="til-list__image">{til.image}</p>
                <p className="til-list__title">{til.title}</p>
              </div>
              <div className="til-list__tags">
                {til.tags.map((tag, i) => (
                    <span key={i} className="til-list__tag">{tag}</span>
                ))}
            </div>

              <div className="til-list__footer">
                <span className="til-list__nickname">{til.nickname}</span>
                <span className="til-list__views">조회수 {til.views}</span>
                <span className="til-list__likes">추천 {til.likes}</span>
                <span className="til-list__date">{til.date}</span>
              </div>
            </div>
          ))}
        </div>
      );
  };
  
  export default NewTILList;
  