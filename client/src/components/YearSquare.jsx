// client/src/components/YearSquare.jsx
import React from 'react';
import { Star } from 'lucide-react';

export function YearSquare({ 
  year, 
  index, 
  goals = [], 
  events = [], 
  onHover, 
  onClick, 
  isAchieved,
  isPast,
  isSenior,
  isMilestone
}) {
  // Determine background color logic based on the stage of life
  let bgColor = "bg-white";
  if (isSenior) bgColor = "bg-red-50";     // Light red for 62+ years
  if (isPast) bgColor = "bg-slate-200";   // Gray for past and current years

  // Filter both goals and events for this specific year
  const yearGoals = goals.filter(g => new Date(g.target_date).getFullYear() === year);
  const yearEvents = events.filter(e => new Date(e.from_date).getFullYear() === year);

  return (
    <div
      onMouseEnter={() => onHover(year)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      className={`relative aspect-square border-2 border-slate-100 rounded-xl p-1 cursor-pointer transition-all hover:scale-105 hover:shadow-xl hover:z-10 group flex flex-col items-center justify-center ${bgColor}`}
    >
      {/* Golden Milestone Star (20, 40, 60, 80 years) */}
      {isMilestone && (
        <div className="absolute -top-2 -right-2 z-20 group/star">
          <Star size={14} fill="#fbbf24" color="#fbbf24" className="drop-shadow-sm" />
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/star:block bg-slate-900 text-white text-[8px] font-black uppercase py-1 px-2 rounded whitespace-nowrap">
            Golden years ({index} years old)
          </div>
        </div>
      )}

      {/* Year Index (Age) */}
      <span className="text-[8px] font-black text-slate-400 absolute top-1 left-1.5 leading-none">
        {index}
      </span>

      {/* Year Label */}
      <span className={`text-[11px] font-black italic leading-none ${isPast ? 'text-slate-600' : 'text-slate-900'}`}>
        {year}
      </span>

      {/* Indicators Container (Events & Goals) */}
      <div className="flex flex-wrap gap-0.5 mt-1 justify-center px-0.5">
        
        {/* Render Event Dots (Emerald Green) */}
        {yearEvents.map((event, i) => (
          <div 
            key={`ev-${event.id || i}`} 
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 border-[0.5px] border-white shadow-sm"
            title={`Event: ${event.title}`}
          />
        ))}

        {/* Render Goal Dots (Blue, or Green if achieved) */}
        {yearGoals.map((goal, i) => (
          <div 
            key={`gl-${goal.id || i}`} 
            className="w-1.5 h-1.5 rounded-full border-[0.5px] border-white shadow-sm" 
            style={{ backgroundColor: isAchieved(goal.target_date) ? '#10b981' : '#2563eb' }} 
            title={`Goal: ${goal.content}`}
          />
        ))}

      </div>
    </div>
  );
}