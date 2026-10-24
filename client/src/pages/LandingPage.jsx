import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Globe,
  Sparkles,
  ArrowRight,
  Heart,
  CheckCircle2,
  PieChart,
  Eye,
  Award,
  Layers,
} from 'lucide-react';

export const LandingPage = () => {
  const [stats, setStats] = useState(null);
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [urgentOpps, setUrgentOpps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await apiFetch('/stats/overview');
        if (data.success) {
          setStats(data.stats);
          setFeaturedCampaigns(data.featuredCampaigns || []);
          setUrgentOpps(data.urgentOpportunities || []);
        }
      } catch (e) {
        console.error('Failed to load platform stats', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/50 via-teal-200/40 to-cyan-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-800 text-xs sm:text-sm font-bold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tagline: Give with purpose. Volunteer with impact. See the change.</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 font-heading max-w-4xl mx-auto leading-[1.12]">
            Connecting Donors & Volunteers to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              Verifiable Outcomes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ImpactBridge replaces generic charity newsletters with our signature{' '}
            <strong className="text-slate-900 font-semibold">Project Impact Tracker</strong>. Follow the exact
            milestones, invoices, photos, and volunteer hours your generosity makes possible.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/campaigns"
              className="px-8 py-4 rounded-2xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Explore Verified Campaigns</span>
            </Link>
            <Link
              to="/volunteers"
              className="px-8 py-4 rounded-2xl text-base font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-md transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Smart Volunteer Hub</span>
            </Link>
          </div>

          {/* Live Platform Impact Stats Bar */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading block">
                  ₹{stats ? (stats.totalRaised || 1165000).toLocaleString('en-IN') : '11,65,000+'}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
                  Verified Funds Raised
                </span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-teal-600 font-heading block">
                  {stats ? (stats.beneficiariesImpacted || 45200).toLocaleString('en-IN') : '45,200+'}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
                  Beneficiaries Impacted
                </span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-purple-600 font-heading block">
                  {stats ? stats.totalVolunteerHours || 240 : '240+'} hrs
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
                  Confirmed Volunteer Service
                </span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-500 font-heading block">
                  100%
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
                  Milestone-Backed Reporting
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE DIFFERENTIATOR SHOWCASE: THE IMPACT TRACKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Signature Innovation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
                Donors don't just give. <br />
                <span className="text-emerald-400">They watch the change unfold.</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Traditional platforms stop at the donation confirmation page. ImpactBridge introduces a
                dedicated timeline for every project where donors track:
              </p>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white">Milestone Verification:</strong> Phased execution goals with
                    measurable targets and on-site photo proofs.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 shrink-0 mt-0.5">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white">Transparent Fund Utilization:</strong> Planned budget
                    allocations versus actual spending with attached vendor vouchers.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white">Personal Impact Portfolio:</strong> A unified summary of
                    milestones reached since your specific donation was made.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/campaigns"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 group"
                >
                  <span>Explore live campaign impact timelines</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>

            {/* Visual Mockup Card (matching Reference Image 2 & 4) */}
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Barmer Clean Water Project</h4>
                    <span className="text-[11px] text-emerald-400 font-medium">● 8 of 12 Solar Plants Installed</span>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold">
                  78% Funded
                </span>
              </div>

              {/* Sample Progress Bars */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Funds Raised: ₹6,20,000</span>
                    <span className="text-emerald-400 font-bold">78%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Milestones Completed (2 of 4)</span>
                    <span className="text-teal-400 font-bold">50%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full w-[50%]" />
                  </div>
                </div>
              </div>

              {/* Sample Milestone Item with Photo */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=200&q=80"
                  alt="Field Evidence"
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="text-xs">
                  <span className="text-emerald-400 font-semibold block text-[10px]">VERIFIED EVIDENCE • OCT 2026</span>
                  <p className="font-bold text-white text-xs line-clamp-1">Solar Plant #8 Active in Dhorimanna</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">Laboratory TDS test verified: 110 ppm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CAMPAIGNS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Active Campaigns
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
              Support High-Impact Community Projects
            </h2>
          </div>
          <Link
            to="/campaigns"
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View All Campaigns</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCampaigns.map((camp) => (
            <Link
              key={camp._id}
              to={`/campaigns/${camp._id}`}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  src={camp.coverImage}
                  alt={camp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {camp.causeArea}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  {camp.location?.city}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={camp.organization?.logo}
                      alt={camp.organization?.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-600 truncate">{camp.organization?.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition font-heading line-clamp-2">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {camp.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 font-mono font-bold">
                      ₹{camp.fundsRaised?.toLocaleString('en-IN')}{' '}
                      <span className="text-slate-400 font-normal">of ₹{camp.fundingTarget?.toLocaleString('en-IN')}</span>
                    </span>
                    <span className="text-emerald-600 font-bold">{camp.percentFunded}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${Math.min(camp.percentFunded, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IMPACTBRIDGE WORKS: 5-STEP LIFECYCLE */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Transparent Social Impact Ecosystem
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
              How the Complete Platform Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              A continuous feedback loop connecting resources, volunteer service, and audited outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mx-auto">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">NGO Creates Project</h4>
              <p className="text-xs text-slate-500">Defines goals, milestone budgets, and volunteer skill needs.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mx-auto">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">Donor Contributes</h4>
              <p className="text-xs text-slate-500">Funds the campaign and follows its growth in their personal hub.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mx-auto">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">Volunteer Joins</h4>
              <p className="text-xs text-slate-500">Matches skills, attends field events, and earns confirmed hours.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mx-auto">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-900 font-heading">NGO Reports Progress</h4>
              <p className="text-xs text-slate-500">Publishes milestone achievements, receipts, and field photographs.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-md space-y-3 ring-2 ring-emerald-500/20">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mx-auto">
                5
              </div>
              <h4 className="text-sm font-bold text-emerald-900 font-heading">See the Change</h4>
              <p className="text-xs text-emerald-700 font-medium">Impact Tracker closes the loop with verifiable results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY IMPACT MAP & VOLUNTEER MATCHING TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Map Teaser */}
          <div className="bg-gradient-to-tr from-teal-900 to-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="text-xs font-bold bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Interactive Map
              </span>
              <h3 className="text-2xl font-bold font-heading">Community Impact Map</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                Explore real projects and volunteering drives across Delhi, Mumbai, Bengaluru, and Rajasthan on
                an interactive geocoded map.
              </p>
            </div>
            <div className="pt-8 relative z-10">
              <Link
                to="/map"
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition"
              >
                <span>Launch Interactive Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Volunteer Matching Teaser */}
          <div className="bg-gradient-to-tr from-purple-900 to-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="text-xs font-bold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Rule-Based Engine
              </span>
              <h3 className="text-2xl font-bold font-heading">Smart Volunteer Matching</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                We pair your skills (Teaching, Web Dev, First Aid, Media) and availability with vetted NGOs,
                explaining exactly why an opportunity is right for you.
              </p>
            </div>
            <div className="pt-8 relative z-10">
              <Link
                to="/volunteers"
                className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition"
              >
                <span>Find Your Match</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
