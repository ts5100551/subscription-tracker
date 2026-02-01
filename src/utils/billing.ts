import type { BillingCycle } from "../data/mock";

const clampToMonthEnd = (date: Date, originalDay: number) => {
  if (date.getDate() < originalDay) {
    date.setDate(0);
  }
  return date;
};

export const addMonths = (date: Date, count: number) => {
  const next = new Date(date);
  const originalDay = next.getDate();
  next.setMonth(next.getMonth() + count);
  return clampToMonthEnd(next, originalDay);
};

export const addYears = (date: Date, count: number) => {
  const next = new Date(date);
  const originalDay = next.getDate();
  next.setFullYear(next.getFullYear() + count);
  return clampToMonthEnd(next, originalDay);
};

export const getNextBillingDate = (
  startDate: string,
  cycle: BillingCycle,
  reference = new Date()
) => {
  const next = new Date(startDate);
  const ref = new Date(reference);
  next.setHours(0, 0, 0, 0);
  ref.setHours(0, 0, 0, 0);

  if (Number.isNaN(next.getTime())) {
    return new Date(reference);
  }

  const step = cycle === "monthly" ? addMonths : addYears;
  let cursor = next;
  while (cursor < ref) {
    cursor = step(cursor, 1);
  }
  return cursor;
};

export const daysUntil = (date: Date, reference = new Date()) => {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(0, 0, 0, 0);
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
};
