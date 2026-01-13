import React, { useState } from 'react';
import TimelineView from './TimelineView';
import { YearSquare } from './YearSquare';
import { HoverPanels } from './HoverPanels';

export default function ViewManager({ 
  events = [], 
  goals = [], 
  birthDate, 
  onQuickCreate, 
  onEditEvent, 
  onEditGoal,
  isTimelineOpen,
  setIsTimelineOpen 
}) {
  const [hoveredYear, setHoveredYear] = useState(null);

  const startYear = birthDate ? new Date(birthDate).getFullYear() : 1980;
  const years = Array.from({ length: 90 }, (_, i) => startYear + i);
  const isAchieved = (date) => new Date(date) < new Date();

  return (
    <main className="flex-1 relative bg-slate-50 overflow-auto p-12 no-scrollbar min-h-screen">
      {/* Floating panels when hovering over a year */}
      <HoverPanels 
        year={hoveredYear} 
        events={events} 
        goals={goals} 
        isAchieved={isAchieved} 
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-2">Life Archive</h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">The 90 Year Matrix</p>
        </div>

        {/* The 10-column grid as seen in your screenshot */}
        <div className="grid grid-cols-10 gap-3">
          {years.map((year, index) => (
            <YearSquare 
              key={year}
              year={year}
              index={index}
              goals={goals}
              onHover={setHoveredYear}
              onClick={() => setIsTimelineOpen(true)}
              isAchieved={isAchieved}
            />
          ))}
        </div>
      </div>

      {/* The Fullscreen Calendar Popup */}
      <TimelineView
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        events={events}
        goals={goals}
        birthDate={birthDate}
        onQuickCreate={onQuickCreate}
        onEditEvent={onEditEvent}
        onEditGoal={onEditGoal}
      />
    </main>
  );
}