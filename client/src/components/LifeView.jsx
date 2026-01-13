export default function LifeView({ birthDate, onYearClick, goals }) {
  // 1. Calculate the starting year
  const birthYear = birthDate ? new Date(birthDate).getFullYear() : 1995;
  const currentYear = new Date().getFullYear();
  
  // 2. Generate an array of 90 years
  const years = Array.from({ length: 90 }, (_, i) => birthYear + i);

  return (
    <div className="grid-10"> 
      {years.map(year => {
        // 3. Logic for styling based on status
        const isPast = year < currentYear;
        const isCurrent = year === currentYear;
        
        // Check if this specific year has an associated goal in the database
        const hasGoal = goals && goals.some(g => {
          const gDate = new Date(g.target_date);
          return gDate.getFullYear() === year;
        });

        return (
          <div 
            key={year} 
            className={`unit-box 
              ${isPast ? 'lived opacity-40' : ''} 
              ${isCurrent ? 'border-2 border-blue-500 scale-105 shadow-md' : ''}
              ${hasGoal ? 'bg-yellow-100 border-yellow-600' : ''}
            `}
            onClick={() => onYearClick(year)}
            title={hasGoal ? "Goal set for this year!" : ""}
          >
            {year}
          </div>
        );
      })}
    </div>
  );
}