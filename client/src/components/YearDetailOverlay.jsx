import React, { useState } from 'react';
import { X } from 'lucide-react';

export const YearDetailOverlay = ({ 
  year, goals, events, highlightedEvent, onClose, onEditGoal, onEditEvent, onQuickCreate, isAchieved 
}) => {
  const [localRangeStart, setLocalRangeStart] = useState(null);

  // Helper to check if a day belongs to the highlighted event
  const isDateInHighlightedRange = (m, d) => {
    if (!highlightedEvent) return false;
    const checkDate = new Date(year, m, d);
    checkDate.setHours(0, 0, 0, 0);
    
    const start = new Date(highlightedEvent.from_date);
    const end = new Date(highlightedEvent.to_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return checkDate >= start && checkDate <= end;
  };

  const getEventForDate = (m, d) => {
    const checkDate = new Date(year, m, d);
    checkDate.setHours(0, 0, 0, 0);
    return events.find(e => {
      const start = new Date(e.from_date);
      const end = new Date(e.to_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate <= end;
    });
  };

  const handleDayClick = (m, d) => {
    const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (!localRangeStart) {
      setLocalRangeStart(dateStr);
    } else {
      const start = localRangeStart < dateStr ? localRangeStart : dateStr;
      const end = localRangeStart < dateStr ? dateStr : localRangeStart;
      onQuickCreate('range', start, end);
      setLocalRangeStart(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[85vh] bg-white rounded-[2.5rem] border-4 border-slate-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* MODAL HEADER */}
        <div className="px-8 py-4 border-b-4 border-slate-900 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-6">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">{year}</h2>
            {highlightedEvent && (
              <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                <span className="text-[10px] font-black uppercase tracking-widest italic">Viewing: {highlightedEvent.title}</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-3 bg-slate-900 text-white rounded-full hover:scale-110 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <X size={24}/>
          </button>
        </div>

        {/* 4x3 GRID */}
        <div className="flex-1 p-6 grid grid-cols-4 grid-rows-3 gap-4 bg-white overflow-hidden">
          {[...Array(12)].map((_, monthIndex) => {
            const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'short' });
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

            return (
              <div key={monthIndex} className="border-2 border-slate-900 rounded-2xl p-3 flex flex-col bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <span className="text-[10px] font-black italic uppercase tracking-widest text-slate-400 mb-2">{monthName}</span>

                <div className="grid grid-cols-7 gap-1">
                  {[...Array(daysInMonth)].map((_, d) => {
                    const day = d + 1;
                    const event = getEventForDate(monthIndex, day);
                    const isHighlighted = isDateInHighlightedRange(monthIndex, day);
                    const isSelected = localRangeStart === `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                    return (
                      <div 
                        key={d} 
                        onClick={() => handleDayClick(monthIndex, day)}
                        onDoubleClick={() => event && onEditEvent(event)}
                        className={`aspect-square flex items-center justify-center text-[7px] font-black rounded border transition-all cursor-pointer relative
                          ${isHighlighted ? 'bg-yellow-400 border-black scale-110 z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black' : ''}
                          ${!isHighlighted && event ? 'border-slate-900 text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : ''}
                          ${!isHighlighted && !event ? 'border-slate-100 text-slate-300 hover:bg-slate-50' : ''}
                          ${isSelected ? 'bg-blue-500 border-black scale-110 z-20 text-white' : ''}`}
                        style={{ backgroundColor: isSelected || isHighlighted ? '' : (event ? event.color : 'transparent') }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};