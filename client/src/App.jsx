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

const API_BASE = "http://localhost:5000/api";

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
      // Crucial: Set the header for all future requests
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

const handleAddMonthlyGoal = (year, monthIndex) => {
  // Set the default date for the new goal to the 1st of that month
  const defaultDate = new Date(year, monthIndex, 1).toISOString().split('T')[0];
  
  // Set the goal modal state
  setSelectedGoal({ target_date: defaultDate, content: '' });
  setIsGoalModalOpen(true);
};




  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setEvents([]);
    setGoals([]);
    localStorage.removeItem('token');
  };

  // --- Handlers ---
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

  const handleSaveGoal = async (data) => {
    try {
      const res = selectedGoal 
        ? await axios.put(`${API_BASE}/goals/${selectedGoal.id}`, data)
        : await axios.post(`${API_BASE}/goals`, data);
      
      setGoals(selectedGoal ? goals.map(g => g.id === selectedGoal.id ? res.data : g) : [...goals, res.data]);
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
      {/* 1. Integrated Navbar */}
      <Navbar user={user} onLogout={handleLogout} setView={() => setIsTimelineOpen(false)} />

      {/* 2. Main Workspace Layout */}
      <div className="flex flex-1 pt-16 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Panel: Memory Archive */}
        <aside className="w-72 border-r border-slate-100 flex flex-col bg-white overflow-hidden">
          <EventSidebar 
            events={events} 
            onAddEvent={() => { resetEventStates(); setIsEventModalOpen(true); }}
            onEditEvent={(ev) => { setSelectedEvent(ev); setActiveYear(new Date(ev.from_date).getFullYear()); setIsEventModalOpen(true); }}
            onDeleteEvent={async (id) => { if(confirm("Delete memory?")) { await axios.delete(`${API_BASE}/events/${id}`); setEvents(events.filter(e=>e.id!==id)); } }}
            onOpenTimeline={() => setIsTimelineOpen(true)}
          />
        </aside>

        {/* Center Canvas: The 90 Year Matrix */}
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
            onAddMonthlyGoal={handleAddMonthlyGoal}
          selectedYear={activeYear || new Date().getFullYear()} // Ensure this isn't null
          onAddGoal={(data) => { 
              setSelectedGoal(data); 
              setIsGoalModalOpen(true); 
            }}

          />
        </main>

        {/* Right Panel: Life Targets */}
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