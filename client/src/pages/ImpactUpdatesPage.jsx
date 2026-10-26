import React, { useState } from 'react';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import {
  Megaphone,
  User,
  Calendar,
  Plus,
  X,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const ImpactUpdatesPage = () => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([
    {
      id: 1,
      title: 'Solar Water Filtration Unit Installation Completed in Sundarbans',
      date: '24/10/2026',
      author: 'GreenEarth Foundation • Field Team',
      campaign: 'Sundarbans Clean Drinking Water Project',
      content: 'Phase 1 milestones are now 100% complete! The solar-powered RO unit is operational and supplying 5,000 liters of purified drinking water daily to 350 families. Sensor telemetry is live on the impact map.',
    },
    {
      id: 2,
      title: 'Science Lab Equipment & Tablets Delivered to Rural Maharashtra Schools',
      date: '18/10/2026',
      author: 'Asha Vidya Foundation • Project Lead',
      campaign: 'Digital Classrooms for 10 Rural Schools',
      content: 'Inspection and delivery completed for all 10 schools in Satara district. 620 students have commenced digital interactive STEM modules. Verified receipts have been uploaded to the financial ledger.',
    },
    {
      id: 3,
      title: 'Emergency Flood Relief Supplies Distribution & Medical Camp Notice',
      date: '13/08/2026',
      author: 'ImpactBridge Disaster Response Team',
      campaign: 'Assam Flood Emergency Relief & Medical Aid',
      content: 'Emergency ration kits, water purification tablets, and mobile healthcare teams were deployed across 4 relief camps in Majuli. Over 1,200 displaced individuals supported this week.',
    },
    {
      id: 4,
      title: 'Annual Audited Financial Transparency Report Published',
      date: '10/08/2026',
      author: 'Platform Governance & Audit Council',
      campaign: 'ImpactBridge Platform Governance',
      content: '100% of donor contributions were traced to vendor invoices and milestone deliveries. Zero platform commission retained on emergency medical campaigns.',
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCampaign, setNewCampaign] = useState('');

  const handlePostUpdate = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const newUpdateObj = {
      id: Date.now(),
      title: newTitle,
      date: formattedDate,
      author: `${user?.name || 'NGO Coordinator'} • Verification Team`,
      campaign: newCampaign || 'General Project Milestone',
      content: newContent,
    };

    setUpdates([newUpdateObj, ...updates]);
    setNewTitle('');
    setNewContent('');
    setNewCampaign('');
    setModalOpen(false);
  };

  return (
    <ImpactBridgeLayout title="Impact Updates">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Real-time on-ground milestone dispatches, official NGO notices, and verified field reports.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Post Impact Update</span>
        </button>
      </div>

      {/* Updates / Notices List (Matching Image 2) */}
      <div className="space-y-4">
        {updates.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] space-y-3"
          >
            {/* Header: Title and Date on right */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-heading">
                {item.title}
              </h2>
              <span className="text-xs font-semibold text-slate-400 shrink-0 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {item.date}
              </span>
            </div>

            {/* Author Line with user icon and campaign badge */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 text-slate-700">
                <User className="w-4 h-4 text-blue-600" />
                <span>{item.author}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-[#2563eb] bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">
                {item.campaign}
              </span>
            </div>

            {/* Description Body */}
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {item.content}
            </p>
          </div>
        ))}
      </div>

      {/* Modal to Post New Impact Update */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Publish Project Impact Update
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Update Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phase 2 Water Pipeline Tested & Approved"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Associated Campaign / Initiative
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sundarbans Clean Drinking Water"
                  value={newCampaign}
                  onChange={(e) => setNewCampaign(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Milestone Details & Proof of Work
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe on-ground progress, beneficiaries impacted, and milestone completion..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                >
                  Publish Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ImpactBridgeLayout>
  );
};
