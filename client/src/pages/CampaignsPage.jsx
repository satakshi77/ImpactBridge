import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import { Search, Filter, ShieldCheck, Heart, MapPin, Compass, ArrowRight } from 'lucide-react';

export const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCause, setSelectedCause] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const causeList = [
    'All',
    'Clean Water & Sanitation',
    'Quality Education',
    'Healthcare & Medical',
    'Environment & Climate',
    'Hunger & Nutrition',
    'Women Empowerment',
  ];

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (selectedCause !== 'All') query.append('cause', selectedCause);
      if (selectedStatus !== 'All') query.append('status', selectedStatus.toLowerCase());

      const data = await apiFetch(`/campaigns?${query.toString()}`);
      if (data.success) {
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCause, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCampaigns();
  };

  return (
    <ImpactBridgeLayout title="Explore Campaigns">
      {/* Search & Filter Bar Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search initiatives, causes, or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </form>

          {/* Quick Cause Filter Select */}
          <div className="flex items-center gap-3">
            <select
              value={selectedCause}
              onChange={(e) => setSelectedCause(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {causeList.map((cause) => (
                <option key={cause} value={cause}>
                  {cause}
                </option>
              ))}
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

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-slate-400 text-xs font-semibold">
            Loading verified campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="col-span-3 bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)]">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No campaigns found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp._id}
              className="bg-white rounded-3xl border border-slate-100/80 overflow-hidden shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={camp.coverImage}
                  alt={camp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#141b2d]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  {camp.causeArea}
                </span>
                <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 80G Tax Exemption
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {camp.organization?.name}
                  </p>
                  <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-2 font-heading group-hover:text-blue-600 transition-colors">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {camp.shortDescription}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-900 font-heading font-bold">
                      ₹{Number(camp.fundsRaised).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#2563eb]">{camp.percentFunded}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2563eb] h-full rounded-full"
                      style={{ width: `${Math.min(camp.percentFunded, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Target: ₹{Number(camp.fundingTarget).toLocaleString('en-IN')}</span>
                    <span>{camp.totalDonationsCount || 0} Donors</span>
                  </div>
                </div>

                <Link
                  to={`/campaigns/${camp._id}`}
                  className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-xs text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>View Details & Donate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </ImpactBridgeLayout>
  );
};
