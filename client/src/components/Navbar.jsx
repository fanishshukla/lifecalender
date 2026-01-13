import React from 'react';
import { LogOut, LayoutGrid, Calendar } from 'lucide-react';

export default function Navbar({ user, onLogout, setView }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none">Life Archive</h1>
          <span className="text-[8px] font-bold text-blue-600 uppercase tracking-[0.2em]">The 90 Year Matrix</span>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
          <button 
            onClick={() => setView('life')} 
            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-white rounded-md transition-all text-slate-600 hover:text-black"
          >
            <LayoutGrid size={14} /> Matrix
          </button>
          <button 
            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-white rounded-md transition-all text-slate-600 hover:text-black"
          >
            <Calendar size={14} /> Analytics
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Member</p>
          <p className="text-xs font-bold text-slate-900">{user?.username || 'User'}</p>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}