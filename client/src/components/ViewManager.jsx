import React, { useState } from 'react';
import TimelineView from './TimelineView';
import { YearSquare } from './YearSquare';
import { HoverPanels } from './HoverPanels';

export default function ViewManager({ 
  events = [], goals = [], birthDate, onQuickCreate, onEditEvent, onEditGoal, isTimelineOpen, setIsTimelineOpen 
}) {
  const [hoveredYear, setHoveredYear] = useState(null);

  const startYear = birthDate ? new Date(birthDate).getFullYear() : 1980;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 90 }, (_, i) => startYear + i);
  const isAchieved = (date) => new Date(date) < new Date();

  return (
    <div className="w-full h-full flex flex-col">
      <HoverPanels year={hoveredYear} events={events} goals={goals} isAchieved={isAchieved} />
      
      {/* Header - Reduced margin and text size to save space */}
      <div className="mb-4 text-center shrink-0">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Life Archive</h1>
        <p className="text-slate-400 font-bold uppercase text-[8px] tracking-[0.3em]">90 Year Matrix</p>
      </div>

      {/* The Matrix - Using 'gap-1' and 'max-w-3xl' to ensure it fits on one screen */}
      <div className="flex-1 flex justify-center items-start overflow-hidden">
        <div className="grid grid-cols-10 gap-1.5 w-full max-w-3xl px-2">
          {years.map((year, index) => (
            <YearSquare 
              key={year}
              year={year}
              index={index}
              goals={goals}
              events={events}
              onHover={setHoveredYear}
              onClick={() => onQuickCreate(year)} 
              isAchieved={isAchieved}
              isPast={year <= currentYear}
              isSenior={index >= 62}
              isMilestone={[20, 40, 60, 80].includes(index)}
            />
          ))}
        </div>
      </div>

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
    </div>
  );
}