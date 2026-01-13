import { useState, useEffect } from 'react';

export default function Modal({ isOpen, onClose, onSave, initialData }) {
  const [goalText, setGoalText] = useState('');
  const [color, setColor] = useState('#3b82f6');

  useEffect(() => {
    if (initialData) {
      setGoalText(initialData.content);
      setColor(initialData.color || '#3b82f6');
    } else {
      setGoalText(''); setColor('#3b82f6');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <h2 className="text-2xl font-black mb-6">{initialData ? 'Edit Goal' : 'New Goal'}</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Goal Description</label>
            <input 
              autoFocus
              className="w-full border-b-2 border-gray-100 py-3 text-lg outline-none focus:border-black transition-all" 
              placeholder="What is the goal?" 
              value={goalText} 
              onChange={e => setGoalText(e.target.value)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-400 uppercase">Theme Color</label>
            <input 
              type="color" 
              className="h-10 w-10 rounded-full border-none cursor-pointer" 
              value={color} 
              onChange={e => setColor(e.target.value)} 
            />
          </div>
        </div>

        <div className="flex gap-3 mt-10">
          <button onClick={onClose} className="flex-1 py-3 text-gray-400 font-bold">Cancel</button>
          <button 
            onClick={() => onSave({ goalText, color })} 
            className="flex-1 py-3 bg-black text-white rounded-2xl font-bold shadow-lg shadow-gray-200"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}