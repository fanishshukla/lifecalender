import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
// Updated import path as requested
import * as utils from '../utils/timelineUtils'; 
import { YearSquare, MonthCard } from './TimelineComponents';

export default function TimelineView({ 
  isOpen, onClose, goals = [], events = [], birthDate, onAddGoal, onQuickCreate 
}) {
  const [zoomedYear, setZoomedYear] = useState(null);
  const [selection, setSelection] = useState({ start: null, end: null });

  if (!isOpen) return null;

  const startYear = birthDate ? new Date(birthDate).getFullYear() : 1990;
  const years = Array.from({ length: 90 }, (_, i) => startYear + i);
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

  const handleDateClick = (year, month, day) => {
    const clickedDate = utils.formatUTCDate(year, month, day);
    if (!selection.start || (selection.start && selection.end)) {
      setSelection({ start: clickedDate, end: null });
    } else {
      const finalStart = selection.start < clickedDate ? selection.start : clickedDate;
      const finalEnd = selection.start < clickedDate ? clickedDate : selection.start;
      onQuickCreate(year, finalStart, finalEnd);
      setSelection({ start: null, end: null });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-2">
      <div className="bg-white w-full max-w-[98vw] h-[96vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
        
        {/* HEADER SECTION */}
        <div className="bg-slate-900 px-6 py-3 flex justify-between items-center text-white shrink-0">
          <div className="flex flex-col">
            {zoomedYear && (
              <button 
                onClick={() => setZoomedYear(null)} 
                className="flex items-center gap-2 text-blue-400 font-black text-[9px] tracking-widest uppercase mb-0.5 hover:text-white transition-colors"
              >
                <ArrowLeft size={10} /> BACK TO MATRIX
              </button>
            )}
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
              {zoomedYear ? `YEAR ${zoomedYear}` : "90 YEAR ARCHIVE"}
            </h2>
          </div>
          <button 
            onClick={() => { setZoomedYear(null); onClose(); }} 
            className="p-2 bg-white/10 hover:bg-red-500 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT AREA - scroll enabled to prevent date clipping */}
        <div className="flex-1 p-4 bg-[#F8FAFC] overflow-y-auto">
          {!zoomedYear ? (
            /* Matrix View */
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {years.map((year, index) => (
                <YearSquare 
                  key={year} year={year} index={index}
                  goals={utils.filterByYear(goals, year, 'target_date')}
                  events={utils.filterByYear(events, year, 'from_date')}
                  onClick={setZoomedYear}
                />
              ))}
            </div>
          ) : (
            /* Year View - Uses auto-rows to ensure all rows are visible */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
              {months.map((month, mIdx) => (
                <MonthCard 
                  key={month} 
                  month={month} 
                  mIdx={mIdx} 
                  year={zoomedYear}
                  monthGoals={utils.filterByMonth(goals, zoomedYear, mIdx, 'target_date')}
                  monthEvents={utils.filterByMonth(events, zoomedYear, mIdx, 'from_date')}
                  yearEvents={utils.filterByYear(events, zoomedYear, 'from_date')}
                  selection={selection}
                  onDateClick={handleDateClick}
                  onAddGoal={onAddGoal} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}