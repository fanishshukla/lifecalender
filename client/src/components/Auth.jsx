import { useState } from 'react';
import axios from 'axios';

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', birthDate: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? 'register' : 'login';
    try {
      const res = await axios.post(`http://localhost:5000/api/${endpoint}`, form);
      onLogin(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div className="calendar-container">
      <h2 className="text-2xl font-bold mb-6">{isRegister ? 'Create Account' : 'Login'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
        <input 
          placeholder="Username" 
          className="border p-2 rounded"
          onChange={e => setForm({...form, username: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="border p-2 rounded"
          onChange={e => setForm({...form, password: e.target.value})} 
        />
        {isRegister && (
          <input 
            type="date" 
            className="border p-2 rounded"
            onChange={e => setForm({...form, birthDate: e.target.value})} 
          />
        )}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          {isRegister ? 'Register' : 'Login'}
        </button>
        <button 
          type="button" 
          className="text-sm text-blue-500 underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Have an account? Login' : 'Need an account? Register'}
        </button>
      </form>
    </div>
  );
}