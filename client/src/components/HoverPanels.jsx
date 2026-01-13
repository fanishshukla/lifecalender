import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export const HoverPanels = ({ year, events = [], goals = [], isAchieved }) => {
  if (!year) return null;

  const yearEvents = events.filter(e => {
    const start = new Date(e.from_date).getFullYear();
    const end = new Date(e.to_date).getFullYear();
    return year >= start && year <= end;
  });

  const yearGoals = goals.filter(g => new Date(g.target_date).getFullYear() === year);

  return (
    <>
      {yearEvents.length > 0 && (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 w-64 z-[120] animate-in fade-in slide-in-from-left-4">
          <div className="bg-white p-4 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black italic mb-4 border-b-2 border-slate-100 pb-2 uppercase tracking-tighter">Events {year}</h3>
            <div className="space-y-3">
              {yearEvents.map(e => (
                <div key={e.id} className="flex gap-3 items-center">
                  <div className="w-3 h-3 rounded-full shrink-0 border-2 border-slate-900" style={{backgroundColor: e.color}} />
                  <p className="text-xs font-black uppercase truncate">{e.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {yearGoals.length > 0 && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 w-64 z-[120] animate-in fade-in slide-in-from-right-4">
          <div className="bg-white p-4 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black italic mb-4 border-b-2 border-slate-100 pb-2 uppercase tracking-tighter">Goals {year}</h3>
            <div className="space-y-3">
              {yearGoals.map(g => (
                <div key={g.id} className="flex gap-3 items-center">
                  {isAchieved(g.target_date) ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-blue-500" />}
                  <p className="text-xs font-black uppercase truncate">{g.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};