import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EventModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    from_date: '',
    to_date: '',
    color: '#10b981',
    event_type: 'milestone'
  });

  // This effect synchronizes the form with the data passed from the Timeline
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        // Format dates to YYYY-MM-DD for HTML5 date inputs
        from_date: initialData.from_date ? new Date(initialData.from_date).toISOString().split('T')[0] : '',
        to_date: initialData.to_date ? new Date(initialData.to_date).toISOString().split('T')[0] : '',
        color: initialData.color || '#10b981',
        event_type: initialData.event_type || 'milestone'
      });
    } else {
      // Reset form if opening for a brand new event without quick-select
      setFormData({
        title: '',
        from_date: '',
        to_date: '',
        color: '#10b981',
        event_type: 'milestone'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center">
          <h2 className="text-white text-2xl font-black uppercase italic tracking-widest">
            {initialData?.id ? 'Edit Event' : 'Plan Event'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:rotate-90 transition-transform duration-200"
          >
            <X size={32} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2 ml-1">Event Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g., Vacation in Tokyo"
              className="w-full p-4 border-3 border-slate-900 rounded-2xl font-bold text-lg focus:ring-4 ring-blue-100 outline-none transition-all"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2 ml-1">From</label>
              <input 
                type="date" 
                required
                className="w-full p-4 border-3 border-slate-900 rounded-2xl font-bold outline-none"
                value={formData.from_date}
                onChange={e => setFormData({...formData, from_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2 ml-1">To</label>
              <input 
                type="date" 
                required
                className="w-full p-4 border-3 border-slate-900 rounded-2xl font-bold outline-none"
                value={formData.to_date}
                onChange={e => setFormData({...formData, to_date: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-2 ml-1">Color Theme</label>
            <div className="flex gap-3">
              {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'].map(c => (
                <button 
                  key={c} 
                  type="button" 
                  onClick={() => setFormData({...formData, color: c})}
                  className={`w-12 h-12 rounded-full border-4 border-slate-900 transition-transform ${formData.color === c ? 'scale-110 ring-4 ring-slate-200' : 'hover:scale-105'}`}
                  style={{backgroundColor: c}}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-5 bg-slate-900 text-white font-black text-xl rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-800 active:translate-y-1 transition-all shadow-[0px_6px_0px_0px_rgba(0,0,0,0.2)]"
          >
            Confirm Event
          </button>
        </form>
      </div>
    </div>
  );
}