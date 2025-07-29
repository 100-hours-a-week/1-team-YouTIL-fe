import Tooltip from 'cal-heatmap/plugins/Tooltip';
import LegendLite from 'cal-heatmap/plugins/LegendLite';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import type { PluginDefinition } from 'cal-heatmap';
import { format } from 'date-fns';



export const getCalHeatmapPlugins = (): PluginDefinition[] => [
  [
    Tooltip,
    {
        text: (date, value) =>
            `${value ?? 'No'} contributions on </br>${format(new Date(date), 'EEEE, MMMM d, yyyy')}`,
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
