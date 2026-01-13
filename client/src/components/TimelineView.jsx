import React, { useState } from 'react';
import { X } from 'lucide-react';
import { YearSquare } from './YearSquare';
import { HoverPanels } from './HoverPanels';
import { YearDetailOverlay } from './YearDetailOverlay';

export default function TimelineView({ 
  isOpen, onClose, events = [], goals = [], birthDate, onQuickCreate, onEditEvent, onEditGoal 
}) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [hoveredYear, setHoveredYear] = useState(null);

  if (!isOpen) return null;

  const startYear = birthDate ? new Date(birthDate).getFullYear() : 1980;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 90 }, (_, i) => startYear + i);
  const isAchieved = (date) => new Date(date) < new Date();

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 overflow-hidden flex flex-col p-6 font-sans">
      {/* Floating panels when hovering over a year */}
      <HoverPanels year={hoveredYear} events={events} goals={goals} isAchieved={isAchieved} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 sticky top-0 z-30 pb-4 border-b-2 border-slate-200">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Life Archive</h1>
        <button 
          onClick={onClose} 
          className="p-2 bg-slate-900 text-white rounded-full hover:rotate-90 transition-all shadow-lg"
        >
          <X size={24} />
        </button>
      </div>

      {/* Grid Container */}
      <div className="overflow-auto flex-1 no-scrollbar flex items-start justify-center pt-8">
        <div className="grid grid-cols-10 gap-3 max-w-5xl w-full pb-20">
          {years.map((year, index) => (
            <YearSquare 
              key={year}
              year={year}
              index={index}
              goals={goals}
              events={events}
              onHover={setHoveredYear}
              // This sets the local state to open the months popup
              onClick={() => setSelectedYear(year)} 
              isAchieved={isAchieved}
              // Pass the styling props so they match the main grid
              isPast={year <= currentYear}
              isSenior={index >= 62}
              isMilestone={[20, 40, 60, 80].includes(index)}
            />
          ))}
        </div>
      </div>

      {/* The Months/Days Detail Popup */}
      {selectedYear && (
        <YearDetailOverlay 
          year={selectedYear}
          goals={goals.filter(g => new Date(g.target_date).getFullYear() === selectedYear)}
          events={events}
          onClose={() => setSelectedYear(null)}
          onEditGoal={onEditGoal}
          onEditEvent={onEditEvent}
          onQuickCreate={onQuickCreate}
          isAchieved={isAchieved}
        />
      )}
    </div>
  );
}