import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventSidebar from './components/EventSidebar';
import ViewManager from './components/ViewManager';
import EventModal from './components/EventModal';
import Auth from './components/Auth';

// Base URL for your backend - ensure this matches your server port
const API_BASE = "http://localhost:5000/api";

export default function App() {
  // 1. Initialize state from localStorage to stay logged in on refresh
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [loading, setLoading] = useState(!!token);

  // 2. Fetch Data whenever the token changes
  useEffect(() => {
    if (token) {
      // Set global header for all axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchInitialData();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch everything at once
      const [eventsRes, goalsRes, userRes] = await Promise.all([
        axios.get(`${API_BASE}/events`),
        axios.get(`${API_BASE}/goals`),
        axios.get(`${API_BASE}/auth/me`)
      ]);
      
      setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
      setGoals(Array.isArray(goalsRes.data) ? goalsRes.data : []);
      setUser(userRes.data);
    } catch (err) {
      console.error("Data Fetch Error:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Auth Handlers
  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setEvents([]);
    setGoals([]);
  };

  // 4. Data Handlers
  const handleAddEvent = async (eventData) => {
    try {
      await axios.post(`${API_BASE}/events`, eventData);
      fetchInitialData(); // Refresh list after adding
      setIsEventModalOpen(false);
    } catch (err) {
      alert("Error saving event. Check console.");
    }
  };

  // SHOW LOADING STATE
  if (loading && token) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-slate-900"></div>
      </div>
    );
  }

  // SHOW AUTH PAGE IF NOT LOGGED IN
  if (!token) {
    return <Auth setToken={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      {/* LEFT SIDEBAR: Single Instance */}
      <EventSidebar 
        events={events} 
        onAddEvent={() => setIsEventModalOpen(true)}
        onOpenTimeline={() => setIsTimelineOpen(true)}
      />

      {/* MIDDLE CONTENT: The 90-Year Matrix Grid */}
      <ViewManager 
        events={events}
        goals={goals}
        birthDate={user?.birth_date || '1995-01-01'}
        isTimelineOpen={isTimelineOpen}
        setIsTimelineOpen={setIsTimelineOpen}
        onQuickCreate={() => setIsEventModalOpen(true)}
        onEditEvent={(ev) => console.log("Edit:", ev)}
        onEditGoal={(go) => console.log("Edit:", go)}
      />

      {/* OVERLAY MODALS */}
      {isEventModalOpen && (
        <EventModal 
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSubmit={handleAddEvent}
        />
      )}

      {/* FLOAT LOGOUT */}
      <div className="fixed top-6 right-8 z-[200] flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-900 leading-none">
              {user.username}
            </p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
              {user.email}
            </p>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-full hover:bg-red-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1"
        >
          Logout
        </button>
      </div>
    </div>
  );
}