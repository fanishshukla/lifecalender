import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function GoalSidebar({ goals = [], onAddGoal, onEditGoal, onDeleteGoal, isAchieved }) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Pinned Header */}
      <div className="p-4 border-b border-slate-100 shrink-0">
        <button
          onClick={onAddGoal}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-slate-900 transition-all shadow-sm"
        >
          <Plus size={16} strokeWidth={3} />
          Add Goal
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Target Goals</h3>
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-500 transition-all">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  {new Date(goal.target_date).getFullYear()}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditGoal(goal)} className="text-slate-400 hover:text-blue-600"><Edit2 size={12}/></button>
                  <button onClick={() => onDeleteGoal(goal.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={12}/></button>
                </div>
              </div>
              <h4 className="text-[11px] font-black italic uppercase tracking-tighter text-slate-900">{goal.content}</h4>
              {isAchieved(goal.target_date) && (
                <span className="text-[7px] font-black text-green-600 uppercase mt-2 block">✓ Achieved</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}