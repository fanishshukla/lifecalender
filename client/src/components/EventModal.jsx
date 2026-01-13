import { useState } from 'react';

export default function EventModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [color, setColor] = useState('#10b981');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-black mb-6">New Event</h2>
        <div className="space-y-4">
          <input className="w-full border-b-2 p-2 outline-none focus:border-emerald-500" placeholder="Event Title" value={title} onChange={e => setTitle(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">From</label>
              <input type="date" className="w-full border p-2 rounded-lg text-sm" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">To</label>
              <input type="date" className="w-full border p-2 rounded-lg text-sm" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
          </div>
          <input type="color" className="w-full h-10 cursor-pointer" value={color} onChange={e => setColor(e.target.value)} />
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-400">Cancel</button>
          <button onClick={() => onSave({ title, fromDate, toDate, color })} className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg">Save Event</button>
        </div>
      </div>
    </div>
  );
}