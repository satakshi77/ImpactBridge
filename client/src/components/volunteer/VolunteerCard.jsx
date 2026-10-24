import React from 'react';
import { Users, MapPin, Calendar, Clock, Sparkles, ShieldCheck, CheckCircle } from 'lucide-react';

export const VolunteerCard = ({ opportunity, onApply, hasApplied }) => {
  const {
    _id,
    title,
    organization,
    causeArea,
    requiredSkills = [],
    locationType,
    location,
    startDate,
    timeCommitment,
    availableSlots = 10,
    filledSlots = 0,
    coverImage,
    matchScore,
    matchReasons = [],
  } = opportunity;

  const slotsLeft = Math.max(0, availableSlots - filledSlots);
  const fillPercent = Math.min(Math.round((filledSlots / availableSlots) * 100), 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Cover Image & Badges */}
      <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
        <img
          src={coverImage || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

        {/* Cause Area Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
          {causeArea}
        </span>

        {/* Smart Match Score Badge (Differentiator!) */}
        {matchScore !== undefined && (
          <div
            className="absolute top-3 right-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-white/20 group/tooltip"
            title={matchReasons.join(' • ')}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matchScore}% Match</span>
          </div>
        )}

        {/* Location & Time Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {locationType === 'Remote' ? 'Remote / Online' : location?.city || 'New Delhi'}
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            {timeCommitment}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Org details */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={organization?.logo || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=100&q=80'}
              alt={organization?.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs font-semibold text-slate-600 truncate">{organization?.name}</span>
            {organization?.verificationStatus === 'verified' && (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified NGO" />
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition font-heading line-clamp-2">
            {title}
          </h3>

          {/* Match Explanation Tag (if volunteer) */}
          {matchReasons && matchReasons.length > 0 && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 mt-2 line-clamp-1 font-medium">
              ✓ {matchReasons[0]}
            </p>
          )}

          {/* Required Skills tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {requiredSkills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {requiredSkills.length > 4 && (
              <span className="text-[10px] text-slate-400 self-center">+{requiredSkills.length - 4} more</span>
            )}
          </div>
        </div>

        {/* Slots & Apply Button */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div>
            <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
              <span>Slots Filled: {filledSlots} / {availableSlots}</span>
              <span className={slotsLeft <= 3 ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                {slotsLeft > 0 ? `${slotsLeft} slots remaining` : 'Full'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => onApply(opportunity)}
            disabled={hasApplied || slotsLeft === 0}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              hasApplied
                ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                : slotsLeft === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md shadow-emerald-600/20'
            }`}
          >
            {hasApplied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Applied Successfully</span>
              </>
            ) : slotsLeft === 0 ? (
              <span>Opportunity Filled</span>
            ) : (
              <>
                <span>Apply for Opportunity</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
