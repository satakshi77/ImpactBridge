import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Users,
  Megaphone,
  MapPin,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Heart,
  Building2,
  FileText,
} from 'lucide-react';

export const ImpactBridgeLayout = ({ children, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine user dashboard path
  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'ngo') return '/ngo/dashboard';
    if (user.role === 'volunteer') return '/volunteer/dashboard';
    return '/donor/dashboard';
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: getDashboardPath(),
      icon: LayoutDashboard,
      activePatterns: ['/dashboard', '/donor/dashboard', '/volunteer/dashboard', '/ngo/dashboard', '/admin/dashboard'],
    },
    {
      name: 'Campaigns',
      path: '/campaigns',
      icon: Compass,
      activePatterns: ['/campaigns'],
    },
    {
      name: 'Volunteer Hub',
      path: '/volunteers',
      icon: Users,
      activePatterns: ['/volunteers'],
    },
    {
      name: 'Impact Updates',
      path: '/updates',
      icon: Megaphone,
      activePatterns: ['/updates'],
    },
    {
      name: 'Impact Map',
      path: '/map',
      icon: MapPin,
      activePatterns: ['/map'],
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: 7,
      activePatterns: ['/notifications'],
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      activePatterns: ['/profile'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex text-slate-800 font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Dark Navy/Slate #141b2d) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141b2d] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'
        } border-r border-slate-800/80 shadow-2xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/60">
          <NavLink to={getDashboardPath()} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-2 shrink-0 group-hover:scale-105 transition-transform">
              {/* ImpactBridge Logo Icon */}
              <svg className="w-6 h-6 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-tight font-heading">
                ImpactBridge
              </span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                Transparency Hub
              </span>
            </div>
          </NavLink>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.activePatterns
              ? item.activePatterns.some((pattern) => location.pathname === pattern || location.pathname.startsWith(`${pattern}/`))
              : location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white text-[#2563eb]'
                        : 'bg-blue-600/30 text-blue-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Logged-in User Profile */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0f1422]">
          <NavLink to="/profile" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-sm">
              {(user?.name || 'User').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Alex Morgan'}
              </p>
              <p className="text-[10px] text-slate-400 truncate capitalize">
                {user?.role || 'Donor'} Account
              </p>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* TOP BAR (Clean White Header) */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {title}
            </h1>
          </div>

          {/* Right: Notifications, User Pill & Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell with red badge */}
            <NavLink
              to="/notifications"
              className="relative p-2.5 rounded-full hover:bg-slate-100 transition text-slate-600 hover:text-slate-900"
              title="View notifications"
            >
              <Bell className="w-5 h-5 text-amber-500 fill-amber-400/20" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                7
              </span>
            </NavLink>

            {/* Dark User Pill */}
            <NavLink
              to="/profile"
              className="hidden sm:flex items-center gap-2 bg-[#141b2d] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{user?.name || 'Alex Morgan'}</span>
            </NavLink>

            {/* Red Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <LogOut className="w-4 h-4 sm:hidden" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
};
