'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import useCheckAccess from '@/hooks/useCheckExistAccess';
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
import { tilKeys } from '@/querykey/til.querykey';
import './RepositoryDateCalendar.scss';
import { useRepositoryDateStore } from '@/store/useRepositoryDateStore';

type MonthKey =
  | 'jan' | 'feb' | 'mar' | 'apr'
  | 'may' | 'jun' | 'jul' | 'aug'
  | 'sep' | 'oct' | 'nov' | 'dec';

type TILYearlyRecord = {
  [key in MonthKey]?: number[];
};

interface TILYearlyRecordResponse {
  data: {
    year: number;
    tils: TILYearlyRecord;
  };
}

type InterviewYearlyRecord = {
  [key in MonthKey]?: number[];
};

interface InterviewYearlyRecordResponse {
  data: {
    year: number;
    interviews: InterviewYearlyRecord;
  };
}

const RepositoryDateCalendar = () => {
  const { callApi } = useFetch();
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const {
    activeTab,
    tilDate,
    interviewDate,
    setTilDate,
    setInterviewDate,
  } = useRepositoryDateStore();

  const rawDate =
    activeTab === 'interview' ? interviewDate : tilDate;
  const initialSelected =
    rawDate && !isNaN(Date.parse(rawDate))
      ? parseISO(rawDate)
      : new Date();

  const [currentDate, setCurrentDate] = useState(initialSelected);
  const [selectedDate, setSelectedDate] = useState(initialSelected);

  const selectedYear = currentDate.getFullYear();

  const { data: tilRecordData } = useQuery<TILYearlyRecordResponse>({
    //queryKey: ['til-date', selectedYear],
    queryKey: tilKeys.repositoryCalendar(selectedYear).queryKey,
    queryFn: async () => {
      const response = await callApi<TILYearlyRecordResponse>({
        method: 'GET',
        endpoint: `/tils/records?year=${selectedYear}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response;
    },
    enabled: activeTab === 'til' && existAccess,
    staleTime: 300000,
    gcTime: 300000,
  });

  const { data: interviewRecordData } = useQuery<InterviewYearlyRecordResponse>({
    queryKey: ['interview-date', selectedYear],
    queryFn: async () => {
      const response = await callApi<InterviewYearlyRecordResponse>({
        method: 'GET',
        endpoint: `/interviews/records?year=${selectedYear}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response;
    },
    enabled: activeTab === 'interview' && existAccess,
    staleTime: 300000,
    gcTime: 300000,
  });

  useEffect(() => {
    const formatted = format(selectedDate, 'yyyy-MM-dd');
    if (activeTab === 'interview') {
      setInterviewDate(formatted);
    } else {
      setTilDate(formatted);
    }
  }, [selectedDate, activeTab, setInterviewDate, setTilDate]);

  useEffect(() => {
    const newSelectedDate =
      rawDate && !isNaN(Date.parse(rawDate))
        ? parseISO(rawDate)
        : new Date();
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
  
    const monthKeys: MonthKey[] = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];
  
    const recordData =
      activeTab === 'til'
        ? tilRecordData?.data?.tils
        : interviewRecordData?.data?.interviews;
  
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
  
        const dateIndex = day.getDate() - 1;
        const monthKey = monthKeys[day.getMonth()];
  
        const isRecorded = recordData?.[monthKey]?.[dateIndex] === 1;
  
        days.push(
          <div
            key={day.toISOString()}
            className={`calendar__cell
              ${isSelected ? 'calendar__cell--selected' : ''}
              ${!isCurrentMonth ? 'calendar__cell--disabled' : ''}
              ${isRecorded ? 'calendar__cell--recorded' : ''}
            `}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span>{format(day, 'd')}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar__row" key={day.toISOString()}>
          {days}
        </div>
      );
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
