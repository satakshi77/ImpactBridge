import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { Search, Filter, ShieldCheck, Heart, MapPin } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
            Discover Verified Causes
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Fundraising Campaigns & Real Outcomes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Every listed initiative includes transparent milestone roadmaps, vendor expense vouchers, and
            field progress photos.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[300px]">
          <input
            type="text"
            placeholder="Search campaigns or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
        {causeList.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCause(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCause === c
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 h-96 border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-slate-500 text-sm">No campaigns match your filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCause('All');
              setSearch('');
            }}
            className="text-xs font-bold text-emerald-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp) => (
            <Link
              key={camp._id}
              to={`/campaigns/${camp._id}`}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  src={camp.coverImage}
                  alt={camp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {camp.causeArea}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {camp.location?.city}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={camp.organization?.logo}
                      alt={camp.organization?.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-600 truncate">{camp.organization?.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition font-heading line-clamp-2">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {camp.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 font-mono font-bold">
                      ₹{camp.fundsRaised?.toLocaleString('en-IN')}{' '}
                      <span className="text-slate-400 font-normal">of ₹{camp.fundingTarget?.toLocaleString('en-IN')}</span>
                    </span>
                    <span className="text-emerald-600 font-bold">{camp.percentFunded}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${Math.min(camp.percentFunded, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
