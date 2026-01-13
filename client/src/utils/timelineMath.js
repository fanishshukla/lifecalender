/**
 * Generates the structure for the drill-down timeline
 */
export const generateTimelineStructure = (birthDate) => {
  const birthYear = new Date(birthDate).getFullYear();
  const years = [];
  
  for (let i = 0; i < 90; i++) {
    const year = birthYear + i;
    years.push({
      year,
      months: Array.from({ length: 12 }, (_, m) => ({
        month: m,
        days: new Date(year, m + 1, 0).getDate()
      }))
    });
  }
  return years;
};

export const isWeekend = (year, month, day) => {
  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
};