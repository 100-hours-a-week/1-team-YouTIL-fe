'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { useHeatmapInitializer } from '@/hooks/main/heatmap/useHeatmapInitializer';
import { useHeatmapYearDropdown } from '@/hooks/main/heatmap/useHeatmapYearDropdown';
import { useHeatmapNavigation } from '@/hooks/main/heatmap/useHeatmapNavigation';
import { mainKeys } from '@/querykey/main.querykey';
import './Heatmap.scss';
import 'cal-heatmap/cal-heatmap.css';

interface TILDayCount {
  date: string;
  count: number;
}

type TILYearlyRawRecord = Record<string, number[]>;

interface TILYearlyRecordResponse {
  data: {
    year: number;
    tils: TILYearlyRawRecord;
  };
}

const currentDate = new Date();
const basicYear = currentDate.getFullYear();
const rawCurrentMonth = currentDate.getMonth() + 1;
const adjustedCurrentMonth = rawCurrentMonth >= 9 ? 9 : rawCurrentMonth;

const monthMap: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04',
  may: '05', jun: '06', jul: '07', aug: '08',
  sep: '09', oct: '10', nov: '11', dec: '12',
};

const Heatmap = () => {
  const [year, setYear] = useState(basicYear);
  const [currentMonth, setCurrentMonth] = useState(adjustedCurrentMonth);
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  const { data: tilData = [] } = useQuery<TILDayCount[]>({
    queryKey: mainKeys.heatmapCalendar(year).queryKey,
    queryFn: async () => {
      const response = await callApi<TILYearlyRecordResponse>({
        method: 'GET',
        endpoint: `/users/tils?year=${year}`,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });

      const raw = response.data?.tils ?? {};
      return Object.entries(raw).flatMap(([month, counts]) =>
        counts.map((count, index) => {
          const day = String(index + 1).padStart(2, '0');
          return {
            date: `${year}-${monthMap[month as keyof typeof monthMap]}-${day}`,
            count,
          };
        })
      );
    },
    enabled: existAccess,
    staleTime: 600000,
    gcTime: 3600000,
  });

  const { cal } = useHeatmapInitializer(tilData, year, currentMonth);

  const {
    prevStep,
    nextStep,
    handlePrevDomain,
    handleNextDomain,
    handleYearJump,
  } = useHeatmapNavigation(cal, currentMonth, setCurrentMonth, setYear);

  const { isOpen, setIsOpen } = useHeatmapYearDropdown();

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-wrapper__container">
        <div className="heatmap-wrapper__content">
          <div className="heatmap-wrapper__controls-left">
            <button className={prevStep === 0 ? 'disabled' : ''} onClick={handlePrevDomain}>
              &lt;
            </button>
          </div>

          <div id="ex-ghDay" className="heatmap-wrapper__calendar"></div>

          <div className="heatmap-wrapper__controls-right">
            <button className={nextStep === 0 ? 'disabled' : ''} onClick={handleNextDomain}>
              &gt;
            </button>
          </div>
        </div>

        <div className="heatmap-wrapper__legend">
          <span className="heatmap-wrapper__legend-label">Less</span>
          <div id="ex-ghDay-legend" className="heatmap-wrapper__legend-bar"></div>
          <span className="heatmap-wrapper__legend-label">More</span>
        </div>
      </div>

      <div className="heatmap-wrapper__space"></div>

      <div className="heatmap-wrapper__dropdown">
        <div className="heatmap-wrapper__dropdown-year-button">
          <button onClick={() => setIsOpen(prev => !prev)} type="button">
            {year}
          </button>
        </div>

        <div className={`heatmap-wrapper__dropdown-content ${isOpen ? 'show' : ''}`}>
          {[0, 1, 2, 3, 4].map(offset => (
            <li key={offset}>
              <button onClick={() => handleYearJump(basicYear + offset)}>
                {basicYear + offset}
              </button>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
