import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogOut, Lock } from 'lucide-react';

export const UnauthorizedPage = ({ requiredRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = (role) => {
    switch (role) {
      case 'ngo':
        return '/ngo/dashboard';
      case 'volunteer':
        return '/volunteer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'donor':
      default:
        return '/donor/dashboard';
    }
  };

  const handleSwitchAccount = () => {
    logout();
    navigate(requiredRole ? `/login/${requiredRole}` : '/login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block">
            Role Permission Required
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Access Restricted
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            This area is restricted to users with{' '}
            <strong className="text-slate-900 capitalize font-semibold">{requiredRole || 'authorized'}</strong>{' '}
            permissions.
          </p>
        </div>

        {user && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Signed in as:</span>
              <span className="font-semibold text-slate-800">{user.name}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Current Role:</span>
              <span className="font-bold capitalize text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {user.role}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {user && (
            <Link
              to={getDashboardPath(user.role)}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to My {user.role.toUpperCase()} Dashboard</span>
            </Link>
          )}

          <button
            onClick={handleSwitchAccount}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Sign in as {requiredRole ? requiredRole.toUpperCase() : 'Different Role'}</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
