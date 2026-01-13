import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function GoalModal({ isOpen, onClose, onSubmit, initialData }) {
  const [content, setContent] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState('#6366f1');

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || '');
      // Format the date for the HTML input (YYYY-MM-DD)
      const date = initialData.target_date ? new Date(initialData.target_date).toISOString().split('T')[0] : '';
      setTargetDate(date);
      setColor(initialData.color || '#6366f1');
    } else {
      setContent('');
      setTargetDate('');
      setColor('#6366f1');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the correct keys to the onSubmit handler
    onSubmit({ content, target_date: targetDate, color });
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            {initialData ? 'Edit Target' : 'Set New Goal'}
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Goal Description</label>
            <input 
              required 
              type="text" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="e.g., Run a Marathon" 
              className="w-full p-3 border-2 border-slate-900 rounded-xl font-bold focus:ring-2 ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Target Date</label>
            <input 
              required 
              type="date" 
              value={targetDate} 
              onChange={(e) => setTargetDate(e.target.value)} 
              className="w-full p-3 border-2 border-slate-900 rounded-xl font-mono" 
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase mb-1 block text-slate-400">Color Tag</label>
            <div className="flex gap-2">
              {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#f472b6'].map(c => (
                <button 
                  key={c} 
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 border-slate-900 transition-transform ${color === c ? 'scale-125 ring-2 ring-slate-300' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-600 transition-colors"
          >
            Save Goal
          </button>
        </form>
      </div>
    </div>
  );
}