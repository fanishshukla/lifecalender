import React from 'react';

export default function Navbar({ user, onLogout, setView }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-sm bg-white border-b border-slate-100">
      {/* Top Utility Layer */}
      <div className="bg-slate-50 border-b border-slate-100 h-9 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between">
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <button onClick={() => setView('life')} className="hover:text-blue-600 transition">Life View</button>
            <span className="cursor-default">Product Features</span>
            <span className="cursor-default">Security</span>
          </div>
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            Pricing
          </div>
        </div>
      </div>

      {/* Main Navigation Layer */}
      <div className="h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <h1 
              className="text-xl font-black tracking-tighter cursor-pointer hover:opacity-80 transition" 
              onClick={() => setView('life')}
            >
              LIFECALENDAR<span className="text-blue-600">.</span>
            </h1>
            
            <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
              <div className="group relative cursor-pointer py-4 hover:text-black">
                Solutions
                <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-xl border border-slate-100 p-2 hidden group-hover:block">
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm">Personal Growth</a>
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm">Families</a>
                </div>
              </div>
              <div className="group relative cursor-pointer py-4 hover:text-black">
                Resources
                <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-xl border border-slate-100 p-2 hidden group-hover:block">
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm">Templates</a>
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm">Help Center</a>
                </div>
              </div>
              <span className="text-blue-600 cursor-pointer py-4">Shop</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Active User</p>
              <p className="text-sm font-bold text-slate-800">{user?.username}</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-red-600 transition-all shadow-md active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}