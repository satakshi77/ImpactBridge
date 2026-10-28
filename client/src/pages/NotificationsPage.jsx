import React, { useState } from 'react';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Bell,
  Heart,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  Trash2,
  Check,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const isDemo = ['admin@impactbridge.org', 'alex.donor@example.com', 'priya.volunteer@example.com', 'greenearth@ngo.org'].includes(
    user?.email?.toLowerCase()
  );

  // Pre-configured notifications for demo accounts, or fresh welcome for new users
  const getInitialNotifications = () => {
    if (!isDemo) {
      return [
        {
          id: 'notif_welcome',
          type: 'system',
          title: 'Welcome to ImpactBridge! 🎉',
          message: 'Your account is active. Explore verified campaigns with direct milestone tracking or volunteer for causes in need.',
          time: 'Just now',
          read: false,
          link: '/campaigns',
          actionText: 'Explore Campaigns',
        },
      ];
    }

    if (user?.role === 'donor') {
      return [
        {
          id: 'notif_d1',
          type: 'donation',
          title: 'Section 80G Tax Receipt Ready',
          message: 'Official 80G tax exemption receipt #REC-80G-2026-00984 for your contribution of ₹25,000 has been certified.',
          time: '2 hours ago',
          read: false,
          link: '/donor/dashboard',
          actionText: 'View Receipt',
        },
        {
          id: 'notif_d2',
          type: 'milestone',
          title: 'Milestone 100% Completed! 💧',
          message: 'Clean Drinking Water Barmer completed "Hydrological Survey & Sonar Borewells". 12 villages connected.',
          time: 'Yesterday',
          read: false,
          link: '/campaigns/clean-drinking-water-barmer-villages',
          actionText: 'View Milestone Report',
        },
        {
          id: 'notif_d3',
          type: 'expense',
          title: 'New Expense Voucher Logged',
          message: 'Green Earth Alliance logged an itemized expense of ₹2,40,000 for 6 Solar Inverters & RO membranes with vendor tax invoices.',
          time: '3 days ago',
          read: true,
          link: '/donor/dashboard',
          actionText: 'Inspect Financial Ledger',
        },
      ];
    }

    if (user?.role === 'volunteer') {
      return [
        {
          id: 'notif_v1',
          type: 'volunteer',
          title: 'Service Hours Confirmed! 🏆',
          message: 'Green Earth Alliance verified 24 community hours for your Water Purity Quality testing. Official service certificate generated.',
          time: '1 hour ago',
          read: false,
          link: '/volunteer/dashboard',
          actionText: 'View Certificate',
        },
        {
          id: 'notif_v2',
          type: 'match',
          title: '95% Smart Skill Match Found ⭐',
          message: 'A new opportunity "STEM & Digital Literacy Mentor" matches your teaching and communication skills.',
          time: 'Yesterday',
          read: false,
          link: '/volunteers',
          actionText: 'Apply Now',
        },
        {
          id: 'notif_v3',
          type: 'volunteer',
          title: 'Application Under Review',
          message: 'Your application for Water Purity Testing in Barmer is being reviewed by the NGO field coordinator.',
          time: '4 days ago',
          read: true,
          link: '/volunteer/dashboard',
          actionText: 'Check Application',
        },
      ];
    }

    if (user?.role === 'ngo') {
      return [
        {
          id: 'notif_n1',
          type: 'donation',
          title: 'New Contribution Received! 💚',
          message: 'Alex Morgan contributed ₹25,000 to "Clean Drinking Water Barmer". Total campaign funding reached 78%.',
          time: '3 hours ago',
          read: false,
          link: '/ngo/dashboard',
          actionText: 'View in Dashboard',
        },
        {
          id: 'notif_n2',
          type: 'volunteer',
          title: 'New Volunteer Application',
          message: 'Priya Patel applied for "Water Purity Testing & Community Surveyor" with verified skill credentials.',
          time: 'Yesterday',
          read: false,
          link: '/ngo/dashboard',
          actionText: 'Review Applicant',
        },
        {
          id: 'notif_n3',
          type: 'system',
          title: 'Section 80G Accreditation Active',
          message: 'Your FCRA and 80G tax clearance documents were reviewed and certified by Platform Compliance.',
          time: '1 week ago',
          read: true,
          link: '/ngo/dashboard',
          actionText: 'View Credentials',
        },
      ];
    }

    // Admin
    return [
      {
        id: 'notif_a1',
        type: 'admin',
        title: 'New NGO Accreditation Pending',
        message: 'Sanjeevani Health Outreach submitted Karnataka Societies registration documents for platform verification.',
        time: '30 mins ago',
        read: false,
        link: '/admin/dashboard',
        actionText: 'Review Verification',
      },
      {
        id: 'notif_a2',
        type: 'milestone',
        title: 'Escrow Milestone Approved',
        message: 'Auto-escrow released ₹1,20,000 disbursement for Barmer Hydrological Survey against verified NABL laboratory report.',
        time: '2 days ago',
        read: true,
        link: '/admin/dashboard',
        actionText: 'View Audit Log',
      },
    ];
  };

  const [notifications, setNotifications] = useState(getInitialNotifications());
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'donation' | 'volunteer' | 'milestone'

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'donation') return n.type === 'donation';
    if (filter === 'volunteer') return n.type === 'volunteer' || n.type === 'match';
    if (filter === 'milestone') return n.type === 'milestone' || n.type === 'expense';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'donation':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'volunteer':
      case 'match':
        return <Award className="w-5 h-5 text-blue-600" />;
      case 'milestone':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'expense':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'admin':
        return <ShieldCheck className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'donation':
        return 'bg-rose-50 border-rose-100';
      case 'volunteer':
      case 'match':
        return 'bg-blue-50 border-blue-100';
      case 'milestone':
        return 'bg-emerald-50 border-emerald-100';
      case 'expense':
        return 'bg-purple-50 border-purple-100';
      case 'admin':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <ImpactBridgeLayout title="Notifications Center">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
              Activity & System Alerts
            </h2>
            {unreadCount > 0 ? (
              <span className="bg-[#2563eb] text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                {unreadCount} New
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-0.5 rounded-full">
                All Caught Up
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personal updates on contribution receipts, milestone disbursements, and volunteering verifications.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563eb] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'donation', label: 'Donations & 80G' },
          { id: 'volunteer', label: 'Volunteering' },
          { id: 'milestone', label: 'Milestones & Expenses' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filter === tab.id
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Bell className="w-7 h-7 text-[#2563eb]" />
            </div>
            <h3 className="text-base font-bold text-slate-800 font-heading">
              No Notifications Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filter === 'unread'
                ? "You have read all your notifications! We'll notify you when new activity occurs."
                : 'No alerts matching this filter category.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                n.read
                  ? 'border-slate-100 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.03)] opacity-85 hover:opacity-100'
                  : 'border-blue-200/80 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.08)] bg-gradient-to-r from-blue-50/20 to-white'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Icon Pill */}
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${getBgColor(
                    n.type
                  )}`}
                >
                  {getIcon(n.type)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="text-sm font-bold text-slate-900 font-heading">
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#2563eb] inline-block animate-pulse" />
                    )}
                    <span className="text-[11px] font-medium text-slate-400">
                      • {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>

              {/* Action Link & Dismiss */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {n.link && (
                  <Link
                    to={n.link}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold transition border border-slate-200/60"
                  >
                    <span>{n.actionText || 'View'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <button
                  onClick={() => toggleRead(n.id)}
                  title={n.read ? 'Mark as unread' : 'Mark as read'}
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  <Check className={`w-4 h-4 ${n.read ? 'text-slate-300' : 'text-blue-600'}`} />
                </button>
                <button
                  onClick={() => deleteNotification(n.id)}
                  title="Delete notification"
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </ImpactBridgeLayout>
  );
};
