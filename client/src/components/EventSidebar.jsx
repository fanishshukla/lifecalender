import React from 'react';
import { Plus, Calendar, Edit2, Trash2 } from 'lucide-react';

export default function EventSidebar({ events, onAddEvent, onOpenTimeline, onEditEvent, onDeleteEvent }) {
  const groupedEvents = events.reduce((acc, event) => {
    const year = new Date(event.from_date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(event);
    return acc;
  }, {});

  const years = Object.keys(groupedEvents).sort((a, b) => b - a);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Pinned Header - Never Scrolls */}
      <div className="p-4 border-b border-slate-100 space-y-2 shrink-0">
        <button
          onClick={onAddEvent}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all"
        >
          <Plus size={16} strokeWidth={3} />
          Add Event
        </button>
        <button
          onClick={onOpenTimeline}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-slate-900 text-slate-900 rounded-xl text-[10px] font-black uppercase italic tracking-widest hover:bg-slate-50 transition-all"
        >
          <Calendar size={16} />
          View Timeline
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Memory Archive</h3>
        {years.length === 0 ? (
          <p className="text-[10px] font-bold text-slate-300 italic text-center mt-10">No events recorded...</p>
        ) : (
          years.map(year => (
            <div key={year} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-slate-900">{year}</span>
                <div className="h-[1px] flex-1 bg-slate-100"></div>
              </div>
              <div className="space-y-2">
                {groupedEvents[year].map(event => (
                  <div key={event.id} className="group p-3 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[11px] font-black uppercase leading-tight truncate pr-4">{event.title}</h4>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEditEvent(event)} className="text-slate-400 hover:text-blue-600"><Edit2 size={12}/></button>
                        <button onClick={() => onDeleteEvent(event.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={12}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}