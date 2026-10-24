import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

  // Monthly Giving Data mockup for chart
  const givingActivityData = [
    { month: 'Jun', amount: 5000 },
    { month: 'Jul', amount: 8000 },
    { month: 'Aug', amount: 12000 },
    { month: 'Sep', amount: 20000 },
    { month: 'Oct', amount: 45000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Donor Profile Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{user?.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Donor Impact Hub
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-md">{user?.bio || 'Philanthropist & Community Change Supporter'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(user?.badges || []).map((b, i) => (
              <span
                key={i}
                className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/10 flex items-center gap-1.5"
                title={b.description}
              >
                <span>{b.icon}</span>
                <span>{b.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Impact Stats Grid (Matches Attachment 5) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10 text-center">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Total Donated</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">
              ₹{Number(user?.totalDonated || 45000).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Supported Projects</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-mono mt-1 block">
              {supportedProjects.length}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Milestones Reached</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono mt-1 block">
              {supportedProjects.reduce((sum, p) => sum + (p.completedMilestones || 0), 0)}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Volunteer Hours</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono mt-1 block">
              {user?.hoursVolunteered || 0} hrs
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('projects')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Supported Projects ({supportedProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Donation History & Receipts ({donations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'saved'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Watchlist ({savedCampaigns.length})</span>
        </button>
      </div>

      {/* Tab 1: Supported Projects with Live Milestones Progression */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportedProjects.length === 0 ? (
              <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-slate-200">
                <p className="text-slate-500 text-sm">You haven't supported any campaigns yet.</p>
                <Link to="/campaigns" className="mt-3 inline-block text-xs font-bold text-emerald-600 hover:underline">
                  Discover High-Impact Causes
                </Link>
              </div>
            ) : (
              supportedProjects.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <img
                      src={item.campaign?.coverImage}
                      alt={item.campaign?.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {item.campaign?.causeArea}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1 font-heading">
                        {item.campaign?.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">By {item.organization?.name}</p>
                    </div>
                  </div>

                  {/* Personal contribution badge */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Your Total Contribution</span>
                      <span className="font-bold font-mono text-emerald-700 text-sm">
                        ₹{Number(item.myTotalContribution).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">First Supported</span>
                      <span className="text-slate-700 font-medium">
                        {new Date(item.firstDonationDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Milestone Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Project Milestones: {item.completedMilestones} of {item.totalMilestones} Completed</span>
                      <span className="text-emerald-600 font-bold">{item.milestonesProgressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${item.milestonesProgressPercent}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/campaigns/${item.campaign?._id}`}
                    className="block text-center py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition"
                  >
                    Open Live Project Impact Tracker →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Donation History & Receipts */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Campaign</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">80G Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{d.receiptNumber}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 line-clamp-1">{d.campaign?.title}</td>
                    <td className="py-3.5 px-4 text-slate-600">{d.organization?.name}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{Number(d.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        80G Tax Deductible
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
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
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                      >
                        Download 80G Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Saved Watchlist */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCampaigns.map((camp) => (
            <Link
              key={camp._id}
              to={`/campaigns/${camp._id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-lg transition space-y-3"
            >
              <img src={camp.coverImage} alt={camp.title} className="w-full h-36 object-cover rounded-xl" />
              <h4 className="text-sm font-bold text-slate-900 font-heading line-clamp-2">{camp.title}</h4>
              <div className="text-xs font-semibold text-slate-600 flex justify-between">
                <span>₹{Number(camp.fundsRaised).toLocaleString('en-IN')} Raised</span>
                <span className="text-emerald-600 font-bold">{camp.percentFunded}%</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        receipt={selectedReceipt}
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
