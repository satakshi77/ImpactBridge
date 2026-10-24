import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';
import {
  Globe,
  Heart,
  Users,
  Compass,
  Bell,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  FileText,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await apiFetch('/stats/notifications');
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, location.pathname]);

  const handleMarkRead = async () => {
    try {
      await apiFetch('/stats/notifications/mark-read', { method: 'PUT' });
      setUnreadCount(0);
    } catch (e) {
      // ignore
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
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

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-[33px] z-40 border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1 font-heading">
                Impact<span className="text-emerald-600">Bridge</span>
              </span>
              <span className="text-[10px] block font-medium text-slate-400 uppercase tracking-wider -mt-1">
                Give • Volunteer • See
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/campaigns"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/campaigns')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore Campaigns
            </Link>
            <Link
              to="/volunteers"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/volunteers')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Volunteer Hub</span>
            </Link>
            <Link
              to="/map"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/map')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Impact Map</span>
            </Link>
            <Link
              to="/ngos"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/ngos')
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Verified NGOs
            </Link>
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      if (!notificationsOpen && unreadCount > 0) handleMarkRead();
                    }}
                    className="p-2 rounded-full text-slate-600 hover:bg-slate-100 relative transition cursor-pointer"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-800">Notifications</span>
                        <span className="text-xs text-slate-400">{notifications.length} recent</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">No notifications yet</div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <Link
                              key={n._id}
                              to={n.link || '#'}
                              onClick={() => setNotificationsOpen(false)}
                              className="block p-3 hover:bg-slate-50 transition text-left"
                            >
                              <p className="text-xs font-semibold text-slate-800 mb-0.5">{n.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Button */}
                <Link
                  to={getDashboardPath()}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition hover:shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="capitalize">{user.role} Dashboard</span>
                </Link>

                {/* User Avatar */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                  />
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <span className="font-semibold text-slate-800 block truncate max-w-[110px]">{user.name}</span>
                    <span className="text-emerald-600 font-medium capitalize text-[10px]">{user.role}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/campaigns"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Campaigns
          </Link>
          <Link
            to="/volunteers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Volunteer Hub
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Community Impact Map
          </Link>
          <Link
            to="/ngos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Verified NGOs
          </Link>
          {user && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-50 text-emerald-700"
            >
              Go to {user.role} Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
