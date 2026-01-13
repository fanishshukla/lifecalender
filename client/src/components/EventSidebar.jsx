import React from 'react';
import { Plus, Calendar } from 'lucide-react';

export default function EventSidebar({ events = [], onAddEvent, onOpenTimeline }) {
  // Sort by date so newest is on top
  const sortedEvents = Array.isArray(events) 
    ? [...events].sort((a, b) => new Date(b.from_date) - new Date(a.from_date))
    : [];

  return (
    <div className="w-80 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0">
      <div className="p-6 space-y-4 border-b border-slate-100">
        <button
          onClick={onAddEvent}
          className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1"
        >
          <Plus size={20} strokeWidth={3} />
          Add Event
        </button>

        <button
          onClick={onOpenTimeline}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 border-2 border-blue-100 rounded-xl font-black uppercase italic tracking-widest hover:bg-blue-100 transition-all"
        >
          <Calendar size={18} />
          Show Life Timeline
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timeline Events</h3>
        
        {sortedEvents.length === 0 ? (
          <p className="text-xs text-slate-300 italic">No events found.</p>
        ) : (
          sortedEvents.map((event) => {
            const year = new Date(event.from_date).getFullYear();
            return (
              <div key={event.id} className="group cursor-default">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{year}</span>
                <div className="mt-1 p-4 bg-slate-50 rounded-2xl border-2 border-transparent group-hover:bg-white group-hover:border-slate-100 transition-all">
                  <h4 className="text-sm font-black italic uppercase tracking-tighter text-slate-800 leading-tight">
                    {event.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full border border-black/10 shadow-sm" 
                      style={{ backgroundColor: event.color || '#000' }} 
                    />
                    <p className="text-[9px] text-slate-400 font-bold font-mono">
                      {new Date(event.from_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}