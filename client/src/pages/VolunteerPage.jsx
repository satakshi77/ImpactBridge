import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
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
    <ImpactBridgeLayout title="Volunteer Opportunities">
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

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by required skill, initiative, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Locations</option>
              <option value="remote">Virtual / Remote</option>
              <option value="on-site">On-Site Field</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Cause Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {causeList.map((cause) => (
            <button
              key={cause}
              onClick={() => setSelectedCause(cause)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedCause === cause
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cause}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-slate-400 text-xs font-semibold">
            Loading volunteer drives...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="col-span-3 bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)]">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No opportunities match criteria</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or checking back shortly.</p>
          </div>
        ) : (
          opportunities.map((opp) => (
            <VolunteerCard
              key={opp._id}
              opportunity={opp}
              isApplied={appliedIds.has(opp._id)}
              onApply={() => setActiveOppToApply(opp)}
            />
          ))
        )}
      </div>

      {/* Application Modal */}
      {activeOppToApply && (
        <ApplyModal
          opportunity={activeOppToApply}
          isOpen={Boolean(activeOppToApply)}
          onClose={() => setActiveOppToApply(null)}
          onSuccess={handleApplySuccess}
        />
      )}
    </ImpactBridgeLayout>
  );
};
