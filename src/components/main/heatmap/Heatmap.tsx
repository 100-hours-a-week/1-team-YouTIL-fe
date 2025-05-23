'use client';

import CalHeatmap from 'cal-heatmap';
import { useState, useEffect, useRef } from 'react';
import 'cal-heatmap/cal-heatmap.css';
import './Heatmap.scss';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import LegendLite from 'cal-heatmap/plugins/LegendLite';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import type { PluginDefinition } from 'cal-heatmap';
// import { TooltipOptions } from 'cal-heatmap/plugins/Tooltip';
// import { LegendOptions } from 'cal-heatmap/plugins/LegendLite';
// import { CalendarLabelOptions } from 'cal-heatmap/plugins/CalendarLabel';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { format } from 'date-fns';
import useCheckAccess from '@/hooks/useCheckExistAccess';

const weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
const currentDate = new Date();
const basicYear = currentDate.getFullYear();
const rawCurrentMonth = currentDate.getMonth();
const adjustedCurrentMonth = rawCurrentMonth >= 9 ? 8 : rawCurrentMonth;

interface TilApiResponse {
  data: {
    year: number;
    tils: Record<string, number[]>;
  };
}

const monthMap: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04',
  may: '05', jun: '06', jul: '07', aug: '08',
  sep: '09', oct: '10', nov: '11', dec: '12',
};

interface TilData {
  date: string;
  count: number;
}

const Heatmap = () => {
  const [cal, setCal] = useState<CalHeatmap | null>(null);
  const [year, setYear] = useState(basicYear);
  const [currentMonth, setCurrentMonth] = useState(adjustedCurrentMonth);
  const heatmapRef = useRef<CalHeatmap | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [tilData, setTilData] = useState<TilData[]>([]);
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);

  useEffect(() => {
    const fetchTILData = async () => {
      if(!existAccess) return;
      
      try {
        const res = await callApi<TilApiResponse>({
          method: 'GET',
          endpoint: `/users/tils?year=${year}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });

        const raw = res.data?.tils ?? {};
        const formatted = Object.entries(raw).flatMap(([month, counts]) =>
          counts.map((count, index) => {
            const day = String(index + 1).padStart(2, '0');
            return {
              date: `${year}-${monthMap[month]}-${day}`,
              count,
            };
          })
        );

        setTilData(formatted);
      } catch (error) {
        console.error('TIL 데이터 로딩 실패:', error);
      }
    };

    fetchTILData();
  }, [year, accessToken, callApi]);

  useEffect(() => {
    if (!heatmapRef.current && tilData.length > 0) {
      const startMonthDate = new Date(`${year}-${String(currentMonth + 1).padStart(2, '0')}-01`);

      heatmapRef.current = new CalHeatmap();

      const plugins: PluginDefinition[] = [
        [
          Tooltip,
          {
            text: (date, value) =>
              `${value ?? 'No'} contributions on </br>${format(date, 'EEEE, MMMM d, yyyy')}`,
          },
        ],
        [
          LegendLite,
          {
            includeBlank: true,
            itemSelector: '#ex-ghDay-legend',
            radius: 2,
            width: 11,
            height: 11,
            gutter: 4,
          },
        ],
        [
          CalendarLabel,
          {
            width: 30,
            textAlign: 'start',
            text: () => weekdays.map((d, i) => (i % 2 === 0 ? '' : d)),
            padding: [25, 0, 0, 0],
          },
        ],
      ];

      heatmapRef.current.paint(
        {
          data: {
            source: tilData,
            type: 'json',
            x: 'date',
            y: 'count',
            groupY: 'max',
          },
          date: { start: startMonthDate },
          range: 4,
          scale: {
            color: {
              type: 'linear',
              range: ['#B3E7FC', '#5FC9F8', '#00B6F9', '#0075A8', '#004B70'],
              domain: [1, 2, 3, 4, 5],
            },
          },
          domain: {
            type: 'month',
            label: { text: 'MMM', textAlign: 'start', position: 'top' },
          },
          subDomain: { type: 'ghDay', radius: 2, width: 11, height: 11, gutter: 4 },
          itemSelector: '#ex-ghDay',
        },
        plugins,
      );

      setCal(heatmapRef.current);
    }
  }, [cal, year, currentMonth, tilData]);

  const handleNextClick = (year: number) => {
    cal?.jumpTo(`${year}-01-30`, true);
  };

  const handlePrevDomain = () => {
    if (currentMonth - 4 < 0) return;
    setCurrentMonth(prev => prev - 4);
    cal?.previous(4);
  };

  const handleNextDomain = () => {
    if (currentMonth + 4 > 11) return;
    setCurrentMonth(prev => prev + 4);
    cal?.next(4);
  };

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-wrapper__container">
        <div className="heatmap-wrapper__content">
          <div className="heatmap-wrapper__controls-left">
            <button onClick={handlePrevDomain}>&lt;</button>
          </div>

          <div id="ex-ghDay" className="heatmap-wrapper__calendar"></div>

          <div className="heatmap-wrapper__controls-right">
            <button onClick={handleNextDomain}>&gt;</button>
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
              <a
                onClick={() => {
                  setIsOpen(false);
                  handleNextClick(basicYear + offset);
                  setYear(basicYear + offset);
                  setCurrentMonth(0);
                }}
              >
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
