import { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Calendar, CheckCircle2 } from 'lucide-react'; 
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import LifeView from './components/LifeView';
import YearView from './components/YearView';
import MonthView from './components/MonthView';
import Modal from './components/Modal';
import EventModal from './components/EventModal';

function App() {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [view, setView] = useState('life'); // 'life', 'year', 'month'
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  const [data, setData] = useState({ goals: [], events: [] });
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user-data/${user.id}`);
      setData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // --- GOAL HANDLERS ---
  const handleGoalSave = async (formData) => {
    let targetDate;
    const now = new Date();

    if (view === 'life') targetDate = `${now.getFullYear()}-01-01`;
    else if (view === 'year') targetDate = `${selectedYear}-01-01`;
    else if (view === 'month') {
      const m = String(selectedMonth + 1).padStart(2, '0');
      targetDate = `${selectedYear}-${m}-01`;
    }

    try {
      const payload = {
        user_id: user.id,
        goal_type: view === 'life' ? 'year' : view === 'year' ? 'month' : 'week',
        target_date: targetDate,
        content: formData.goalText,
        color: formData.color
      };

      if (editingGoal) {
        await axios.put(`http://localhost:5000/api/goals/${editingGoal.id}`, payload);
      } else {
        await axios.post('http://localhost:5000/api/goals', payload);
      }
      fetchData();
      setIsGoalModalOpen(false);
      setEditingGoal(null);
    } catch (err) {
      alert("Goal Save Failed. Check backend console.");
    }
  };

  const toggleGoalDone = async (id) => {
    await axios.patch(`http://localhost:5000/api/goals/${id}/toggle`);
    fetchData();
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm("Delete goal?")) {
      await axios.delete(`http://localhost:5000/api/goals/${id}`);
      fetchData();
    }
  };

  // --- EVENT HANDLERS ---
  const handleEventSave = async (eventData) => {
    try {
      await axios.post('http://localhost:5000/api/events', {
        user_id: user.id,
        title: eventData.title,
        from_date: eventData.fromDate,
        to_date: eventData.toDate,
        color: eventData.color,
        event_type: view === 'life' ? 'year' : view === 'year' ? 'month' : 'week'
      });
      fetchData();
      setIsEventModalOpen(false);
    } catch (err) {
      alert("Event Save Failed");
    }
  };

  // --- STRICT FILTERING LOGIC ---
  const filteredGoals = (data.goals || []).filter(g => {
    const d = new Date(g.target_date);
    if (view === 'life') return g.goal_type === 'year';
    if (view === 'year') return g.goal_type === 'month' && d.getFullYear() === selectedYear;
    if (view === 'month') return g.goal_type === 'week' && d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    return false;
  });

  const filteredEvents = (data.events || []).filter(e => {
    const d = new Date(e.from_date);
    if (view === 'life') return e.event_type === 'year';
    if (view === 'year') return e.event_type === 'month' && d.getFullYear() === selectedYear;
    if (view === 'month') return e.event_type === 'week' && d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
    return false;
  });

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar user={user} onLogout={() => setUser(null)} setView={setView} />
      
      <main className="pt-36 pb-20 px-8 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-[300px_1fr_300px] gap-10 items-start">
          
          {/* LEFT COLUMN: EVENTS */}
          <section className="flex flex-col gap-6">
            <button 
              onClick={() => setIsEventModalOpen(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95"
            >
              + Add Event
            </button>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[600px]">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">Timeline Events</h3>
              <div className="space-y-3">
                {filteredEvents.map(e => (
                  <div key={e.id} className="p-4 rounded-2xl bg-slate-50 border-l-4" style={{ borderLeftColor: e.color }}>
                    <p className="text-sm font-bold text-slate-800">{e.title}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                      {new Date(e.from_date).toLocaleDateString()} - {new Date(e.to_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CENTER COLUMN: GRID */}
          <section className="flex flex-col items-center">
            <header className="text-center mb-10">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
                {view === 'life' ? 'Your Life' : view === 'year' ? `Year ${selectedYear}` : 'The Month'}
              </h1>
              <p className="text-slate-400 font-medium">Visualizing your journey through time</p>
            </header>

            <div className="w-full bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
              {view === 'life' && <LifeView birthDate={user.birth_date} onYearClick={(y) => { setSelectedYear(y); setView('year'); }} goals={data.goals} />}
              {view === 'year' && <YearView year={selectedYear} onBack={() => setView('life')} onMonthClick={(m) => { setSelectedMonth(m); setView('month'); }} />}
              {view === 'month' && <MonthView year={selectedYear} month={selectedMonth} onBack={() => setView('year')} />}
            </div>
          </section>

          {/* RIGHT COLUMN: GOALS */}
          <section className="flex flex-col gap-6">
            <button 
              onClick={() => { setEditingGoal(null); setIsGoalModalOpen(true); }}
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-95"
            >
              + Add Goal
            </button>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[600px]">
              <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">Current Goals</h3>
              <div className="space-y-3">
                {filteredGoals.map(g => (
                  <div 
                    key={g.id} 
                    className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${g.is_done ? 'opacity-40 grayscale' : 'hover:shadow-md'}`}
                    style={{ borderColor: g.color }}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={g.is_done} 
                        onChange={() => toggleGoalDone(g.id)}
                        className="w-4 h-4 rounded-full accent-slate-900 cursor-pointer"
                      />
                      <span className={`text-sm font-bold text-slate-800 ${g.is_done ? 'line-through' : ''}`}>{g.content}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil size={14} className="text-slate-400 hover:text-blue-600 cursor-pointer" onClick={() => { setEditingGoal(g); setIsGoalModalOpen(true); }} />
                      <Trash2 size={14} className="text-slate-400 hover:text-red-600 cursor-pointer" onClick={() => handleDeleteGoal(g.id)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* MODALS */}
      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onSave={handleEventSave} />
      <Modal 
        isOpen={isGoalModalOpen} 
        onClose={() => { setIsGoalModalOpen(false); setEditingGoal(null); }} 
        onSave={handleGoalSave} 
        initialData={editingGoal} 
      />
    </div>
  );
}

export default App;