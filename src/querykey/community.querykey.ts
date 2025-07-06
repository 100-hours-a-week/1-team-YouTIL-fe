import { createQueryKeys } from "@lukemorales/query-key-factory";

export const communityKeys = createQueryKeys('community', {
    communityComment:(tilIdNumber:number) => ['comment', tilIdNumber], // 브랜치 충돌 테스트
});

