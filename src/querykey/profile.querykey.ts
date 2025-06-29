import { createQueryKeys } from "@lukemorales/query-key-factory";

export const profileKeys = createQueryKeys('profile', {
    profileTIL:(userId : string) => ['til-profile', userId], // 프로필 개인 til 목록
});

