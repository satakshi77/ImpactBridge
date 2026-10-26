import React, { useState, useEffect, useRef } from 'react';
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
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userMenuRef = useRef(null);
  const loginMenuRef = useRef(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (loginMenuRef.current && !loginMenuRef.current.contains(e.target)) {
        setLoginMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Role badge colors
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ngo':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'volunteer':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'donor':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-xs transition-all">
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

          {/* Desktop Navigation - Role-Filtered Visibility */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* PUBLIC OR DONOR VIEW */}
            {(!user || user.role === 'donor') && (
              <>
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
                {!user && (
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
                )}
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
                {user?.role === 'donor' && (
                  <Link
                    to="/donor/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      isActive('/donor/dashboard')
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-blue-600" />
                    <span>My Contributions & 80G Receipts</span>
                  </Link>
                )}
              </>
            )}

            {/* VOLUNTEER VIEW */}
            {user?.role === 'volunteer' && (
              <>
                <Link
                  to="/volunteers"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/volunteers')
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Volunteer Opportunities</span>
                </Link>
                <Link
                  to="/volunteer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/volunteer/dashboard')
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-600" />
                  <span>My Service Hours & Badges</span>
                </Link>
                <Link
                  to="/campaigns"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/campaigns')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Explore Causes
                </Link>
                <Link
                  to="/map"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/map')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Impact Map</span>
                </Link>
              </>
            )}

            {/* NGO VIEW */}
            {user?.role === 'ngo' && (
              <>
                <Link
                  to="/ngo/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/ngo/dashboard')
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>NGO Dashboard</span>
                </Link>
                <Link
                  to="/campaigns"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/campaigns')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Campaigns Directory
                </Link>
                <Link
                  to="/map"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/map')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Impact Map</span>
                </Link>
              </>
            )}

            {/* ADMIN VIEW */}
            {user?.role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/admin/dashboard')
                      ? 'bg-amber-50 text-amber-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Console</span>
                </Link>
                <Link
                  to="/ngos"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/ngos')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  NGO Accreditation
                </Link>
                <Link
                  to="/map"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/map')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Impact Map</span>
                </Link>
              </>
            )}
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
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition hover:shadow-md"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="capitalize">{user.role} Dashboard</span>
                </Link>

                {/* User Dropdown Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-slate-300 group-hover:border-slate-900 transition shadow-xs"
                    />
                    <div className="hidden lg:block text-left text-xs leading-tight">
                      <span className="font-semibold text-slate-800 block truncate max-w-[110px]">{user.name}</span>
                      <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="mt-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRoleBadge(user.role)}`}>
                            {user.role} Portal Active
                          </span>
                        </div>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-500" />
                          <span>My {user.role.toUpperCase()} Workspace</span>
                        </Link>

                        <Link
                          to="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <Layers className="w-4 h-4 text-slate-500" />
                          <span>Switch Role / Portal</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold text-left transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out of ImpactBridge</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {/* Role-Specific Login Dropdown */}
                <div className="relative" ref={loginMenuRef}>
                  <button
                    onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                  >
                    <span>Portals / Sign In</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {loginMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        Choose Login Portal
                      </div>
                      <Link
                        to="/login/donor"
                        onClick={() => setLoginMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                      >
                        <Heart className="w-3.5 h-3.5 text-blue-600" />
                        <span>Donor Portal</span>
                      </Link>
                      <Link
                        to="/login/ngo"
                        onClick={() => setLoginMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>NGO Organization Portal</span>
                      </Link>
                      <Link
                        to="/login/volunteer"
                        onClick={() => setLoginMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>Volunteer Hub</span>
                      </Link>
                      <Link
                        to="/login/admin"
                        onClick={() => setLoginMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition border-t border-slate-100"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin Console</span>
                      </Link>
                      <div className="p-2 border-t border-slate-100 bg-slate-50/50 mt-1">
                        <Link
                          to="/login"
                          onClick={() => setLoginMenuOpen(false)}
                          className="block text-center text-[11px] font-bold text-slate-600 hover:text-slate-900"
                        >
                          View All Portals Overview →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition"
                >
                  Join Platform
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
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {(!user || user.role === 'donor') && (
            <>
              <Link
                to="/campaigns"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Explore Campaigns
              </Link>
              {!user && (
                <Link
                  to="/volunteers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Volunteer Hub
                </Link>
              )}
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Community Impact Map
              </Link>
              <Link
                to="/ngos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Verified NGOs
              </Link>
            </>
          )}

          {user?.role === 'volunteer' && (
            <>
              <Link
                to="/volunteers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-50"
              >
                Volunteer Opportunities
              </Link>
              <Link
                to="/volunteer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium bg-purple-50 text-purple-700"
              >
                My Service Hours & Badges
              </Link>
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Impact Map
              </Link>
            </>
          )}

          {user?.role === 'ngo' && (
            <>
              <Link
                to="/ngo/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium bg-emerald-50 text-emerald-700"
              >
                NGO Dashboard (Campaigns & Expenses)
              </Link>
              <Link
                to="/campaigns"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Campaigns Directory
              </Link>
              <Link
                to="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Impact Map
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium bg-amber-50 text-amber-700"
              >
                Admin Governance Console
              </Link>
              <Link
                to="/ngos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                NGO Accreditation
              </Link>
            </>
          )}

          {user ? (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Logged in as <strong className="capitalize">{user.role}</strong>
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="text-xs text-rose-600 font-bold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-center text-xs font-bold text-slate-700 border border-slate-200 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-center text-xs font-bold text-white bg-emerald-600 rounded-lg"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
