import React from 'react';
import { X, PlusCircle, Target } from 'lucide-react';

export default function TimelineView({ 
  isOpen, 
  onClose, 
  selectedYear, // e.g., 2026
  goals = [], 
  events = [],
  onAddGoal 
}) {
  if (!isOpen) return null;

  // ROBUST FILTERING: Ensures we compare Numbers to Numbers and handle UTC dates
  const targetYear = Number(selectedYear);
  
  const yearGoals = goals.filter(g => {
    if (!g.target_date) return false;
    return new Date(g.target_date).getUTCFullYear() === targetYear;
  });

  const yearEvents = events.filter(e => {
    if (!e.from_date) return false;
    return new Date(e.from_date).getUTCFullYear() === targetYear;
  });

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-7xl h-[94vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border border-white/10">
        
        {/* --- BLACK HEADER SECTION --- */}
        <div className="bg-slate-900 p-10 flex justify-between items-center">
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline gap-4">
              <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
                {selectedYear}
              </h2>
              <span className="text-blue-400 font-black uppercase text-xs tracking-[0.4em]">Annual Objectives</span>
            </div>
            
            {/* Horizontal Goal Bar */}
            <div className="flex flex-wrap gap-2">
              {yearGoals.length > 0 ? (
                yearGoals.map((goal) => (
                  <div key={goal.id} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl flex items-center gap-3">
                    <Target size={14} className="text-blue-400" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{goal.content}</span>
                  </div>
                ))
              ) : (
                <div className="py-2 px-4 rounded-xl border border-dashed border-white/20">
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] italic">
                    No goals found for {selectedYear}. Click a month name below to add one.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button onClick={onClose} className="p-4 bg-white/10 hover:bg-red-500 text-white rounded-2xl transition-all group">
            <X size={32} strokeWidth={3} />
          </button>
        </div>

        {/* --- CALENDAR GRID --- */}
        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 no-scrollbar bg-[#F8FAFC]">
          {months.map((month, mIdx) => {
            const daysCount = getDaysInMonth(targetYear, mIdx);
            const monthGoals = yearGoals.filter(g => new Date(g.target_date).getUTCMonth() === mIdx);
            
            return (
              <div key={month} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6 group/month">
                  {/* CLICKABLE MONTH NAME */}
                  <button 
                    onClick={() => onAddGoal({ target_date: new Date(Date.UTC(targetYear, mIdx, 1)).toISOString().split('T')[0] })}
                    className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-slate-900 hover:text-blue-600 transition-all"
                  >
                    {month}
                    <PlusCircle size={16} className="opacity-0 group-hover/month:opacity-100 text-blue-600" />
                  </button>

                  {/* Monthly Indicators */}
                  <div className="flex gap-1">
                    {monthGoals.map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-blue-600 rounded-full ring-4 ring-blue-50" />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: daysCount }, (_, i) => {
                    const day = i + 1;
                    const hasEvent = yearEvents.some(e => {
                      const d = new Date(e.from_date);
                      return d.getUTCMonth() === mIdx && d.getUTCDate() === day;
                    });

                    return (
                      <div 
                        key={day} 
                        className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all
                          ${hasEvent 
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-110 z-10' 
                            : 'text-slate-300 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'}
                        `}
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
}