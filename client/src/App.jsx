import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import EventSidebar from './components/EventSidebar';
import GoalSidebar from './components/GoalSidebar';
import ViewManager from './components/ViewManager';
import EventModal from './components/EventModal';
import GoalModal from './components/GoalModal';
import Auth from './components/Auth';

//const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState([]);
  
  // Selection/Prefill States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [prefillStart, setPrefillStart] = useState(null);
  const [prefillEnd, setPrefillEnd] = useState(null);

  // UI States
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [loading, setLoading] = useState(!!token);

  const isAchieved = (date) => date && new Date(date) < new Date();

  // AUTH & DATA SYNC LOGIC
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchData();
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [u, e, g] = await Promise.all([
        axios.get(`${API_BASE}/auth/me`),
        axios.get(`${API_BASE}/events`),
        axios.get(`${API_BASE}/goals`)
      ]);
      setUser(u.data);
      setEvents(e.data);
      setGoals(g.data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // HANDLER FOR TIMELINE MONTH CLICK
  const handleAddGoalFromTimeline = (goalData) => {
    // goalData is { target_date: 'YYYY-MM-DD' } passed from TimelineComponents
    setSelectedGoal(goalData);
    setIsGoalModalOpen(true);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setEvents([]);
    setGoals([]);
    localStorage.removeItem('token');
  };

  // --- Event Handlers ---
  const handleQuickCreate = (year, start, end) => {
    setActiveYear(year);
    setPrefillStart(start);
    setPrefillEnd(end);
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (data) => {
    try {
      const res = selectedEvent 
        ? await axios.put(`${API_BASE}/events/${selectedEvent.id}`, data)
        : await axios.post(`${API_BASE}/events`, data);
      
      setEvents(selectedEvent ? events.map(e => e.id === selectedEvent.id ? res.data : e) : [...events, res.data]);
      setIsEventModalOpen(false);
      resetEventStates();
    } catch (err) { console.error("Save Event error:", err); }
  };

  const resetEventStates = () => {
    setSelectedEvent(null);
    setActiveYear(null);
    setPrefillStart(null);
    setPrefillEnd(null);
  };

  // --- Goal Handlers ---
  const handleSaveGoal = async (data) => {
    try {
      const res = selectedGoal?.id 
        ? await axios.put(`${API_BASE}/goals/${selectedGoal.id}`, data)
        : await axios.post(`${API_BASE}/goals`, data);
      
      setGoals(selectedGoal?.id ? goals.map(g => g.id === selectedGoal.id ? res.data : g) : [...goals, res.data]);
      setIsGoalModalOpen(false);
      setSelectedGoal(null);
    } catch (err) { console.error("Save Goal error:", err); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-xl font-black uppercase italic animate-pulse tracking-tighter">Synchronizing Archive...</div>
    </div>
  );

  if (!token) return <Auth setToken={setToken} />;

  return (
    <div className="h-screen w-full bg-white flex flex-col font-sans text-slate-900 overflow-hidden">
      <Navbar user={user} onLogout={handleLogout} setView={() => setIsTimelineOpen(false)} />

      <div className="flex flex-1 pt-16 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Panel */}
        <aside className="w-72 border-r border-slate-100 flex flex-col bg-white overflow-hidden">
          <EventSidebar 
            events={events} 
            onAddEvent={() => { resetEventStates(); setIsEventModalOpen(true); }}
            onEditEvent={(ev) => { setSelectedEvent(ev); setActiveYear(new Date(ev.from_date).getFullYear()); setIsEventModalOpen(true); }}
            onDeleteEvent={async (id) => { if(confirm("Delete memory?")) { await axios.delete(`${API_BASE}/events/${id}`); setEvents(events.filter(e=>e.id!==id)); } }}
            onOpenTimeline={() => setIsTimelineOpen(true)}
          />
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-white">
          <ViewManager 
            events={events} 
            goals={goals} 
            birthDate={user?.birth_date}
            onQuickCreate={handleQuickCreate}
            onEditEvent={(ev) => { setSelectedEvent(ev); setIsEventModalOpen(true); }}
            onEditGoal={(gl) => { setSelectedGoal(gl); setIsGoalModalOpen(true); }}
            isTimelineOpen={isTimelineOpen} 
            setIsTimelineOpen={setIsTimelineOpen}
            // Passing the specific handler to the Timeline logic
            onAddGoal={handleAddGoalFromTimeline}
          />
        </main>

        {/* Right Panel */}
        <aside className="w-72 border-l border-slate-100 flex flex-col bg-white overflow-hidden">
          <GoalSidebar 
            goals={goals} 
            onAddGoal={() => { setSelectedGoal(null); setIsGoalModalOpen(true); }}
            onEditGoal={(gl) => { setSelectedGoal(gl); setIsGoalModalOpen(true); }}
            onDeleteGoal={async (id) => { if(confirm("Remove target?")) { await axios.delete(`${API_BASE}/goals/${id}`); setGoals(goals.filter(g=>g.id!==id)); } }}
            isAchieved={isAchieved}
          />
        </aside>
      </div>

      {/* Modals Layer */}
      <EventModal 
        isOpen={isEventModalOpen} 
        initialData={selectedEvent}
        lockedYear={activeYear}
        defaultStart={prefillStart}
        defaultEnd={prefillEnd}
        onClose={() => { setIsEventModalOpen(false); resetEventStates(); }} 
        onSubmit={handleSaveEvent} 
      />

      <GoalModal 
        isOpen={isGoalModalOpen} 
        initialData={selectedGoal}
        onClose={() => { setIsGoalModalOpen(false); setSelectedGoal(null); }} 
        onSubmit={handleSaveGoal} 
      />
    </div>
  );
}