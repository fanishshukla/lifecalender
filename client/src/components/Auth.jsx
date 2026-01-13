import React, { useState } from 'react';
import axios from 'axios';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
      
      console.log("Frontend received:", response.data);

      // We expect response.data.token because of our server update
      if (response.data && response.data.token) {
        setToken(response.data.token);
      } else {
        console.error("Token missing in response:", response.data);
        setError("Server did not return a security token.");
      }
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-sans">
      <div className="w-full max-w-md p-8 bg-white border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-[2rem]">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Join Archive'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-600 text-xs font-black uppercase rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Username"
            className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-slate-900 outline-none font-bold transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-slate-900 outline-none font-bold transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest hover:translate-y-[-2px] active:translate-y-0 transition-all shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)]">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-900" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}