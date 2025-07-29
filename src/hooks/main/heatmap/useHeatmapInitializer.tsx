import { useEffect, useRef, useState } from 'react';
import type { PluginDefinition } from 'cal-heatmap';
import type CalHeatmap from 'cal-heatmap';

interface TilData {
  date: string;
  count: number;
}

export const useHeatmapInitializer = (tilData: TilData[], year: number, currentMonth: number) => {
  const heatmapRef = useRef<CalHeatmap | null>(null);
  const [cal, setCal] = useState<CalHeatmap | null>(null);

  useEffect(() => {
    if (!heatmapRef.current && tilData.length > 0) {
      const startMonthDate = new Date(`${year}-${String(currentMonth).padStart(2, '0')}-01`);

      const loadHeatmap = async () => {
        const CalHeatmap = (await import('cal-heatmap')).default;
        const Tooltip = (await import('cal-heatmap/plugins/Tooltip')).default;
        const LegendLite = (await import('cal-heatmap/plugins/LegendLite')).default;
        const CalendarLabel = (await import('cal-heatmap/plugins/CalendarLabel')).default;

        heatmapRef.current = new CalHeatmap();

        const plugins: PluginDefinition[] = [
[
        Tooltip,
        {
          text: (date: Date | string | number, value: number | null) => {
            const d = new Date(date);
            return `${value ?? 'No'} contributions on ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
          },
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

        await heatmapRef.current.paint(
          {
            data: {
              source: tilData,
              type: 'json',
              x: 'date',
              y: 'count',
              groupY: 'max',
            },
            date: {
              start: startMonthDate,
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
            subDomain: {
              type: 'ghDay',
              radius: 2,
              width: 11,
              height: 11,
              gutter: 4,
            },
            itemSelector: '#ex-ghDay',
          },
          plugins
        );

        setCal(heatmapRef.current);
      };

      loadHeatmap();
    }
  }, [tilData, year, currentMonth]);

  return { cal, heatmapRef };
};
