// client/src/components/YearDetailOverlay.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

export const YearDetailOverlay = ({ 
  year, goals, events, highlightedEvent, onClose, onEditGoal, onEditEvent, onQuickCreate, isAchieved 
}) => {
  const [localRangeStart, setLocalRangeStart] = useState(null);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handleDayClick = (m, d) => {
    // Format date as YYYY-MM-DD
    const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    if (!localRangeStart) {
      setLocalRangeStart(dateStr);
    } else {
      // Send the range to the modal
      const start = localRangeStart < dateStr ? localRangeStart : dateStr;
      const end = localRangeStart < dateStr ? dateStr : localRangeStart;
      
      onQuickCreate(year, start, end);
      setLocalRangeStart(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] border-4 border-slate-900 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b-4 border-slate-900 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">Year {year}</h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">
              Select two dates to create a range
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-900 text-white rounded-full hover:rotate-90 transition-all">
            <X size={32} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="grid grid-cols-4 gap-8">
            {months.map((monthName, monthIndex) => {
              const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
              return (
                <div key={monthName} className="space-y-3">
                  <h3 className="font-black uppercase italic text-slate-400 text-sm tracking-widest border-b-2 border-slate-100 pb-1">
                    {monthName}
                  </h3>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const event = events.find(e => {
                        const s = new Date(e.from_date).toISOString().split('T')[0];
                        const o = new Date(e.to_date).toISOString().split('T')[0];
                        return dateStr >= s && dateStr <= o;
                      });

                      const isSelected = localRangeStart === dateStr;

                      return (
                        <div 
                          key={day} 
                          onClick={() => handleDayClick(monthIndex, day)}
                          className={`aspect-square flex items-center justify-center text-[8px] font-black rounded border transition-all cursor-pointer
                            ${isSelected ? 'bg-blue-600 border-black text-white scale-110 z-10' : ''}
                            ${!isSelected && event ? 'text-white' : 'text-slate-300 hover:bg-slate-50 border-slate-100'}
                          `}
                          style={{ backgroundColor: isSelected ? '' : (event ? event.color : 'transparent'), borderColor: event ? 'black' : '' }}
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
    </div>
  );
};