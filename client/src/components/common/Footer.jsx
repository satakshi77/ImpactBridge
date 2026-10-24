import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, MapPin, Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white font-heading">
                Impact<span className="text-emerald-400">Bridge</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Tagline: <span className="text-emerald-300 font-medium">Give with purpose. Volunteer with impact. See the change.</span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              ImpactBridge unifies NGO fundraising, skill-based volunteering, and real-time milestone expenditure tracking into one verifiable social impact ecosystem.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Accredited 80G Tax-Exempt Partner Portal</span>
            </div>
          </div>

          {/* Platform Explore */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider font-heading">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/campaigns" className="hover:text-emerald-400 transition">Explore Campaigns</Link>
              </li>
              <li>
                <Link to="/volunteers" className="hover:text-emerald-400 transition">Volunteer Matching</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-emerald-400 transition">Community Impact Map</Link>
              </li>
              <li>
                <Link to="/ngos" className="hover:text-emerald-400 transition">Verified Organizations</Link>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider font-heading">For Changemakers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/donor/dashboard" className="hover:text-emerald-400 transition">Donor Impact Hub</Link>
              </li>
              <li>
                <Link to="/volunteer/dashboard" className="hover:text-emerald-400 transition">Volunteer Portfolio</Link>
              </li>
              <li>
                <Link to="/ngo/dashboard" className="hover:text-emerald-400 transition">NGO Campaign Portal</Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-emerald-400 transition">Platform Governance</Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider font-heading">Transparency</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All financial reports distinguish self-declared NGO expenditures from third-party audited statements.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@impactbridge.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>New Delhi • Mumbai • Bengaluru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ImpactBridge Social Foundation. Built with MERN Stack.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Controls</span>
            <span>Terms of Service</span>
            <span>Audit Trail Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
