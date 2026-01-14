import React from 'react';
import { PlusCircle } from 'lucide-react';
// Updated import path as requested
import * as utils from '../utils/timelineUtils'; 

export const YearSquare = ({ year, index, goals, events, onClick }) => (
  <button
    onClick={() => onClick(year)}
    className="relative flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all h-full min-h-[80px] group"
  >
    <span className="text-[9px] text-slate-400 font-bold absolute top-1.5 left-2">{index}</span>
    <span className="text-[14px] font-black text-slate-800">{year}</span>
    <div className="flex gap-1 mt-1">
      {goals.length > 0 && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
      {events.length > 0 && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
    </div>
  </button>
);

export const MonthCard = ({ 
  month, mIdx, year, monthGoals, monthEvents, 
  yearEvents, selection, onDateClick, onAddGoal 
}) => {
  
  // FIX: Dynamic calculation ensures 29, 30, and 31 are never hidden
  const daysInMonth = new Date(year, mIdx + 1, 0).getDate();

  const handleAddGoalClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onAddGoal === 'function') {
      const targetDate = utils.formatUTCDate(year, mIdx, 1);
      onAddGoal({ target_date: targetDate });
    }
  };

  return (
    <div className="bg-white p-3 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <button 
          onClick={handleAddGoalClick}
          className="text-[11px] font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 flex items-center gap-1 group"
        >
          {month} <PlusCircle size={12} className="text-blue-500 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Grid: No fixed rows to prevent clipping dates */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = utils.formatUTCDate(year, mIdx, day);
          
          // Weekend Detection (Sat=6, Sun=0)
          const dateObj = new Date(year, mIdx, day);
          const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

          // Event/Goal Detection
          const hasEvent = monthEvents.some(e => {
            const start = e.from_date.split('T')[0];
            const end = e.to_date.split('T')[0];
            return dateStr >= start && dateStr <= end;
          });
          const hasGoal = monthGoals.some(g => g.target_date.split('T')[0] === dateStr);
          const isSelected = selection.start === dateStr || selection.end === dateStr;

          // Styling Priority Logic
          let bgClass = "transparent";
          let textClass = "text-slate-400";

          if (hasEvent) {
            bgClass = "bg-emerald-500 shadow-sm"; // Green Background
            textClass = "text-white";
          } else if (hasGoal) {
            bgClass = "bg-blue-600 shadow-sm";    // Blue Background
            textClass = "text-white";
          } else if (isWeekend) {
            bgClass = "bg-slate-100";           // Gray Weekend Circle
            textClass = "text-slate-500";
          }

          return (
            <div 
              key={day} 
              onClick={() => onDateClick(year, mIdx, day)}
              className={`aspect-square rounded-full flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all hover:scale-110
                ${bgClass} ${textClass} ${isSelected ? 'ring-2 ring-blue-400 ring-offset-1 z-10' : ''}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};