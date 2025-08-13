// IST (India Standard Time) utilities
export const IST_OFFSET = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30

// Get current time in IST
export const getCurrentISTTime = (): Date => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + IST_OFFSET);
};

// Format time in IST
export const formatISTTime = (date: Date = getCurrentISTTime()): string => {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date in IST
export const formatISTDate = (date: Date = getCurrentISTTime()): string => {
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Format full datetime in IST
export const formatISTDateTime = (date: Date = getCurrentISTTime()): string => {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Get IST date string (YYYY-MM-DD format)
export const getISTDateString = (date: Date = getCurrentISTTime()): string => {
  const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return istDate.toISOString().split('T')[0];
};

// Parse time string and create IST date
export const parseISTTime = (timeString: string, baseDate: Date = getCurrentISTTime()): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const istDate = new Date(baseDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  istDate.setHours(hours, minutes, 0, 0);
  return istDate;
};

// Check if a date is today in IST
export const isISTToday = (date: Date): boolean => {
  const today = getISTDateString();
  const checkDate = getISTDateString(date);
  return today === checkDate;
};

// Get start and end of day in IST
export const getISTDayBounds = (date: Date = getCurrentISTTime()) => {
  const istDateStr = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD format
  
  const startOfDay = new Date(`${istDateStr}T00:00:00+05:30`);
  const endOfDay = new Date(`${istDateStr}T23:59:59+05:30`);
  
  return { startOfDay, endOfDay };
};

// Convert any date to IST
export const convertToIST = (date: Date): Date => {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};
