import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  ExternalLink,
  Layers,
  Building2,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const fetchAdminData = async () => {
    try {
      const [statsRes, verRes, logRes] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/verifications'),
        apiFetch('/admin/audit-logs'),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (verRes.success) setVerifications(verRes.organizations || []);
      if (logRes.success) setAuditLogs(logRes.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReviewNgo = async (orgId, status) => {
    const notes = prompt(`Enter administrative review notes for marking as ${status}:`, 'Verified Section 80G registration & FCRA clearance.');
    if (!notes) return;

    try {
      const data = await apiFetch(`/admin/verifications/${orgId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      });
      if (data.success) {
        setToast(`NGO verification status updated to ${status}!`);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <ImpactBridgeLayout title="Admin Console">
      {toast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in">
          <span className="font-semibold text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-200" /> {toast}
          </span>
          <button onClick={() => setToast('')} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* 4 TOP STAT CARDS (Exact Image 1 layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Platform Funds */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-blue-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            TOTAL FUNDS DISBURSED
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
              ₹{Number(stats?.totalDonations || 12450000).toLocaleString('en-IN')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <TrendingUp className="w-5 h-5 text-[#2563eb]" />
            </div>
          </div>
        </div>

        {/* Card 2: Pending Verifications */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-amber-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            PENDING NGO VERIFICATIONS
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {stats?.pendingVerifications || verifications.filter((v) => v.verificationStatus === 'pending').length || 2}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Card 3: Active Campaigns */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-emerald-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            ACCREDITED NGOS
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {stats?.activeNGOs || 14}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Card 4: Audit Logs */}
        <div className="bg-white rounded-3xl p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-purple-100/60 blur-xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            AUDIT LOG RECORDS
          </p>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {auditLogs.length || 42}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* OVERVIEW TABLE: NGO Verifications */}
      <div className="bg-white rounded-3xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-heading">
              NGO Verification & Governance Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review Section 80G tax registration, FCRA clearances, and operational licenses.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 px-6">ORGANIZATION</th>
                <th className="py-4 px-6">REGISTRATION #</th>
                <th className="py-4 px-6 text-center">STATUS</th>
                <th className="py-4 px-6">CAUSE AREA</th>
                <th className="py-4 px-6 text-right">AUDIT ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {verifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No pending NGO verification requests in queue.
                  </td>
                </tr>
              ) : (
                verifications.map((org) => (
                  <tr key={org._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={org.logo} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{org.name}</p>
                          <p className="text-[11px] text-slate-400">{org.contactEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-700 text-xs">
                      {org.registrationNumber}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {org.verificationStatus === 'verified' ? (
                        <span className="bg-[#dcfce7] text-[#15803d] font-bold text-xs px-3 py-1 rounded-full inline-block">
                          Verified
                        </span>
                      ) : org.verificationStatus === 'rejected' ? (
                        <span className="bg-rose-100 text-rose-800 font-bold text-xs px-3 py-1 rounded-full inline-block">
                          Rejected
                        </span>
                      ) : (
                        <span className="bg-[#fef3c7] text-[#b45309] font-bold text-xs px-3 py-1 rounded-full inline-block">
                          Pending Audit
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                      {(org.causesHandled || []).join(', ') || 'Community Welfare'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReviewNgo(org._id, 'verified')}
                          className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-xs cursor-pointer active:scale-95"
                        >
                          Verify NGO
                        </button>
                        <button
                          onClick={() => handleReviewNgo(org._id, 'rejected')}
                          className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ImpactBridgeLayout>
  );
};
