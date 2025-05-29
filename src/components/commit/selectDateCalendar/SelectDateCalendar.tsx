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
  parseISO,
} from 'date-fns';
import './SelectDateCalendar.scss';
import { useSelectedDateStore } from '@/store/useDateStore';

const SelectDateCalendar = () => {
  const { selectedDate: storedDate, setSelectedDate } = useSelectedDateStore();

  const parsedStoredDate = storedDate ? parseISO(storedDate) : null;
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(parsedStoredDate ?? today);
  const [selectedDate, setSelectedDateLocal] = useState(parsedStoredDate ?? today);

  useEffect(() => {
    const formatted = format(selectedDate, 'yyyy-MM-dd');
    setSelectedDate(formatted);
  }, [selectedDate, setSelectedDate]);

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
    const days = [];
    const date = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="calendar__day" key={i}>
          {format(addDays(date, i), 'EEE')}
        </div>
      );
    }
    return <div className="calendar__days-row">{days}</div>;
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
            className={`calendar__cell ${isSelected ? 'calendar__cell--selected' : ''} ${!isCurrentMonth ? 'calendar__cell--disabled' : ''}`}
            key={day.toISOString()}
            onClick={() => setSelectedDateLocal(cloneDay)}
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

export default SelectDateCalendar;
