import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, HeartHandshake, UserCheck, Sparkles, LogOut } from 'lucide-react';

export const DemoBar = () => {
  const { user, demoSwitch, logout } = useAuth();

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
          <span className="text-slate-400 hidden sm:inline">Click any role to test workflow:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => demoSwitch('donor')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all ${
              user?.role === 'donor'
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
            <span>Donor (Alex)</span>
          </button>

          <button
            onClick={() => demoSwitch('ngo')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all ${
              user?.role === 'ngo'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NGO (Green Earth)</span>
          </button>

          <button
            onClick={() => demoSwitch('volunteer')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all ${
              user?.role === 'volunteer'
                ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Volunteer (Priya)</span>
          </button>

          <button
            onClick={() => demoSwitch('admin')}
            className={`px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all ${
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
              onClick={logout}
              title="Log out"
              className="p-1 rounded-full text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
