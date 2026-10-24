import React, { useState } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { X, CheckCircle, Sparkles, Send } from 'lucide-react';

export const ApplyModal = ({ opportunity, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [motivation, setMotivation] = useState('');
  const [availabilityNote, setAvailabilityNote] = useState(
    user?.availability ? `Available on ${user.availability}` : 'Available on weekends'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivation.trim()) {
      setError('Please provide a brief statement of interest');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/volunteers/apply', {
        method: 'POST',
        body: JSON.stringify({
          opportunityId: opportunity._id,
          motivation,
          skillsOffered: user?.skills || opportunity.requiredSkills || [],
          availabilityNote,
        }),
      });

      if (data.success) {
        if (onSuccess) onSuccess(data.application);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Application submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-purple-100 uppercase tracking-wider">
              Volunteer Application
            </span>
          </div>
          <h3 className="text-xl font-bold font-heading line-clamp-1">{opportunity.title}</h3>
          <p className="text-xs text-purple-200 mt-1">
            Organization: <span className="font-semibold text-white">{opportunity.organization?.name}</span>
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}

          {/* Opportunity Match Highlights */}
          {opportunity.matchReasons && opportunity.matchReasons.length > 0 && (
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200/80">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Smart Match Match Score: {opportunity.matchScore}%
              </span>
              <ul className="text-[11px] text-purple-700 space-y-0.5">
                {opportunity.matchReasons.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Your Availability & Schedule
            </label>
            <input
              type="text"
              value={availabilityNote}
              onChange={(e) => setAvailabilityNote(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g. Saturdays 10 AM to 2 PM, or Flexible weekdays"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Why do you want to contribute to this cause?
            </label>
            <textarea
              rows={4}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Share what excites you about this initiative and how your skills can support the team..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-purple-700 hover:bg-purple-800 text-white shadow-md shadow-purple-700/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Submitting Application...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Volunteer Application</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
