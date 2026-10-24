import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Clock,
  CheckCircle,
  FileText,
  Calendar,
  Sparkles,
  MapPin,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const VolunteerDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ totalApplications: 0, confirmedActivities: 0, confirmedHours: 0 });
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await apiFetch('/volunteers/my-applications');
        if (data.success) {
          setApplications(data.applications || []);
          setStats(data.stats);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Completed & Confirmed</span>;
      case 'approved':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Approved by NGO</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Not Selected</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Under Review</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Volunteer Header & Portfolio Summary */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{user?.name}</h1>
                <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  Volunteer Portfolio
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-md">{user?.bio || 'Certified changemaker & field volunteer'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(user?.skills || []).map((skill, i) => (
              <span key={i} className="bg-white/10 text-purple-200 text-xs px-2.5 py-1 rounded-lg border border-white/10 font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Portfolio Stats Counter */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10 text-center">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Confirmed Service Hours</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono mt-1 block">
              {stats.confirmedHours || user?.hoursVolunteered || 0} hrs
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Completed Initiatives</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">
              {stats.confirmedActivities}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Issued Certificates</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono mt-1 block">
              {applications.filter((a) => a.certificateIssued).length}
            </span>
          </div>
        </div>
      </div>

      {/* Applications & Confirmed Records */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          My Applications & Confirmed Hours
        </h2>

        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
            <p className="text-slate-500 text-sm">You haven't submitted any volunteer applications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(app.status)}
                    <span className="text-xs text-slate-400">
                      Applied on {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    {app.opportunity?.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Organization: <strong className="text-slate-800">{app.organization?.name}</strong> •{' '}
                    {app.opportunity?.locationType}
                  </p>

                  {app.feedbackFromNGO && (
                    <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-xs text-purple-800 font-medium">
                      <strong>NGO Feedback:</strong> "{app.feedbackFromNGO}"
                    </div>
                  )}
                </div>

                {/* Hours & Certificate Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {app.attendanceConfirmed && (
                    <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-center">
                      <span className="text-[10px] text-emerald-800 font-semibold block">Confirmed Service</span>
                      <span className="text-sm font-extrabold text-emerald-700 font-mono">
                        {app.hoursLogged} Hours
                      </span>
                    </div>
                  )}

                  {app.certificateIssued ? (
                    <button
                      onClick={() =>
                        setSelectedCert({
                          volunteerName: user?.name,
                          organizationName: app.organization?.name,
                          opportunityTitle: app.opportunity?.title,
                          hours: app.hoursLogged,
                          date: app.confirmedAt || app.updatedAt,
                        })
                      }
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Award className="w-4 h-4" />
                      <span>View Service Certificate</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Certificate pending completion</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 text-center space-y-6 relative">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            >
              ✕
            </button>

            <div className="border-4 border-double border-purple-200 p-8 rounded-2xl bg-gradient-to-b from-purple-50/40 to-white space-y-4">
              <Award className="w-12 h-12 text-purple-700 mx-auto" />
              <span className="text-xs font-bold text-purple-800 uppercase tracking-widest block">
                Certificate of Community Service
              </span>
              <p className="text-xs text-slate-500">This official document is proudly awarded to</p>
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading underline decoration-purple-500">
                {selectedCert.volunteerName}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                In recognition of exceptional dedication and completion of{' '}
                <strong className="text-purple-900 font-bold">{selectedCert.hours} confirmed hours</strong> of
                service in "{selectedCert.opportunityTitle}" under{' '}
                <strong className="text-slate-900">{selectedCert.organizationName}</strong>.
              </p>

              <div className="pt-6 flex items-center justify-between border-t border-slate-200 text-left text-xs text-slate-500">
                <div>
                  <span className="block font-semibold text-slate-800">Date Issued</span>
                  <span>{new Date(selectedCert.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="block font-serif italic text-slate-800 font-bold">Authorized Seal</span>
                  <span>ImpactBridge Service Registry</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Certificate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
