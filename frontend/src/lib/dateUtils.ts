/**
 * MOAR CARS - Unified Date Utilities
 * Enforces booking rules:
 * 1. Past dates are blocked (min = today).
 * 2. Maximum booking window is strictly capped to exactly 60 days in advance (max = today + 60 days).
 * 3. Default pickup is today, default return is today + 2 days.
 */

/**
 * Returns local date in YYYY-MM-DD format
 */
export const formatDateToYMD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export const getTodayDateStr = (): string => {
  return formatDateToYMD(new Date());
};

/**
 * Returns date N days in the future formatted as YYYY-MM-DD in local time
 */
export const getFutureDateStr = (daysAhead: number = 2): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return formatDateToYMD(d);
};

/**
 * Returns maximum allowable booking date (strictly 60 days from today) formatted as YYYY-MM-DD
 */
export const getMaxBookingDateStr = (daysAhead: number = 60): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return formatDateToYMD(d);
};

/**
 * Ensures a date string falls within [today, today + 60 days].
 * If earlier than min, returns min. If later than max, returns max.
 */
export const clampBookingDate = (
  dateStr: string,
  minStr: string = getTodayDateStr(),
  maxStr: string = getMaxBookingDateStr(60)
): string => {
  if (!dateStr) return minStr;
  if (dateStr < minStr) return minStr;
  if (dateStr > maxStr) return maxStr;
  return dateStr;
};

