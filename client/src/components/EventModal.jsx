// client/src/components/EventModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EventModal({ isOpen, onClose, onSubmit, initialData, lockedYear, defaultStart, defaultEnd }) {
  const [title, setTitle] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [color, setColor] = useState('#10b981');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setFromDate(initialData.from_date.split('T')[0]);
      setToDate(initialData.to_date.split('T')[0]);
      setColor(initialData.color);
    } else {
      setTitle('');
      // Use the dates passed from the YearDetailOverlay, or default to year start
      setFromDate(defaultStart || `${lockedYear}-01-01`);
      setToDate(defaultEnd || `${lockedYear}-01-02`);
      setColor('#10b981');
    }
  }, [initialData, lockedYear, defaultStart, defaultEnd, isOpen]);

  if (!isOpen) return null;

  // STRICT BOUNDARIES: Only allow dates within the locked year
  const minDate = `${lockedYear}-01-01`;
  const maxDate = `${lockedYear}-12-31`;

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            {initialData ? 'Edit Event' : `New Event ${lockedYear}`}
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ title, from_date: fromDate, to_date: toDate, color });
        }} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Event Name</label>
            <input 
              required 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full p-4 border-2 border-slate-900 rounded-2xl font-bold" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Start (Locked to {lockedYear})</label>
              <input 
                required type="date" 
                min={minDate} max={maxDate} 
                value={fromDate} onChange={e => setFromDate(e.target.value)} 
                className="w-full p-3 border-2 border-slate-900 rounded-xl font-mono text-xs" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase mb-1 block text-slate-400">End (Locked to {lockedYear})</label>
              <input 
                required type="date" 
                min={fromDate || minDate} max={maxDate} 
                value={toDate} onChange={e => setToDate(e.target.value)} 
                className="w-full p-3 border-2 border-slate-900 rounded-xl font-mono text-xs" 
              />
            </div>
          </div>
          
          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}