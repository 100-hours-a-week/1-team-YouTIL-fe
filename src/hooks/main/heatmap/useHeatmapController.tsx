import { useEffect, useRef, useState } from 'react';
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import LegendLite from 'cal-heatmap/plugins/LegendLite';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import type { PluginDefinition } from 'cal-heatmap';
import { format } from 'date-fns';

interface TilData {
  date: string;
  count: number;
}

export const useHeatmapController = (tilData: TilData[], year: number, currentMonth: number) => {
  const heatmapRef = useRef<CalHeatmap | null>(null);
  const [cal, setCal] = useState<CalHeatmap | null>(null);

  useEffect(() => {
    if (!heatmapRef.current && tilData.length > 0) {
      const startMonthDate = new Date(`${year}-${String(currentMonth).padStart(2, '0')}-01`);
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
            text: () => ['Sun', '', 'Tues', '', 'Thur', '', 'Sat'], 
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
          date: { 
            start: startMonthDate
          },
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
  }, [tilData, year, currentMonth]);

  return { cal, heatmapRef };
};
