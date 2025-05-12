'use client';

import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,  
  isSameMonth,
  isSameDay,
  addDays,
  parseISO
} from 'date-fns';
import './RepositoryDateCalendar.scss';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';

const RepositoryDateCalendar = () => {
  const {
    activeTab,
    tilDate,
    interviewDate,
    setTilDate,
    setInterviewDate,
  } = useRepositoryDateStore();

  const rawDate = activeTab === 'interview' ? interviewDate : tilDate;
  const initialSelected = rawDate && !isNaN(Date.parse(rawDate))
    ? parseISO(rawDate)
    : new Date();

  const [currentDate, setCurrentDate] = useState(initialSelected);
  const [selectedDate, setSelectedDate] = useState(initialSelected);

  useEffect(() => {
    const formatted = format(selectedDate, 'yyyy-MM-dd');
    activeTab === 'interview' ? setInterviewDate(formatted) : setTilDate(formatted);
  }, [selectedDate]);

  useEffect(() => {
    const newSelectedDate = rawDate && !isNaN(Date.parse(rawDate)) ? parseISO(rawDate) : new Date();
    setSelectedDate(newSelectedDate);
    setCurrentDate(newSelectedDate);
  }, [activeTab]);

  const renderHeader = () => (
    <div className="calendar__header">
      <button onClick={() => setCurrentDate(subYears(currentDate, 1))}>{'<<'}</button>
      <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>{'<'}</button>
      <span>{format(currentDate, 'yyyy년 M월')}</span>
      <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>{'>'}</button>
      <button onClick={() => setCurrentDate(addYears(currentDate, 1))}>{'>>'}</button>
    </div>
  );

  const renderDays = () => {
    const start = startOfWeek(currentDate);
    return (
      <div className="calendar__days-row">
        {Array.from({ length: 7 }, (_, i) => (
          <div className="calendar__day" key={i}>
            {format(addDays(start, i), 'EEE')}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toISOString()}
            className={`calendar__cell ${
              isSelected ? 'calendar__cell--selected' : ''
            } ${!isCurrentMonth ? 'calendar__cell--disabled' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="calendar__row" key={day.toISOString()}>{days}</div>);
      days = [];
    }

    return <div className="calendar__body">{rows}</div>;
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default RepositoryDateCalendar;
