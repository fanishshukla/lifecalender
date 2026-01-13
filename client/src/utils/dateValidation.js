/**
 * Generates min and max date strings for HTML date inputs based on current view.
 */
export const getDateConstraints = (view, selectedYear, selectedMonth) => {
  if (view === 'year' && selectedYear) {
    return {
      min: `${selectedYear}-01-01`,
      max: `${selectedYear}-12-31`
    };
  }
  
  if (view === 'month' && selectedYear && selectedMonth !== null) {
    const month = String(selectedMonth + 1).padStart(2, '0');
    // Calculate last day of the month
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return {
      min: `${selectedYear}-${month}-01`,
      max: `${selectedYear}-${month}-${lastDay}`
    };
  }

  // Default for Life View (no strict constraint, or 90-year limit)
  return { min: '', max: '' };
};