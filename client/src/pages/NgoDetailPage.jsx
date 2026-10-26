import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import { apiFetch } from '../utils/api';
import { ShieldCheck, MapPin, Mail, Phone, FileText, Heart, Users, ArrowLeft } from 'lucide-react';

export const NgoDetailPage = () => {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const data = await apiFetch(`/ngos/${id}`);
        if (data.success) {
          setOrg(data.organization);
          setCampaigns(data.campaigns || []);
          setOpportunities(data.opportunities || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Organization not found</h2>
        <Link to="/ngos" className="text-emerald-600 hover:underline text-sm mt-2 inline-block">
          Return to directory
        </Link>
      </div>
    );
  }

  return (
    <ImpactBridgeLayout title="Organization Profile">
      <div>
        <Link to="/ngos" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to verified NGOs</span>
        </Link>
      </div>

      {/* Banner & Profile Info */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
        <div className="h-48 sm:h-64 w-full bg-slate-900 relative">
          <img
            src={org.bannerImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'}
            alt={org.name}
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <div className="p-6 sm:p-8 relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <img
              src={org.logo}
              alt={org.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">{org.name}</h1>
                {org.verificationStatus === 'verified' && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-emerald-700 font-medium">{org.tagline}</p>
              <p className="text-xs text-slate-500">
                Reg No: <span className="font-mono font-semibold text-slate-700">{org.registrationNumber}</span> • Section 80G Tax-Exempt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-emerald-600" />
              {org.address?.city}, {org.address?.country}
            </span>
          </div>
        </div>

        {/* Narrative & Metrics */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-heading">Mission & Background</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{org.description}</p>
          </div>

          {/* Verification Documents Submitted */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Audited Compliance Records
            </h4>
            <div className="space-y-2 text-xs">
              {(org.verificationDocuments || []).map((doc, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[170px]">{doc.title}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
          <Heart className="w-6 h-6 text-emerald-600" />
          <span>Active Fundraising Campaigns ({campaigns.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <Link
              key={camp._id}
              to={`/campaigns/${camp._id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-lg transition space-y-3"
            >
              <img src={camp.coverImage} alt={camp.title} className="w-full h-40 object-cover rounded-xl" />
              <h4 className="text-sm font-bold text-slate-900 font-heading line-clamp-2">{camp.title}</h4>
              <div className="text-xs font-semibold text-slate-600 flex justify-between">
                <span>₹{Number(camp.fundsRaised).toLocaleString('en-IN')} Raised</span>
                <span className="text-emerald-600">{camp.percentFunded}%</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ImpactBridgeLayout>
  );
};
