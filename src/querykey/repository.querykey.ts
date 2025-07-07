import { createQueryKeys } from "@lukemorales/query-key-factory";

export const repositoryKeys = createQueryKeys('repository', {
    tilCalendar:(selectedYear: number) => [selectedYear], // 레포지토리 캘린더 til 기록
    interviewCalendar: (selectedYear: number) => [selectedYear], // 레포지토리 캘린더 면접질문 기록
    tilList:(tilDate : string) => [tilDate], // 레포지토리 til 목록
    tilDetail:(expandedTilId? : number) => [expandedTilId], // 레포지토리 til 상세
    interviewList: (interviewDate: string) => [interviewDate], // 레포지토리 면접질문 목록
    interviewDetail: (expandedInterviewId?: number) => [expandedInterviewId], // 레포지토리 면접질문 디테일 
  });

