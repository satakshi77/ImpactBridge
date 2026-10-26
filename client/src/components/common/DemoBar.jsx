import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  HeartHandshake,
  UserCheck,
  Sparkles,
  LogOut,
  X,
  ChevronDown,
} from 'lucide-react';

export const DemoBar = () => {
  const { user, demoSwitch, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleRoleSwitch = async (role) => {
    try {
      await demoSwitch(role);
      // Navigate to the role's isolated workspace
      switch (role) {
        case 'ngo':
          navigate('/ngo/dashboard');
          break;
        case 'volunteer':
          navigate('/volunteer/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'donor':
        default:
          navigate('/donor/dashboard');
          break;
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 bg-slate-900 text-emerald-400 border border-slate-700 text-xs px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
        title="Open Role Switcher"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Demo Switcher</span>
      </button>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> Demo Switcher:
          </span>
          <span className="text-slate-400 hidden sm:inline">Click to test role-isolated views:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handleRoleSwitch('donor')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              user?.role === 'donor'
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
            <span>Donor (Alex)</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('ngo')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              user?.role === 'ngo'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NGO (Sunita)</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('volunteer')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              user?.role === 'volunteer'
                ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Volunteer (Priya)</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('admin')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              user?.role === 'admin'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin (Dr. Sarah)</span>
          </button>

          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Log out"
              className="p-1 rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setCollapsed(true)}
            title="Minimize Bar"
            className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
