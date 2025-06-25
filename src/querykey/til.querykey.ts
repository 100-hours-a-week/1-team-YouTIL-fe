import { createQueryKeys } from "@lukemorales/query-key-factory";

export const tilKeys = createQueryKeys('til', {
    newTILList: () => ['recent'], // 메인화면 NewTILList
    heatmapCalendar: (year: number) => ['heatmap', year], //메인화면 히트맵 캘린더
    repositoryCalendar:(selectedYear: number) => ['repository-calendar', selectedYear], // 레포지토리 캘린더 점
    repositoryTIL:(tilDate : string) => ['repository-til', tilDate], // 레포지토리 til 목록
    profileTIL:(userId : string) => ['profile-til', userId], // 프로필 개인 til 목록
  });

