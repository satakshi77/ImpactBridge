import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { ShieldCheck, MapPin, ExternalLink, Award, ArrowRight } from 'lucide-react';

export const NgosPage = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const data = await apiFetch('/ngos');
        if (data.success) {
          setNgos(data.organizations || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
          Accredited Non-Profit Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Verified Organizations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          All organizations submit government trust registrations, 80G tax certificates, and verified bank
          mandates before launching public fundraising campaigns.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 h-80 border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ngos.map((org) => (
            <Link
              key={org._id}
              to={`/ngos/${org._id}`}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition"
                  />
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      org.verificationStatus === 'verified'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="capitalize">{org.verificationStatus}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition font-heading">
                  {org.name}
                </h3>
                <p className="text-xs font-medium text-emerald-600 mt-0.5">{org.tagline}</p>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {org.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {(org.causeAreas || []).map((cause, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                      {cause}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {org.address?.city || 'Delhi'}
                </span>
                <span className="font-bold text-slate-800">
                  ₹{Number(org.totalRaised || 0).toLocaleString('en-IN')} Raised
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
