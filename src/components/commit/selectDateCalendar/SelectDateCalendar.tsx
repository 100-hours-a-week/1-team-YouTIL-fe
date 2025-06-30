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
import { useOrganizationStore } from '@/store/useOrganizationStore';
import { useRepositoryStore } from '@/store/useRepositoryStore';
import { useBranchStore } from '@/store/useBranchStore';
import useGetAccessToken from '@/hooks/useGetAccessToken';
import { useQuery } from '@tanstack/react-query';
import { useFetch } from '@/hooks/useFetch';
import useCheckAccess from '@/hooks/useCheckExistAccess';
import { commitKeys } from '@/querykey/commit.querykey';

interface CommitCalendarResponse {
  calendar: Record<string, number>;
}

const SelectDateCalendar = () => {
  const { selectedDate: storedDate, setSelectedDate } = useSelectedDateStore();
  const selectedOrganization = useOrganizationStore((state) => state.selectedOrganization);
  const selectedRepository = useRepositoryStore((state) => state.selectedRepository);
  const selectedBranchName = useBranchStore((state) => state.selectedBranch);
  const accessToken = useGetAccessToken();
  const existAccess = useCheckAccess(accessToken);
  const { callApi } = useFetch();

  const parsedStoredDate = storedDate ? parseISO(storedDate) : new Date();
  const [currentDate, setCurrentDate] = useState(parsedStoredDate);
  const [selectedDate, setSelectedDateLocal] = useState(parsedStoredDate);

  const year = format(currentDate, 'yyyy');

  const { data: commitData } = useQuery({
    queryKey: commitKeys.commitListCalendar(
      selectedOrganization?.organization_id,
      selectedRepository?.repositoryId,
      selectedBranchName?.branchName,
      year
    ).queryKey,
    queryFn: async () => {
      if (!selectedRepository || !selectedBranchName) return { calendar: {} };

      const queryParams = new URLSearchParams({
        repositoryId: String(selectedRepository.repositoryId),
        branchId: selectedBranchName.branchName,
        year,
      });

      if (selectedOrganization) {
        queryParams.append('organizationId', String(selectedOrganization.organization_id));
      }
      const response = await callApi<{ data: CommitCalendarResponse }>({
        method: 'GET',
        endpoint: `/github/commits/records?${queryParams.toString()}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return response.data;
    },
    enabled: !!selectedRepository && !!selectedBranchName && existAccess,
    staleTime: 3600000,
    gcTime: 3600000,
  });

  useEffect(() => {
    setSelectedDate(format(selectedDate, 'yyyy-MM-dd'));
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
    const commitDates = new Set(Object.keys(commitData?.calendar || {}));

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isRecorded = commitDates.has(format(day, 'yyyy-MM-dd'));

        days.push(
          <div
            key={day.toISOString()}
            className={`calendar__cell
              ${isSelected ? 'calendar__cell--selected' : ''}
              ${!isCurrentMonth ? 'calendar__cell--disabled' : ''}
              ${isRecorded ? 'calendar__cell--recorded' : ''}
            `}
            onClick={() => setSelectedDateLocal(cloneDay)}
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

export default SelectDateCalendar;
