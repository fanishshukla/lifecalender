/**
 * Utility functions for Timeline and Calendar logic
 */

export const formatUTCDate = (year, month, day) => {
  return new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
};

export const filterByYear = (data, year, dateKey) => {
  if (!data || !year) return [];
  return data.filter(item => {
    const d = new Date(item[dateKey]);
    return d.getUTCFullYear() === Number(year);
  });
};

export const filterByMonth = (data, year, monthIndex, dateKey) => {
  return data.filter(item => {
    const d = new Date(item[dateKey]);
    return d.getUTCFullYear() === Number(year) && d.getUTCMonth() === monthIndex;
  });
};

export const isDateInEventRange = (dateStr, events) => {
  return events.some(e => {
    const start = e.from_date.split('T')[0];
    const end = e.to_date.split('T')[0];
    return dateStr >= start && dateStr <= end;
  });
};

export const getDaysInMonth = (year, month) => {
  // month is 0-indexed (0=Jan, 11=Dec)
  return new Date(year, month + 1, 0).getDate();
};