import { format, differenceInDays, addDays, isToday, isPast, isFuture } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy') => {
  return format(new Date(date), formatStr);
};

export const getDaysBetween = (startDate: string, endDate: string) => {
  return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
};

export const getCurrentDay = (startDate: string) => {
  const start = new Date(startDate);
  const today = new Date();
  
  if (isPast(start) || isToday(start)) {
    return differenceInDays(today, start) + 1;
  }
  
  return 0;
};

export const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const today = new Date();
  
  if (isFuture(end)) {
    return differenceInDays(end, today);
  }
  
  return 0;
};

// Better function for challenge days remaining
export const getChallengeDaysRemaining = (startDate: string, totalDays: number) => {
  const currentDay = getCurrentDay(startDate);
  
  // If challenge hasn't started yet
  if (currentDay <= 0) {
    return totalDays;
  }
  
  // If challenge is completed
  if (currentDay > totalDays) {
    return 0;
  }
  
  // Calculate remaining days: total - current day
  return Math.max(0, totalDays - currentDay);
};

export const getDateRange = (startDate: string, totalDays: number) => {
  const start = new Date(startDate);
  const dates = [];
  
  for (let i = 0; i < totalDays; i++) {
    dates.push(addDays(start, i));
  }
  
  return dates;
};

export const isDateInRange = (date: string, startDate: string, endDate: string) => {
  const checkDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return checkDate >= start && checkDate <= end;
};