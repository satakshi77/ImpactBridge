import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import { ReceiptModal } from '../components/donation/ReceiptModal';
import {
  Heart,
  TrendingUp,
  Award,
  Bookmark,
  FileText,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Compass,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export const DonorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'history' | 'saved'
  const [supportedProjects, setSupportedProjects] = useState([]);
  const [donations, setDonations] = useState([]);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const [projRes, donRes, savedRes] = await Promise.all([
          apiFetch('/donations/supported-projects'),
          apiFetch('/donations/my'),
          apiFetch('/campaigns/saved'),
        ]);

        if (projRes.success) setSupportedProjects(projRes.supportedProjects || []);
        if (donRes.success) setDonations(donRes.donations || []);
        if (savedRes.success) setSavedCampaigns(savedRes.savedCampaigns || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDonorData();
  }, []);

  const totalDonated = user?.totalDonated !== undefined && user?.totalDonated !== null
    ? user.totalDonated
    : donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalMilestones = supportedProjects.reduce((sum, p) => sum + (p.completedMilestones || 0), 0);
  const volunteerHours = user?.hoursVolunteered || 0;

  const getStatusBadge = (status) => {
    const s = (status || 'active').toLowerCase();
    if (s === 'completed' || s === 'verified' || s === 'funded') {
      return (
        <span className="bg-[#dcfce7] text-[#15803d] font-bold text-xs px-3 py-1 rounded-full inline-block">
          Completed
        </span>
      );
    }
    if (s === 'in progress' || s === 'active') {
      return (
        <span className="bg-[#dbeafe] text-[#1d4ed8] font-bold text-xs px-3 py-1 rounded-full inline-block">
          In Progress
        </span>
      );
    }
    return (
      <span className="bg-[#fef3c7] text-[#b45309] font-bold text-xs px-3 py-1 rounded-full inline-block">
        Submitted
      </span>
    );
  };

  return (
    <ImpactBridgeLayout title="Dashboard">
      {/* 3 TOP STAT METRIC CARDS (Exact styling of Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Donated */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-blue-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            TOTAL DONATED
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              ₹{Number(totalDonated).toLocaleString('en-IN')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <Heart className="w-5 h-5 text-[#2563eb]" />
            </div>
          </div>
        </div>

        {/* Card 2: Supported Projects */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-emerald-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            SUPPORTED CAUSES
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {supportedProjects.length}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Compass className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Card 3: Milestones Reached */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-purple-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            MILESTONES REACHED
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {totalMilestones}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Card 4: Volunteer Service */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-amber-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            VOLUNTEER HOURS
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {volunteerHours} hrs
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* OVERVIEW SECTION (Matching Image 1 Table container) */}
      <div className="bg-white rounded-3xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
        {/* Table Title & Filter Tabs */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
              Donations & Campaigns Overview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent fund allocation, verified milestone updates, and 80G tax certificates.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Supported Projects ({supportedProjects.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Donation History ({donations.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Watchlist ({savedCampaigns.length})
            </button>
          </div>
        </div>

        {/* TAB 1: Supported Projects Table */}
        {activeTab === 'projects' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 px-6">CAMPAIGN</th>
                  <th className="py-4 px-6">CATEGORY</th>
                  <th className="py-4 px-6 text-center">STATUS</th>
                  <th className="py-4 px-6">YOUR CONTRIBUTION</th>
                  <th className="py-4 px-6">PROGRESS</th>
                  <th className="py-4 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {supportedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      No supported campaigns yet.{' '}
                      <Link to="/campaigns" className="text-blue-600 font-bold hover:underline">
                        Explore live campaigns
                      </Link>
                    </td>
                  </tr>
                ) : (
                  supportedProjects.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.campaign?.coverImage}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                              {item.campaign?.title}
                            </p>
                            <p className="text-[11px] text-slate-400">By {item.organization?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600 text-xs">
                        {item.campaign?.causeArea || 'General Welfare'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(item.campaign?.status || 'In Progress')}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-800 text-xs">
                        ₹{Number(item.myTotalContribution).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#2563eb] h-full rounded-full"
                              style={{ width: `${item.milestonesProgressPercent || 60}%` }}
                            />
                          </div>
                          <span className="font-bold text-blue-600 font-mono text-[11px]">
                            {item.milestonesProgressPercent || 60}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/campaigns/${item.campaign?._id}`}
                          className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs inline-block active:scale-95"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Donation History & 80G Receipts */}
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 px-6">RECEIPT #</th>
                  <th className="py-4 px-6">CAMPAIGN</th>
                  <th className="py-4 px-6">AMOUNT</th>
                  <th className="py-4 px-6 text-center">80G STATUS</th>
                  <th className="py-4 px-6">DATE</th>
                  <th className="py-4 px-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-800 text-xs">
                      {d.receiptNumber}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900 text-xs line-clamp-1">
                      {d.campaign?.title}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-800 text-xs">
                      ₹{Number(d.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-[#dcfce7] text-[#15803d] font-bold text-xs px-3 py-1 rounded-full inline-block">
                        80G Deductible
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {new Date(d.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() =>
                          setSelectedReceipt({
                            receiptNumber: d.receiptNumber,
                            transactionId: d.transactionId,
                            amount: d.amount,
                            donorName: user?.name,
                            campaignTitle: d.campaign?.title,
                            organizationName: d.organization?.name,
                            date: d.createdAt,
                            panNumber: d.panNumber,
                          })
                        }
                        className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs inline-block cursor-pointer active:scale-95"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Saved Watchlist */}
        {activeTab === 'saved' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCampaigns.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-400 text-xs">
                Your watchlist is currently empty.{' '}
                <Link to="/campaigns" className="text-blue-600 font-bold hover:underline">
                  Browse Campaigns
                </Link>
              </div>
            ) : (
              savedCampaigns.map((camp) => (
                <Link
                  key={camp._id}
                  to={`/campaigns/${camp._id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-lg transition space-y-3 group"
                >
                  <img src={camp.coverImage} alt={camp.title} className="w-full h-36 object-cover rounded-xl" />
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2">
                    {camp.title}
                  </h4>
                  <div className="text-xs font-semibold text-slate-600 flex justify-between">
                    <span>₹{Number(camp.fundsRaised).toLocaleString('en-IN')} Raised</span>
                    <span className="text-blue-600 font-bold">{camp.percentFunded}%</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* 80G Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
      />
    </ImpactBridgeLayout>
  );
};
