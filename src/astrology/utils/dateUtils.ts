import { MakeTime } from 'astronomy-engine';

/**
 * Parses a date string and time string into a Julian Day.
 * @param dateString - The date in YYYY-MM-DD format
 * @param timeString - The time in HH:mm or HH:mm:ss format
 * @returns The Julian Day
 */
export const parseDateTime = (
  dateString: string,
  timeString: string
): number => {
  // Parse date string (YYYY-MM-DD)
  const [yearStr, monthStr, dayStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  
  // Parse time string (HH:mm or HH:mm:ss)
  const timeParts = timeString.split(':');
  const hour = parseInt(timeParts[0], 10);
  const minute = parseInt(timeParts[1], 10);
  const second = timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0;
  
  // Create a Date object
  const date = new Date(year, month - 1, day, hour, minute, second);
  
  // Calculate Julian Day using astronomy-engine
  const astroTime = MakeTime(date);
  return astroTime.tt;  // Return the Terrestrial Time as Julian Day
};
