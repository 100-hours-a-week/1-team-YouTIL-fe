import { createQueryKeys } from "@lukemorales/query-key-factory";

export const profileKeys = createQueryKeys('profile', {
    tilList:(userId : string) => [userId], // 프로필 개인 til 목록
    commentList:(userId? : number) => [userId], // 프로필 방명록 리스트
    userInfo:() => ['static'], // 프로필 내 정보
    otherUserInfo:(parsedUserId : number) => [parsedUserId], //프로필 다른 유저 정보
});

