import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function GoalSidebar({ goals, onAddGoal, onEditGoal, onDeleteGoal, onToggleDone }) {
  // Sort goals by target date in ascending order
  const sortedGoals = [...goals].sort((a, b) => new Date(a.target_date) - new Date(b.target_date));

  return (
    <aside className="flex flex-col gap-6">
      <button 
        onClick={onAddGoal}
        className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
      >
        + Add Goal
      </button>
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[600px]">
        <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">Focus Goals</h3>
        <div className="space-y-6">
          {sortedGoals.length === 0 ? (
            <p className="text-xs text-slate-300 italic text-center">No goals set yet.</p>
          ) : (
            sortedGoals.map((g, index) => {
              const currentYear = new Date(g.target_date).getFullYear();
              const prevYear = index > 0 ? new Date(sortedGoals[index - 1].target_date).getFullYear() : null;
              const showYearHeader = currentYear !== prevYear;

              return (
                <div key={g.id} className="space-y-2">
                  {showYearHeader && (
                    <div className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded w-fit uppercase">
                      Target: {currentYear}
                    </div>
                  )}
                  <div 
                    className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${g.is_done ? 'opacity-40 grayscale' : 'hover:shadow-md'}`}
                    style={{ borderColor: g.color }}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={g.is_done} 
                        onChange={() => onToggleDone(g.id)}
                        className="w-4 h-4 rounded-full accent-slate-900 cursor-pointer"
                      />
                      <span className={`text-sm font-bold text-slate-800 ${g.is_done ? 'line-through' : ''}`}>{g.content}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil 
                        size={14} 
                        className="text-slate-400 hover:text-blue-600 cursor-pointer" 
                        onClick={() => onEditGoal(g)} 
                      />
                      <Trash2 
                        size={14} 
                        className="text-slate-400 hover:text-red-600 cursor-pointer" 
                        onClick={() => onDeleteGoal(g.id)} 
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}