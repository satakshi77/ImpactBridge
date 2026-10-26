import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  ArrowRight,
  User,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Heart,
  Users,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export const LoginPage = () => {
  const { login, demoSwitch } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1-Click Instant Demo Login
  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      await demoSwitch(role);
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'ngo') navigate('/ngo/dashboard');
      else if (role === 'volunteer') navigate('/volunteer/dashboard');
      else navigate('/donor/dashboard');
    } catch (err) {
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'ngo') navigate('/ngo/dashboard');
      else if (role === 'volunteer') navigate('/volunteer/dashboard');
      else navigate('/donor/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      const role = data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'ngo') navigate('/ngo/dashboard');
      else if (role === 'volunteer') navigate('/volunteer/dashboard');
      else navigate('/donor/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-100 p-3">
            <svg className="w-10 h-10 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              ImpactBridge
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Transparent NGO Milestones, Donations & Verified Volunteering
            </p>
          </div>
        </div>

        {/* 1-Click Quick Demo Sign In Box */}
        <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-[0_4px_25px_-4px_rgba(37,99,235,0.08)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              Instant 1-Click Demo Login
            </span>
            <span className="text-[10px] font-bold bg-blue-50 text-[#2563eb] px-2 py-0.5 rounded-full">
              Pre-Configured
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Donor */}
            <button
              type="button"
              onClick={() => handleQuickDemo('donor')}
              disabled={loading}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 rounded-2xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                    Alex Morgan
                  </p>
                  <p className="text-[10px] text-slate-400">Donor</p>
                </div>
              </div>
            </button>

            {/* Volunteer */}
            <button
              type="button"
              onClick={() => handleQuickDemo('volunteer')}
              disabled={loading}
              className="p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-300 rounded-2xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-purple-600 truncate">
                    Priya Patel
                  </p>
                  <p className="text-[10px] text-slate-400">Volunteer</p>
                </div>
              </div>
            </button>

            {/* NGO Admin */}
            <button
              type="button"
              onClick={() => handleQuickDemo('ngo')}
              disabled={loading}
              className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 truncate">
                    GreenEarth
                  </p>
                  <p className="text-[10px] text-slate-400">NGO Admin</p>
                </div>
              </div>
            </button>

            {/* Platform Admin */}
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              disabled={loading}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-400 rounded-2xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-slate-950 truncate">
                    Dr. Sarah Chen
                  </p>
                  <p className="text-[10px] text-slate-400">Platform Admin</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* MAIN AUTHENTICATION CARD */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06)] p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your credentials to access your impact portal.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-700 rounded-2xl text-xs border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex.donor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Use 1-Click Demo Login above or password123');
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              New to ImpactBridge?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
