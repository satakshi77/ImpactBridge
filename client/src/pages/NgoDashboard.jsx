import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import {
  TrendingUp,
  Plus,
  DollarSign,
  Users,
  Image,
  ShieldCheck,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const NgoDashboard = () => {
  const { user, organization, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' | 'expenses' | 'applications' | 'updates'
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Modals state
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isPublishUpdateOpen, setIsPublishUpdateOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  // Forms state
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    shortDescription: '',
    story: '',
    causeArea: 'Clean Water & Sanitation',
    fundingTarget: '',
    deadline: '',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    beneficiaryGroup: 'Local Community Members',
  });

  const [newExpense, setNewExpense] = useState({
    campaignId: '',
    title: '',
    category: 'Equipment & Materials',
    amount: '',
    vendor: '',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    verificationLevel: 'Document/Receipt Attached',
  });

  const [newMilestone, setNewMilestone] = useState({
    campaignId: '',
    title: '',
    description: '',
    targetBudget: '',
    plannedCompletionDate: '',
    metric: 'Beneficiaries Reached',
    targetValue: '',
  });

  const [newUpdate, setNewUpdate] = useState({
    campaignId: '',
    title: '',
    content: '',
    category: 'Field Photo Report',
    photoUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    metricLabel: 'People Impacted',
    metricValue: '',
  });

  const fetchData = async () => {
    try {
      const [campRes, appRes] = await Promise.all([
        apiFetch('/campaigns/my/ngo'),
        apiFetch('/volunteers/ngo-applications'),
      ]);

      if (campRes.success) {
        setCampaigns(campRes.campaigns || []);
        if (campRes.campaigns?.length > 0 && !selectedCampaignId) {
          setSelectedCampaignId(campRes.campaigns[0]._id);
          setNewExpense((prev) => ({ ...prev, campaignId: campRes.campaigns[0]._id }));
          setNewMilestone((prev) => ({ ...prev, campaignId: campRes.campaigns[0]._id }));
          setNewUpdate((prev) => ({ ...prev, campaignId: campRes.campaigns[0]._id }));
        }
      }
      if (appRes.success) setApplications(appRes.applications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          ...newCampaign,
          budgetPlan: [
            { category: 'Equipment & Materials', plannedAmount: Number(newCampaign.fundingTarget) * 0.6 },
            { category: 'Logistics & Transport', plannedAmount: Number(newCampaign.fundingTarget) * 0.2 },
            { category: 'Personnel & Field Honorarium', plannedAmount: Number(newCampaign.fundingTarget) * 0.2 },
          ],
        }),
      });

      if (data.success) {
        setToast('Campaign published successfully!');
        setIsCreateCampaignOpen(false);
        fetchData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/expenses', {
        method: 'POST',
        body: JSON.stringify(newExpense),
      });
      if (data.success) {
        setToast('Expense entry and voucher recorded successfully!');
        setIsAddExpenseOpen(false);
        fetchData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/milestones', {
        method: 'POST',
        body: JSON.stringify({
          campaignId: newMilestone.campaignId,
          title: newMilestone.title,
          description: newMilestone.description,
          targetBudget: Number(newMilestone.targetBudget),
          plannedCompletionDate: newMilestone.plannedCompletionDate,
          measurableTarget: {
            metric: newMilestone.metric,
            targetValue: Number(newMilestone.targetValue),
            currentValue: 0,
            unit: 'units',
          },
        }),
      });
      if (data.success) {
        setToast('Milestone added to project timeline!');
        setIsAddMilestoneOpen(false);
        fetchData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePublishUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/updates', {
        method: 'POST',
        body: JSON.stringify({
          campaignId: newUpdate.campaignId,
          title: newUpdate.title,
          content: newUpdate.content,
          category: newUpdate.category,
          photos: [newUpdate.photoUrl],
          outcomeIndicators: [
            { label: newUpdate.metricLabel, value: Number(newUpdate.metricValue) || 100, unit: 'reached' },
          ],
        }),
      });
      if (data.success) {
        setToast('Field progress story published! Campaign donors have been notified.');
        setIsPublishUpdateOpen(false);
        fetchData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReviewApplication = async (appId, status) => {
    try {
      const data = await apiFetch(`/volunteers/application/${appId}/review`, {
        method: 'PUT',
        body: JSON.stringify({ status, feedback: 'Selected for our upcoming field deployment.' }),
      });
      if (data.success) {
        setToast(`Volunteer application marked as ${status}!`);
        fetchData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmAttendance = async (appId) => {
    const hours = prompt('Enter number of confirmed volunteer hours to award:', '4');
    if (!hours) return;

    try {
      const data = await apiFetch(`/volunteers/application/${appId}/confirm-attendance`, {
        method: 'PUT',
        body: JSON.stringify({ hoursLogged: Number(hours), feedback: 'Outstanding contribution to our community mission.' }),
      });
      if (data.success) {
        setToast('Hours logged and official certificate issued to volunteer!');
        fetchData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const totalRaised = campaigns.reduce((sum, c) => sum + (c.fundsRaised || 0), 0);
  const totalMilestones = campaigns.reduce((sum, c) => sum + (c.milestones?.length || 0), 0);

  return (
    <ImpactBridgeLayout title="NGO Dashboard">
      {/* Toast */}
      {toast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in">
          <span className="font-semibold text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-200" /> {toast}
          </span>
          <button onClick={() => setToast('')} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* 4 TOP STAT CARDS (Image 1 layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-blue-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            TOTAL FUNDS RAISED
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              ₹{Number(totalRaised || 750000).toLocaleString('en-IN')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <DollarSign className="w-5 h-5 text-[#2563eb]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-emerald-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            ACTIVE CAMPAIGNS
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {campaigns.length || 3}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-purple-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            VOLUNTEER APPLICANTS
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {applications.length || 6}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-amber-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            PROJECT MILESTONES
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {totalMilestones || 8}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-1">
            Section 80G Certified Non-Profit
          </span>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            {organization?.name || user?.name} Operations Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registration: {organization?.registrationNumber || 'NGO-DEL-2015-8841A'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCreateCampaignOpen(true)}
            className="px-4 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Log Expense</span>
          </button>
          <button
            onClick={() => setIsPublishUpdateOpen(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Image className="w-4 h-4 text-blue-600" />
            <span>Post Update</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'campaigns'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>My Campaigns ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'applications'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Volunteer Applications ({applications.length})</span>
        </button>
      </div>

      {/* Tab 1: Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((camp) => (
              <div key={camp._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <img src={camp.coverImage} alt={camp.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {camp.causeArea}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1 font-heading">{camp.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      ₹{Number(camp.fundsRaised).toLocaleString('en-IN')} raised of ₹{Number(camp.fundingTarget).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(camp.percentFunded, 100)}%` }} />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Link
                    to={`/campaigns/${camp._id}`}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    View Public Impact Tracker →
                  </Link>
                  <button
                    onClick={() => {
                      setNewMilestone((prev) => ({ ...prev, campaignId: camp._id }));
                      setIsAddMilestoneOpen(true);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                  >
                    + Add Milestone
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Volunteer Applications */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Skills Offered</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {app.volunteer?.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{app.volunteer?.email}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{app.opportunity?.title}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(app.skillsOffered || []).slice(0, 3).map((s, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'approved'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleReviewApplication(app._id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewApplication(app._id, 'rejected')}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {app.status === 'approved' && !app.attendanceConfirmed && (
                          <button
                            onClick={() => handleConfirmAttendance(app._id)}
                            className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            Confirm Hours & Issue Certificate
                          </button>
                        )}
                        {app.status === 'completed' && (
                          <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 justify-center">
                            <CheckCircle className="w-3.5 h-3.5" /> Hours Confirmed ({app.hoursLogged}h)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CAMPAIGN */}
      {isCreateCampaignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-heading">Launch New Campaign</h3>
              <button onClick={() => setIsCreateCampaignOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. Solar Drinking Water Plant"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Budget (INR)</label>
                  <input
                    type="number"
                    required
                    value={newCampaign.fundingTarget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, fundingTarget: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. 500000"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cause Area</label>
                  <select
                    value={newCampaign.causeArea}
                    onChange={(e) => setNewCampaign({ ...newCampaign, causeArea: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option>Clean Water & Sanitation</option>
                    <option>Quality Education</option>
                    <option>Healthcare & Medical</option>
                    <option>Environment & Climate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deadline Date</label>
                <input
                  type="date"
                  required
                  value={newCampaign.deadline}
                  onChange={(e) => setNewCampaign({ ...newCampaign, deadline: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Summary</label>
                <input
                  type="text"
                  required
                  value={newCampaign.shortDescription}
                  onChange={(e) => setNewCampaign({ ...newCampaign, shortDescription: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="Brief 1-sentence impact overview"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Story Narrative</label>
                <textarea
                  rows={3}
                  required
                  value={newCampaign.story}
                  onChange={(e) => setNewCampaign({ ...newCampaign, story: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="Explain why this project is essential and how funds will be used..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                Publish Campaign to ImpactBridge
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG EXPENSE */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-heading">Record Expenditure Entry</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Campaign</label>
                <select
                  value={newExpense.campaignId}
                  onChange={(e) => setNewExpense({ ...newExpense, campaignId: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  required
                >
                  {campaigns.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Expense Title / Item</label>
                <input
                  type="text"
                  required
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. 12 Submersible Solar Pumps"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. 45000"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Budget Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option>Equipment & Materials</option>
                    <option>Beneficiary Aid & Supplies</option>
                    <option>Logistics & Transport</option>
                    <option>Personnel & Field Honorarium</option>
                    <option>Permits, Tests & Operations</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Vendor Name</label>
                <input
                  type="text"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. Apex Solar Tech Jaipur"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                Log Expense & Update Fund Tracker
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MILESTONE */}
      {isAddMilestoneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-heading">Add Phased Milestone</h3>
              <button onClick={() => setIsAddMilestoneOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddMilestone} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. Village Ground Testing & Borewell Drilling"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Budget (INR)</label>
                  <input
                    type="number"
                    value={newMilestone.targetBudget}
                    onChange={(e) => setNewMilestone({ ...newMilestone, targetBudget: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. 80000"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Planned Completion Date</label>
                  <input
                    type="date"
                    required
                    value={newMilestone.plannedCompletionDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, plannedCompletionDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                Add Milestone to Campaign
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST UPDATE */}
      {isPublishUpdateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 font-heading">Post Field Progress Story</h3>
              <button onClick={() => setIsPublishUpdateOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handlePublishUpdate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Campaign</label>
                <select
                  value={newUpdate.campaignId}
                  onChange={(e) => setNewUpdate({ ...newUpdate, campaignId: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  required
                >
                  {campaigns.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Update Headline</label>
                <input
                  type="text"
                  required
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="e.g. Solar Plant #4 Active in Gudamalani"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Narrative Content</label>
                <textarea
                  rows={3}
                  required
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                  placeholder="Detail the milestone reached, field challenges, and beneficiary feedback..."
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Outcome Metric Label</label>
                  <input
                    type="text"
                    value={newUpdate.metricLabel}
                    onChange={(e) => setNewUpdate({ ...newUpdate, metricLabel: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. People Provided Clean Water"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Metric Number</label>
                  <input
                    type="number"
                    value={newUpdate.metricValue}
                    onChange={(e) => setNewUpdate({ ...newUpdate, metricValue: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition"
              >
                Publish Progress Update to Donors
              </button>
            </form>
          </div>
        </div>
      )}
    </ImpactBridgeLayout>
  );
};
