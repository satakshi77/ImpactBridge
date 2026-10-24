import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Image,
  DollarSign,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Tag,
  ChevronRight,
  Info,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

export const ImpactTracker = ({ impactData, donorContribution }) => {
  const [activeTab, setActiveTab] = useState('milestones'); // 'milestones' | 'finances' | 'updates'
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  if (!impactData) return null;

  const {
    fundingTarget = 0,
    fundsRaised = 0,
    percentFunded = 0,
    donorCount = 0,
    totalReportedSpent = 0,
    unspentFunds = 0,
    categoryBreakdown = [],
    milestones = [],
    expenses = [],
    updates = [],
  } = impactData;

  const completedMilestonesCount = milestones.filter((m) => m.status === 'Completed').length;
  const milestoneProgressPercent =
    milestones.length > 0 ? Math.round((completedMilestonesCount / milestones.length) * 100) : 0;

  // Colors for category chart
  const CHART_COLORS = ['#059669', '#0d9488', '#2563eb', '#8b5cf6', '#d97706', '#e11d48'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> In Progress
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Delayed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
      {/* Signature Tracker Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Signature Impact Tracker
              </span>
              <span className="text-xs text-slate-400">• Real-Time Verifiable Milestones</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Project Growth & Transparency Dashboard
            </h2>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[100px]">
              <span className="text-[11px] text-slate-300 uppercase block">Milestones</span>
              <span className="text-lg font-bold text-emerald-400">
                {completedMilestonesCount} / {milestones.length}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[100px]">
              <span className="text-[11px] text-slate-300 uppercase block">Total Donors</span>
              <span className="text-lg font-bold text-teal-300">{donorCount}</span>
            </div>
          </div>
        </div>

        {/* Dual Progress Bars: Funds & Milestones */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
          {/* Funding Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-300">
                Fundraising Goal:{' '}
                <strong className="text-white">₹{fundsRaised.toLocaleString('en-IN')}</strong> of ₹
                {fundingTarget.toLocaleString('en-IN')}
              </span>
              <span className="text-emerald-400 font-bold">{percentFunded}%</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(percentFunded, 100)}%` }}
              />
            </div>
          </div>

          {/* Milestone Execution Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-300">
                Milestones Executed:{' '}
                <strong className="text-white">{completedMilestonesCount} completed</strong> (
                {milestones.length - completedMilestonesCount} remaining)
              </span>
              <span className="text-teal-400 font-bold">{milestoneProgressPercent}%</span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(milestoneProgressPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Personalized Donor Highlight if donor supported this project */}
        {donorContribution && (
          <div className="mt-6 bg-emerald-500/15 border border-emerald-400/30 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-300">Your Support on This Project</p>
                <p className="text-sm font-bold text-white">
                  You contributed ₹{Number(donorContribution.amount).toLocaleString('en-IN')} on{' '}
                  {new Date(donorContribution.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="text-xs bg-emerald-500 text-slate-900 font-bold px-3 py-1 rounded-full">
              {donorContribution.milestonesAchievedSince || completedMilestonesCount} Milestones Reached
            </span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 sm:px-8 flex space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('milestones')}
          className={`py-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'milestones'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Milestones Timeline ({milestones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`py-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'finances'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Fund Utilization & Vouchers</span>
        </button>

        <button
          onClick={() => setActiveTab('updates')}
          className={`py-4 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'updates'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Field Evidence & Updates ({updates.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: MILESTONES TIMELINE */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Project Execution Roadmap
                </h3>
                <p className="text-xs text-slate-500">
                  Each milestone represents tangible on-ground deliverables before funds are released.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-200/80 space-y-8 mt-4">
              {milestones.map((m, index) => (
                <div key={m._id || index} className="relative group">
                  {/* Circle Indicator */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-xs font-bold ${
                      m.status === 'Completed'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : m.status === 'In Progress'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {m.status === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>

                  {/* Milestone Card */}
                  <div className="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 transition shadow-xs hover:shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                          Milestone #{m.orderIndex || index + 1}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 font-heading">{m.title}</h4>
                      </div>
                      {getStatusBadge(m.status)}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{m.description}</p>

                    {/* Measurable Target Indicator */}
                    {m.measurableTarget && m.measurableTarget.targetValue > 0 && (
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 mb-4">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5 text-slate-800">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            Target Metric: {m.measurableTarget.metric}
                          </span>
                          <span className="text-emerald-700 font-bold">
                            {m.measurableTarget.currentValue} / {m.measurableTarget.targetValue}{' '}
                            {m.measurableTarget.unit} (
                            {Math.round(
                              (m.measurableTarget.currentValue / m.measurableTarget.targetValue) * 100
                            )}
                            %)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                Math.round(
                                  (m.measurableTarget.currentValue / m.measurableTarget.targetValue) * 100
                                ),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer Info: Budget, Dates & Proof Attachments */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
                      <div className="flex flex-wrap items-center gap-4">
                        <span>
                          Allocated Budget:{' '}
                          <strong className="text-slate-800">
                            ₹{Number(m.targetBudget || 0).toLocaleString('en-IN')}
                          </strong>
                        </span>
                        <span>
                          Actual Spend:{' '}
                          <strong className="text-slate-800">
                            ₹{Number(m.actualSpend || 0).toLocaleString('en-IN')}
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Target:{' '}
                          {new Date(m.plannedCompletionDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Evidence Files Count */}
                      {m.proofEvidence && m.proofEvidence.length > 0 && (
                        <div className="flex items-center gap-2">
                          {m.proofEvidence.map((ev, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedEvidence(ev)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition cursor-pointer"
                            >
                              <FileText className="w-3 h-3 text-emerald-600" />
                              <span>{ev.title || `Evidence #${i + 1}`}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {m.latestUpdateNote && (
                      <div className="mt-3 text-xs bg-slate-100/70 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                        <strong className="text-slate-900 font-semibold">Latest Field Note:</strong>{' '}
                        {m.latestUpdateNote}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TRANSPARENT FUND UTILIZATION */}
        {activeTab === 'finances' && (
          <div className="space-y-8">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Financial Transparency Statement
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ImpactBridge promotes transparent fund utilization by publishing planned budget allocations
                against self-reported expenditures, verified invoices, and vendor receipts. We clearly label
                the verification level for each expense record.
              </p>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Funds Raised</span>
                <span className="text-2xl font-extrabold text-emerald-900 font-mono mt-1 block">
                  ₹{Number(fundsRaised).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 block">
                  {percentFunded}% of ₹{Number(fundingTarget).toLocaleString('en-IN')} target
                </span>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
                <span className="text-[11px] font-bold text-blue-800 uppercase block">Reported Expenditures</span>
                <span className="text-2xl font-extrabold text-blue-900 font-mono mt-1 block">
                  ₹{Number(totalReportedSpent).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-blue-700 mt-1 block">Backed by invoices & vendor bills</span>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 uppercase block">Remaining Unspent Funds</span>
                <span className="text-2xl font-extrabold text-amber-900 font-mono mt-1 block">
                  ₹{Number(unspentFunds).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-amber-700 mt-1 block">Reserved for upcoming milestones</span>
              </div>
            </div>

            {/* Planned vs Actual Spend Chart */}
            {categoryBreakdown.length > 0 && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 font-heading">
                  Category Breakdown: Planned Budget vs Actual Spend
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryBreakdown} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                      <XAxis dataKey="category" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip
                        formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                        contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="planned" fill="#94a3b8" name="Planned Allocation" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="spent" fill="#059669" name="Actual Spend Reported" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Expense Entries Table */}
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-3 font-heading">
                Chronological Expense Entries & Verified Receipts
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Title / Item</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Vendor</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Verification Level</th>
                        <th className="py-3 px-4 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {expenses.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-6 text-center text-slate-400">
                            No expense entries published yet for this project.
                          </td>
                        </tr>
                      ) : (
                        expenses.map((e) => (
                          <tr key={e._id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                              {new Date(e.date).toLocaleDateString('en-IN')}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-900">{e.title}</td>
                            <td className="py-3 px-4 text-slate-600">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">{e.category}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{e.vendor || 'Authorized Vendor'}</td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              ₹{Number(e.amount).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  e.verificationLevel === 'Independently Audited'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : e.verificationLevel === 'Document/Receipt Attached'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                <ShieldCheck className="w-3 h-3" />
                                {e.verificationLevel || 'Receipt Attached'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {e.receiptUrl ? (
                                <button
                                  onClick={() =>
                                    setSelectedEvidence({
                                      title: `Receipt: ${e.title}`,
                                      url: e.receiptUrl,
                                      type: 'Receipt Slip',
                                      note: `Vendor: ${e.vendor} • Amount: ₹${Number(e.amount).toLocaleString('en-IN')}`,
                                    })
                                  }
                                  className="text-emerald-600 hover:text-emerald-700 font-semibold underline text-xs cursor-pointer"
                                >
                                  View Voucher
                                </button>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FIELD EVIDENCE & UPDATES */}
        {activeTab === 'updates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Field Photography & Milestone Stories
                </h3>
                <p className="text-xs text-slate-500">
                  Direct updates from project managers and volunteers documenting physical progress.
                </p>
              </div>
            </div>

            {updates.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 text-xs">
                No photo updates published yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {updates.map((up) => (
                  <div
                    key={up._id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col"
                  >
                    {/* Photos */}
                    {up.photos && up.photos.length > 0 && (
                      <div className="h-52 w-full overflow-hidden bg-slate-100 relative group cursor-pointer">
                        <img
                          src={up.photos[0]}
                          alt={up.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onClick={() =>
                            setSelectedEvidence({
                              title: up.title,
                              url: up.photos[0],
                              type: 'Photo',
                              note: up.content,
                            })
                          }
                        />
                        <span className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                          {up.category}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] text-slate-400 mb-1">
                          {new Date(up.publishedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-2 font-heading">{up.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">{up.content}</p>

                        {/* Outcome Indicators */}
                        {up.outcomeIndicators && up.outcomeIndicators.length > 0 && (
                          <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100 mb-4 space-y-1.5">
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                              Quantifiable Project Outcomes
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {up.outcomeIndicators.map((ind, idx) => (
                                <div key={idx} className="bg-white p-2 rounded-lg border border-emerald-200/60">
                                  <span className="text-base font-bold text-emerald-700 font-mono block">
                                    {ind.value.toLocaleString()} {ind.unit}
                                  </span>
                                  <span className="text-[10px] text-slate-500 block leading-tight">{ind.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* High-Resolution Evidence / Receipt Preview Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedEvidence(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-slate-900 font-heading mb-1">{selectedEvidence.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedEvidence.type} • Verified Project Attachment</p>
            <div className="rounded-xl overflow-hidden bg-slate-100 max-h-96 flex items-center justify-center mb-4">
              <img
                src={selectedEvidence.url}
                alt={selectedEvidence.title}
                className="max-h-96 w-auto object-contain rounded-lg"
              />
            </div>
            {selectedEvidence.note && (
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {selectedEvidence.note}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
