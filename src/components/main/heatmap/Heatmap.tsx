'use client';

import { useState } from 'react';
import { useHeatmapController } from '@/hooks/main/heatmap/useHeatmapController';
import { usePrevDomainStep } from '@/hooks/main/heatmap/usePrevDomainStep';
import { useNextDomainStep } from '@/hooks/main/heatmap/useNextDomainStep';
import { useHeatmapYearDropdown } from '@/hooks/main/heatmap/useHeatmapYearDropdown';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import './Heatmap.scss';
import 'cal-heatmap/cal-heatmap.css';

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

  const { data: tilData = [] } = useQuery({
    queryKey: ['til-data', year],
    queryFn: async () => {
      const res = await callApi<{
        data: {
          year: number;
          tils: Record<string, number[]>;
        };
      }>({
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

  const { cal } = useHeatmapController(tilData, year, currentMonth);
  const { isOpen, setIsOpen, handleNextClick } = useHeatmapYearDropdown(setYear, setCurrentMonth, cal);
  const prevStep = usePrevDomainStep(currentMonth);
  const nextStep = useNextDomainStep(currentMonth);

  const handlePrevDomain = () => {
    if (prevStep === 0) return;
    setCurrentMonth(prev => prev - prevStep);
    cal?.previous(prevStep);
  };

  const handleNextDomain = () => {
    if (nextStep === 0) return;
    setCurrentMonth(prev => prev + nextStep);
    cal?.next(nextStep);
  };

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-wrapper__container">
        <div className="heatmap-wrapper__content">
          <div className="heatmap-wrapper__controls-left">
            <button className={prevStep === 0 ? 'disabled' : ''} onClick={handlePrevDomain}>&lt;</button>
          </div>

          <div id="ex-ghDay" className="heatmap-wrapper__calendar"></div>

          <div className="heatmap-wrapper__controls-right">
            <button className={nextStep === 0 ? 'disabled' : ''} onClick={handleNextDomain}>&gt;</button>
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
              <a onClick={() => handleNextClick(basicYear + offset)}>
                {basicYear + offset}
              </a>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
