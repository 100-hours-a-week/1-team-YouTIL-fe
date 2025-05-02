'use client';

// @ts-ignore
import CalHeatmap from 'cal-heatmap';
import { useState, useEffect, useRef } from 'react';
import 'cal-heatmap/cal-heatmap.css';
import './Heatmap.scss';
// @ts-ignore
import Tooltip from 'cal-heatmap/plugins/Tooltip';
// @ts-ignore
import LegendLite from 'cal-heatmap/plugins/LegendLite';
// @ts-ignore
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';

const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const currentYear = new Date();
const basicYear = currentYear.getFullYear();

const sampleTILData = [
  { date: '2025-01-01', count: 1 },
  { date: '2025-01-05', count: 9 },
];

const Heatmap = () => {
    const [cal, setCal] = useState<any>(null);
    const [year, setYear] = useState(basicYear);
    const heatmapRef = useRef<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!heatmapRef.current) {
            heatmapRef.current = new CalHeatmap();
            heatmapRef.current.paint(
                {
                    data: {
                        source: sampleTILData,
                        type: 'json',
                        x: 'date',
                        y: 'count',
                        groupY: 'max',
                    },
                    date: { start: new Date(`${year}-01-01`) },
                    range: 4,
                    scale: {
                        color: {
                            type: 'linear',
                            range: ['#8dfc98', '#4dfa5d', '#00ff18', '#00c713', '#00870d'],
                            domain: [1, 3, 5, 7, 9],
                        },
                    },
                    domain: {
                        type: 'month',
                        label: { text: 'MMM', textAlign: 'start', position: 'top' },
                    },
                    subDomain: { type: 'ghDay', radius: 2, width: 11, height: 11, gutter: 4 },
                    itemSelector: '#ex-ghDay',
                },
                [
                    [
                        Tooltip,
                        {
                            text: function (date: Date, value: number, dayjsDate: any) {
                                return (
                                    (value ? value : 'No') +
                                    ' contributions on </br>' + 
                                    dayjsDate.format('dddd, MMMM D, YYYY')
                                );
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
                            text: () => weekdays.map((d, i) => (i % 2 === 0 ? '' : d)),
                            padding: [25, 0, 0, 0],
                        },
                    ],
                ]
            );
            setCal(heatmapRef.current);
        }
    }, [cal, year]);

    const handleNextClick = (year: number) => {
        cal.jumpTo(`${year}-01-30`, true);
    };

    const handlePrevDomain = () => {
        cal?.previous(4);
    };

    const handleNextDomain = () => { 
        cal?.next(4);
    };

    return (

        <div className="heatmap-wrapper">
            <div className="heatmap-container">
                <div className='heatmap-content'>
                    <div className="heatmap-controls-left">
                        <button onClick={handlePrevDomain}>←</button>
                    </div>

                    <div id="ex-ghDay" className="heatmap-calendar"></div>

                    <div className='heatmap-controls-right'>
                        <button onClick={handleNextDomain}>→</button>
                    </div>
                </div>
                <div className="heatmap-legend">
                    <span className="heatmap-legend-label">Less</span>
                    <div id="ex-ghDay-legend" className="heatmap-legend-bar"></div>
                    <span className="heatmap-legend-label">More</span>
                </div>
            </div>
            <div className='heatmap-space'></div>

            <div className="heatmap-dropdown">
                <div className="heatmap-year-button">
                    <button onClick={() => setIsOpen(prev => !prev)} type="button">
                        {year}
                    </button>
                </div>
                {isOpen && (
                    <div className="heatmap-dropdown-content">

                            {[0, 1, 2, 3, 4].map(offset => (
                                <li key={offset}>
                                    <a
                                        onClick={() => {
                                            setIsOpen(false);
                                            handleNextClick(basicYear + offset);
                                            setYear(basicYear + offset);
                                        }}
                                        >
                                        {basicYear + offset}
                                    </a>
                                </li>
                            ))}

                    </div>
                )}
            </div>

        </div>
    );
};

export default Heatmap;
