import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import { ShieldCheck, MapPin, ExternalLink, Award, ArrowRight, Building2 } from 'lucide-react';

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
    <ImpactBridgeLayout title="Verified NGOs">
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80">
        <h2 className="text-base font-bold text-slate-900 font-heading">
          Accredited Non-Profit Directory
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          All organizations submit government trust registrations, 80G tax certificates, and verified bank mandates.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 h-80 border border-slate-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ngos.map((org) => (
            <Link
              key={org._id}
              to={`/ngos/${org._id}`}
              className="bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-xs group-hover:scale-105 transition"
                  />
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> 80G Verified
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-heading group-hover:text-blue-600 transition-colors">
                  {org.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {org.mission}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(org.causesHandled || []).map((cause, i) => (
                    <span
                      key={i}
                      className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {cause}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-bold text-[#2563eb]">
                <span>View Organization Profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </ImpactBridgeLayout>
  );
};
