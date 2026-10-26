import React, { useState } from 'react';
import { ImpactBridgeLayout } from '../components/layout/ImpactBridgeLayout';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.donor@example.com',
    memberId: 'IB-2026-9482',
    role: (user?.role || 'DONOR').toUpperCase(),
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    panNumber: 'ABCDE1234F',
    status: 'ACTIVE & VERIFIED',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess('Profile details saved successfully!');
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordNotice('');
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill out all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    // Success
    setPasswordNotice('Password changed securely!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordNotice(''), 4000);
  };

  return (
    <ImpactBridgeLayout title="Profile">
      <div className="space-y-8 max-w-5xl">
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* TOP PROFILE CARD (Matching Image 3) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 space-y-6">
          {/* Avatar and Name Header */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f1f5f9] flex items-center justify-center text-slate-700 shadow-inner">
              <User className="w-9 h-9 sm:w-11 sm:h-11 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  {profileData.name}
                </h2>
                <span className="bg-emerald-50 text-emerald-700 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {profileData.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {profileData.email}
              </p>
            </div>
          </div>

          {/* 2-Column Info Grid */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Member ID */}
              <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Member / Registration ID
                </span>
                <span className="text-sm font-bold text-slate-800 font-mono">
                  {profileData.memberId}
                </span>
              </div>

              {/* Role */}
              <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Platform Role
                </span>
                <span className="text-sm font-bold text-[#2563eb]">
                  {profileData.role}
                </span>
              </div>

              {/* Phone */}
              <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Phone
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm font-bold text-slate-800">
                    {profileData.phone}
                  </span>
                )}
              </div>

              {/* Location */}
              <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Location / Region
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({ ...profileData, location: e.target.value })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm font-bold text-slate-800">
                    {profileData.location}
                  </span>
                )}
              </div>

              {/* PAN Number for 80G Tax Deductions */}
              <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  PAN / Tax ID (80G Receipts)
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.panNumber}
                    onChange={(e) =>
                      setProfileData({ ...profileData, panNumber: e.target.value })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-sm font-bold text-slate-800 font-mono">
                    {profileData.panNumber}
                  </span>
                )}
              </div>

              {/* Verification Status */}
              <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Verification Status
                </span>
                <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>KYC & Platform Verified</span>
                </span>
              </div>
            </div>

            {/* Profile Photo File Upload */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                className="text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>

            {/* Action Button: Edit / Save */}
            <div>
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-sm cursor-pointer active:scale-99"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>

        {/* CHANGE PASSWORD CARD (Matching Image 3) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Change Password
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your account password securely.
            </p>
          </div>

          {passwordNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordNotice}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-xs cursor-pointer active:scale-95 text-xs sm:text-sm"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </ImpactBridgeLayout>
  );
};
