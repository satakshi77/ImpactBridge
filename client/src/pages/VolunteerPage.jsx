import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { VolunteerCard } from '../components/volunteer/VolunteerCard';
import { ApplyModal } from '../components/volunteer/ApplyModal';
import { Users, Sparkles, Filter, Search, CheckCircle } from 'lucide-react';

export const VolunteerPage = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCause, setSelectedCause] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');
  const [activeOppToApply, setActiveOppToApply] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const causeList = [
    'All',
    'Clean Water & Sanitation',
    'Quality Education',
    'Healthcare & Medical',
    'Environment & Climate',
  ];

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedCause !== 'All') query.append('cause', selectedCause);
      if (selectedType !== 'All') query.append('locationType', selectedType);
      if (search) query.append('search', search);

      const data = await apiFetch(`/volunteers?${query.toString()}`);
      if (data.success) {
        setOpportunities(data.opportunities || []);
      }

      // If user is volunteer, fetch their existing applications to flag "Already Applied"
      if (user && user.role === 'volunteer') {
        const appData = await apiFetch('/volunteers/my-applications');
        if (appData.success) {
          const ids = new Set(appData.applications.map((a) => a.opportunity?._id || a.opportunity));
          setAppliedIds(ids);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCause, selectedType, user]);

  const handleApplySuccess = (application) => {
    setToastMessage('Application submitted successfully! The organization has been notified.');
    setAppliedIds((prev) => new Set([...prev, application.opportunity]));
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
            Skill-Based Volunteering
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Smart Volunteer Matching Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Match your skills with mission-driven NGOs. Build a verified portfolio of confirmed service hours
            and recommendations.
          </p>
        </div>

        {/* User Skills Indicator banner if volunteer */}
        {user && user.role === 'volunteer' && (
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-xs space-y-1">
            <span className="font-bold text-purple-900 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-600" /> Smart Matching Active for {user.name}
            </span>
            <p className="text-purple-700">
              Matched against your profile skills: {(user.skills || []).join(', ') || 'General Support'}
            </p>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Cause Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {causeList.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCause(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCause === c
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Location Type Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['All', 'Remote', 'On-site'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                selectedType === type ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 h-96 border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-slate-500 text-sm">No volunteering opportunities match the chosen filters.</p>
          <button
            onClick={() => {
              setSelectedCause('All');
              setSelectedType('All');
            }}
            className="text-xs font-bold text-purple-700 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunities.map((opp) => (
            <VolunteerCard
              key={opp._id}
              opportunity={opp}
              hasApplied={appliedIds.has(opp._id)}
              onApply={(item) => setActiveOppToApply(item)}
            />
          ))}
        </div>
      )}

      {/* Application Modal */}
      <ApplyModal
        opportunity={activeOppToApply}
        isOpen={Boolean(activeOppToApply)}
        onClose={() => setActiveOppToApply(null)}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
};
