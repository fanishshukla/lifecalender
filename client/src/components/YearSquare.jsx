import React from 'react';

export const YearSquare = ({ year, index, goals = [], onHover, onClick, isAchieved }) => {
  const yearGoals = goals.filter(g => new Date(g.target_date).getFullYear() === year);
  
  return (
    <div 
      onMouseEnter={() => onHover(year)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(year)}
      className="aspect-square flex flex-col items-center justify-center p-2 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-900 hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all cursor-pointer group relative"
    >
      <span className="text-[10px] font-black opacity-30 absolute top-1 left-2">{index}</span>
      <span className="text-sm font-black tracking-tighter text-slate-900 group-hover:scale-110 transition-transform">{year}</span>
      
      <div className="flex gap-0.5 mt-1">
        {yearGoals.slice(0, 3).map(g => (
          <div 
            key={g.id} 
            className={`w-1.5 h-1.5 rounded-full ${isAchieved(g.target_date) ? 'bg-green-500' : 'bg-blue-500'}`} 
          />
        ))}
      </div>
    </div>
  );
};