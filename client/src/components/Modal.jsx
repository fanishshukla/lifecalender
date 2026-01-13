import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    content: '',
    target_date: '',
    color: '#6366f1'
  });

  useEffect(() => {
    if (initialData) {
      // Formats date to YYYY-MM-DD for the input[type="date"]
      const date = new Date(initialData.target_date).toISOString().split('T')[0];
      setFormData({ ...initialData, target_date: date });
    } else {
      setFormData({ content: '', target_date: '', color: '#6366f1' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            {initialData ? 'Update Goal' : 'New Goal'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <input 
            type="text" required placeholder="What's the goal?"
            className="w-full p-4 border-2 border-slate-900 rounded-xl font-bold"
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
          />
          <input 
            type="date" required
            className="w-full p-4 border-2 border-slate-900 rounded-xl font-bold"
            value={formData.target_date}
            onChange={e => setFormData({...formData, target_date: e.target.value})}
          />
          <div className="flex gap-2">
            {['#6366f1', '#10b981', '#f59e0b', '#ef4444'].map(c => (
              <button 
                key={c} type="button" 
                onClick={() => setFormData({...formData, color: c})}
                className={`w-10 h-10 rounded-full border-2 border-slate-900 ${formData.color === c ? 'ring-4 ring-blue-200' : ''}`}
                style={{backgroundColor: c}}
              />
            ))}
          </div>
          <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-xl uppercase tracking-widest hover:bg-slate-800 transition-colors">
            Save Goal
          </button>
        </form>
      </div>
    </div>
  );
}