// src/viewmodels/useCalendar.ts

import { useMemo } from 'react';
import {
  differenceInDays,
  addDays,
  format,
  parseISO,
  startOfMonth,
  addMonths,
  isAfter,
  isBefore,
} from 'date-fns';
import { Course } from '../models/Course';

export type ZoomLevel = '1 Mo' | '3 Mo' | '6 Mo' | '1 Yr';

const DAY_WIDTH_MAP: Record<ZoomLevel, number> = {
  '1 Mo': 14,
  '3 Mo': 5,
  '6 Mo': 3,
  '1 Yr': 1.5,
};

export interface MonthLabel {
  label: string;
  x: number;
}

export interface CalendarLayout {
  dayWidthPx: number;
  timelineStart: Date;
  timelineEnd: Date;
  totalDays: number;
  timelineWidth: number;
  todayX: number;
  monthLabels: MonthLabel[];
  barX: (course: Course) => number;
  barWidth: (course: Course) => number;
}

export function useCalendar(courses: Course[], zoom: ZoomLevel): CalendarLayout {
  return useMemo(() => {
    const dayWidthPx = DAY_WIDTH_MAP[zoom];

    // Determine timeline boundaries
    const today = new Date();

    let earliest: Date = today;
    let latest: Date = addDays(today, 30);

    for (const c of courses) {
      const start = parseISO(c.startDate);
      const end = parseISO(c.targetEndDate);
      if (isBefore(start, earliest)) earliest = start;
      if (isAfter(end, latest)) latest = end;
    }

    const timelineStart = startOfMonth(earliest);
    const timelineEnd = addDays(latest, 14);
    const totalDays = Math.max(differenceInDays(timelineEnd, timelineStart), 1);
    const timelineWidth = totalDays * dayWidthPx;
    const todayX = Math.max(
      differenceInDays(today, timelineStart) * dayWidthPx,
      0
    );

    // Build month label positions
    const monthLabels: MonthLabel[] = [];
    let cursor = startOfMonth(timelineStart);
    while (isBefore(cursor, timelineEnd)) {
      const x = differenceInDays(cursor, timelineStart) * dayWidthPx;
      const showYear =
        cursor.getMonth() === 0 || differenceInDays(cursor, timelineStart) < 5;
      const label = showYear
        ? format(cursor, "MMM ''yy")
        : format(cursor, 'MMM');
      monthLabels.push({ label, x });
      cursor = addMonths(cursor, 1);
    }

    const barX = (course: Course): number => {
      const start = parseISO(course.startDate);
      return Math.max(differenceInDays(start, timelineStart) * dayWidthPx, 0);
    };

    const barWidth = (course: Course): number => {
      const start = parseISO(course.startDate);
      const end = parseISO(course.targetEndDate);
      return Math.max(differenceInDays(end, start) * dayWidthPx, 4);
    };

    return {
      dayWidthPx,
      timelineStart,
      timelineEnd,
      totalDays,
      timelineWidth,
      todayX,
      monthLabels,
      barX,
      barWidth,
    };
  }, [courses, zoom]);
}
