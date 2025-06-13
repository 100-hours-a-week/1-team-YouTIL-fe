import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';

interface TilApiResponse {
  data: {
    year: number;
    tils: Record<string, number[]>;
  };
}

interface TilData {
  date: string;
  count: number;
}

const monthMap: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04',
  may: '05', jun: '06', jul: '07', aug: '08',
  sep: '09', oct: '10', nov: '11', dec: '12',
};

export const useHeatmapData = (year: number) => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  return useQuery<TilData[]>({
    queryKey: ['til-data', year],
    queryFn: async () => {
      const res = await callApi<TilApiResponse>({
        method: 'GET',
        endpoint: `/users/tils?year=${year}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });

      const raw = res.data?.tils ?? {};
      return Object.entries(raw).flatMap(([month, counts]) =>
        counts.map((count, index) => {
          const day = String(index + 1).padStart(2, '0');
          return {
            date: `${year}-${monthMap[month]}-${day}`,
            count,
          };
        })
      );
    },
    enabled: existAccess,
    staleTime: 600000,
    gcTime: 3600000,
  });
};
