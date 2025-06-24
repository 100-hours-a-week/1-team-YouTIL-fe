import { createQueryKeys } from "@lukemorales/query-key-factory";

export const tilKeys = createQueryKeys('tils', {
    recent: () => ['recent'],
    record: () => ['record'],
    listByDate: (tilDate: string) => ['list', tilDate],
    detail: (tilId: number) => ['detail', tilId],
    calendarByYear : (selectedYear: number) => ['til-Calendar', selectedYear],
    profileTIL : (userId : string) => ['profile-til', userId],
  });
