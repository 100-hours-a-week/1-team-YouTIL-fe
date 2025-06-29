import { createQueryKeys } from "@lukemorales/query-key-factory";

export const mainKeys = createQueryKeys('main', {
    userInfo: () => ['userInfo'], // 메인화면 렌더링 시 유저 정보
    newTILList: () => ['til-recent'], // 메인화면 NewTILList
    heatmapCalendar: (year: number) => ['til-heatmap', year], //메인화면 히트맵 캘린더
  });

