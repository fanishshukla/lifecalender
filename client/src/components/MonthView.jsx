import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export default function MonthView({ year, month, onBack }) {
  const firstDay = startOfMonth(new Date(year, month));
  const lastDay = endOfMonth(firstDay);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });

  return (
    <div className="w-full flex flex-col items-center">
      <button onClick={onBack} className="mb-6 text-blue-600 self-start">← Back</button>
      <h2 className="text-2xl font-bold mb-6">{format(firstDay, 'MMMM yyyy')}</h2>
      <div className="grid-10"> {/* Updated to 10 columns as requested */}
        {days.map(day => (
          <div key={day.toISOString()} className="unit-box relative group">
            <span className="text-[10px]">{format(day, 'd')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}