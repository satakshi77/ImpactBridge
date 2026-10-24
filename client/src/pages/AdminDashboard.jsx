import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {toast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in">
          <span className="font-semibold text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-200" /> {toast}
          </span>
          <button onClick={() => setToast('')} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Platform Governance Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {user?.name || 'Platform Administrator'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            ImpactBridge Trust & Safety • Full Audited Control Over Verifications and Campaigns
          </p>
        </div>

        {/* Overview Numbers */}
        <div className="grid grid-cols-2 gap-3 text-center min-w-[240px]">
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block">Pending Verifications</span>
            <span className="text-xl font-bold text-amber-400 font-mono">
              {stats?.pendingVerifications || 0}
            </span>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block">Total Funds Raised</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">
              ₹{Number(stats?.totalRaised || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: NGO Verification Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>NGO Accreditation & Verification Requests</span>
          </h2>
          <span className="text-xs text-slate-500">{verifications.length} organizations reviewed</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Organization Name</th>
                  <th className="py-3 px-4">Reg Number</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {verifications.map((org) => (
                  <tr key={org._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {org.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{org.contactEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{org.registrationNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600">{org.address?.city || 'Delhi'}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {org.verificationDocuments?.length || 0} Docs
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          org.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {org.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleReviewNgo(org._id, 'verified')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Approve 80G
                        </button>
                        <button
                          onClick={() => handleReviewNgo(org._id, 'rejected')}
                          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 2: Audit Logs Trail */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          <span>System Audit Trail & Governance Log</span>
        </h2>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin Action</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">{log.action}</td>
                    <td className="py-3 px-4 text-slate-800 font-semibold">{log.performedBy?.name || 'Administrator'}</td>
                    <td className="py-3 px-4 text-slate-600">{log.targetType}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
