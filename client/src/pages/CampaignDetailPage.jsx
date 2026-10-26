import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ImpactTracker } from '../components/impact/ImpactTracker';
import { DonationModal } from '../components/donation/DonationModal';
import { ReceiptModal } from '../components/donation/ReceiptModal';
import {
  Heart,
  Share2,
  Bookmark,
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const CampaignDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [impactTrackerData, setImpactTrackerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [donorContribution, setDonorContribution] = useState(null);

  const fetchCampaign = async () => {
    try {
      const data = await apiFetch(`/campaigns/${id}`);
      if (data.success) {
        setCampaign(data.campaign);
        setImpactTrackerData(data.impactTracker);

        // Check if current user has supported this project
        if (user && data.impactTracker?.recentDonations) {
          const myDonation = data.impactTracker.recentDonations.find(
            (d) => d.donorName === user.name
          );
          if (myDonation) {
            setDonorContribution({
              amount: myDonation.amount,
              date: myDonation.createdAt,
              milestonesAchievedSince: 2,
            });
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id, user]);

  const handleDonationSuccess = (donation, receipt) => {
    setActiveReceipt(receipt);
    setIsReceiptOpen(true);
    fetchCampaign(); // Refresh tracker data live!
  };

  const handleToggleSave = async () => {
    if (!user) return;
    try {
      const data = await apiFetch(`/campaigns/${id}/save`, { method: 'POST' });
      if (data.success) {
        setIsSaved(data.saved);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Campaign not found</h2>
        <Link to="/campaigns" className="text-emerald-600 hover:underline text-sm mt-2 inline-block">
          Return to campaigns
        </Link>
      </div>
    );
  }

  return (
    <ImpactBridgeLayout title="Campaign Overview">
      {/* Back button */}
      <div>
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all campaigns</span>
        </Link>
      </div>

      {/* Main Campaign Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Visual & Narrative */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl overflow-hidden bg-slate-100 shadow-md border border-slate-200/80 relative">
            <img
              src={campaign.coverImage}
              alt={campaign.title}
              className="w-full h-[380px] sm:h-[460px] object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3.5 py-1 rounded-full shadow-xs">
                {campaign.causeArea}
              </span>
              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified NGO
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading leading-tight">
              {campaign.title}
            </h1>

            {/* NGO Org Bar */}
            <div className="flex items-center justify-between py-4 border-b border-slate-200 mt-4">
              <Link
                to={`/ngos/${campaign.organization?._id}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={campaign.organization?.logo}
                  alt={campaign.organization?.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Organized by</span>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition flex items-center gap-1">
                    {campaign.organization?.name}
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSave}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Bookmark campaign"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Campaign Narrative Story */}
            <div className="pt-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-heading">About this Initiative</h3>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
                {campaign.story}
              </div>

              {/* Beneficiary Highlight */}
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Target Beneficiary Group
                  </span>
                  <p className="text-xs font-semibold text-slate-800">{campaign.beneficiaryGroup}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Sticky Donation Card */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total Funds Raised
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                  ₹{Number(campaign.fundsRaised).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  of ₹{Number(campaign.fundingTarget).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>{campaign.donorCount} Supporters</span>
                  <span className="text-emerald-600 font-bold">{campaign.percentFunded}% reached</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(campaign.percentFunded, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Location & Deadline */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {campaign.location?.city}, {campaign.location?.state}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Deadline</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {new Date(campaign.deadline).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Donate CTA */}
            <button
              onClick={() => setIsDonateOpen(true)}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Contribute to this Project</span>
            </button>

            <div className="text-center text-[11px] text-slate-400 space-y-1">
              <p>✓ Instant 80G tax receipt issued upon completion</p>
              <p>✓ Real-time milestone updates emailed to your inbox</p>
            </div>
          </div>
        </div>
      </div>

      {/* SIGNATURE PROJECT IMPACT TRACKER COMPONENT */}
      <section className="pt-6">
        <ImpactTracker impactData={impactTrackerData} donorContribution={donorContribution} />
      </section>

      {/* Donation Modal */}
      <DonationModal
        campaign={campaign}
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onSuccess={handleDonationSuccess}
      />

      {/* 80G Receipt Modal */}
      <ReceiptModal
        receipt={activeReceipt}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </ImpactBridgeLayout>
  );
};
