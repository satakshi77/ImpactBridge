import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, HeartHandshake, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, demoSwitch } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user.role === 'ngo') navigate('/ngo/dashboard');
      else if (data.user.role === 'volunteer') navigate('/volunteer/dashboard');
      else if (data.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/donor/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    try {
      await demoSwitch(role);
      if (role === 'ngo') navigate('/ngo/dashboard');
      else if (role === 'volunteer') navigate('/volunteer/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/donor/dashboard');
    } catch (err) {
      setError('Failed to switch demo user');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Welcome Back</h1>
        <p className="text-xs text-slate-500">Log in to track milestones, contributions, and volunteer hours</p>
      </div>

      {/* Evaluator 1-Click Role Login Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
          Evaluation Quick Logins (1-Click)
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleQuickDemo('donor')}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-medium transition cursor-pointer"
          >
            💙 Donor (Alex)
          </button>
          <button
            onClick={() => handleQuickDemo('ngo')}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-medium transition cursor-pointer"
          >
            💚 NGO (Sunita)
          </button>
          <button
            onClick={() => handleQuickDemo('volunteer')}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-medium transition cursor-pointer"
          >
            💜 Volunteer (Priya)
          </button>
          <button
            onClick={() => handleQuickDemo('admin')}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left font-medium transition cursor-pointer"
          >
            ⚡ Admin (Dr. Sarah)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-5">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
