export default function YearView({ year, onBack, onMonthClick }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="w-full flex flex-col items-center">
      <button onClick={onBack} className="mb-6 text-blue-600 self-start">← Back</button>
      <h2 className="text-2xl font-bold mb-6">{year}</h2>
      <div className="grid-4"> {/* Updated to grid-4 */}
        {months.map((month, idx) => (
          <div key={month} className="unit-box h-20 text-lg font-medium" onClick={() => onMonthClick(idx)}>
            {month}
          </div>
        ))}
      </div>
    </div>
  );
}