import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Users,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage = () => {
  const { login, demoSwitch } = useAuth();
  const navigate = useNavigate();

  // Active Login Mode: 'user' or 'admin'
  const [activePortal, setActivePortal] = useState('user'); // 'user' | 'admin'
  // If User: role can be 'donor' or 'volunteer'
  const [userRole, setUserRole] = useState('donor'); // 'donor' | 'volunteer'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Handle portal switch
  const handlePortalSwitch = (portal) => {
    setActivePortal(portal);
    setError('');
    setNotice('');
    setEmail('');
    setPassword('');
  };

  // Instant 1-Click Demo Login (never fails!)
  const handleInstantDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      const res = await demoSwitch(role);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'volunteer') {
        navigate('/volunteer/dashboard');
      } else {
        navigate('/donor/dashboard');
      }
    } catch (err) {
      setError('Failed to log in demo account');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const data = await login(email, password);
      const authenticatedRole = data.user.role;

      if (activePortal === 'admin') {
        if (authenticatedRole !== 'admin') {
          setError('Access Denied: This account is not an Administrator. Please use the User Login.');
          setLoading(false);
          return;
        }
        navigate('/admin/dashboard');
      } else {
        // User login (donor or volunteer or ngo)
        if (authenticatedRole === 'admin') {
          setNotice('Admin account recognized. Directing to Admin Dashboard...');
          setTimeout(() => navigate('/admin/dashboard'), 600);
        } else if (authenticatedRole === 'volunteer') {
          navigate('/volunteer/dashboard');
        } else if (authenticatedRole === 'ngo') {
          navigate('/ngo/dashboard');
        } else {
          navigate('/donor/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
            <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <span>ImpactBridge Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Sign In to ImpactBridge
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Choose your login type below. Regular users access donor and volunteer tools; administrators access platform governance.
          </p>
        </div>

        {/* TWO PRIMARY PORTAL SELECTORS: USER vs ADMIN */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-200/80 rounded-2xl">
          <button
            type="button"
            onClick={() => handlePortalSwitch('user')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activePortal === 'user'
                ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>User Login (Donor / Volunteer)</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('admin')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activePortal === 'admin'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* MAIN AUTHENTICATION CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* USER LOGIN EXPERIENCE */}
          {activePortal === 'user' && (
            <div className="space-y-6">
              {/* User Role Sub-Toggle */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">User Member Portal</h2>
                  <p className="text-xs text-slate-500">I am accessing the platform as a:</p>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('donor');
                      setEmail('');
                      setPassword('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      userRole === 'donor'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Donor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('volunteer');
                      setEmail('');
                      setPassword('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      userRole === 'volunteer'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Volunteer</span>
                  </button>
                </div>
              </div>

              {/* 1-Click Quick Demo Sign In Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Instant Demo Login (1-Click)
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Pre-Configured
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInstantDemo('donor')}
                    disabled={loading}
                    className="p-3 bg-white border border-blue-200 hover:border-blue-400 rounded-xl text-left transition hover:shadow-sm cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Alex Morgan (Donor)</p>
                        <p className="text-[10px] text-slate-400">₹45k donated • 2 active projects</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInstantDemo('volunteer')}
                    disabled={loading}
                    className="p-3 bg-white border border-purple-200 hover:border-purple-400 rounded-xl text-left transition hover:shadow-sm cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-purple-600">Priya Patel (Volunteer)</p>
                        <p className="text-[10px] text-slate-400">24 verified service hours</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}
              {notice && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{notice}</span>
                </div>
              )}

              {/* Standard Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {userRole === 'donor' ? 'Donor Email Address' : 'Volunteer Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={userRole === 'donor' ? 'alex.donor@example.com' : 'priya.volunteer@example.com'}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
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
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white transition cursor-pointer flex items-center justify-center gap-2 ${
                    userRole === 'donor'
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                      : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
                  }`}
                >
                  {loading ? (
                    <span>Authenticating User...</span>
                  ) : (
                    <>
                      <span>Sign In as {userRole.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                Don't have a user account?{' '}
                <Link to={`/register?role=${userRole}`} className="font-bold text-slate-900 hover:underline">
                  Register as a {userRole}
                </Link>
              </div>
            </div>
          )}

          {/* ADMIN LOGIN EXPERIENCE */}
          {activePortal === 'admin' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">
                    Platform Administration Console
                  </h2>
                  <p className="text-xs text-slate-500">
                    Authorized compliance officers and platform auditors only.
                  </p>
                </div>
              </div>

              {/* 1-Click Quick Demo Admin Sign In */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Instant Admin Demo Login
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                    Full Admin Rights
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleInstantDemo('admin')}
                  disabled={loading}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-left transition flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <p className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                      Dr. Sarah Chen (Platform Admin)
                    </p>
                    <p className="text-[11px] text-slate-400">admin@impactbridge.org • Accreditation & Audit</p>
                  </div>
                  <span className="text-xs bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-bold group-hover:bg-amber-400">
                    Log In →
                  </span>
                </button>
              </div>

              {/* Alerts */}
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}
              {notice && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{notice}</span>
                </div>
              )}

              {/* Admin Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Admin Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@impactbridge.org"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Admin Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Authenticating Administrator...</span>
                  ) : (
                    <>
                      <span>Sign In to Admin Dashboard</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </form>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Admin dashboard is strictly restricted to administrator accounts. Regular users (donors and volunteers) cannot access or view administrative controls.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
