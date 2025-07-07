import { createQueryKeys } from "@lukemorales/query-key-factory";

export const mainKeys = createQueryKeys('main', {
    userInfo: () => ['static'], // 메인화면 렌더링 시 유저 정보
    newTILList: () => ['static'], // 메인화면 NewTILList
    heatmapCalendar: (year: number) => [year], //메인화면 히트맵 캘린더
  });

