import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { X, Heart, ShieldCheck, CheckCircle2, CreditCard, Sparkles } from 'lucide-react';

export const DonationModal = ({ campaign, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / NetBanking');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !campaign) return null;

  const presets = [500, 1000, 2500, 5000, 10000];

  const handlePresetClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount(Number(e.target.value) || 0);
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || amount < 10) {
      setError('Minimum donation is ₹10');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/donations', {
        method: 'POST',
        body: JSON.stringify({
          campaignId: campaign._id,
          amount,
          isAnonymous,
          donorMessage,
          paymentMethod: `Razorpay Sandbox (${paymentMethod})`,
          panNumber,
        }),
      });

      if (data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#f59e0b'],
        });

        if (onSuccess) onSuccess(data.donation, data.receipt);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/25 text-emerald-50 uppercase tracking-wider">
              Razorpay Sandbox Test Mode
            </span>
          </div>
          <h3 className="text-xl font-bold font-heading line-clamp-1">{campaign.title}</h3>
          <p className="text-xs text-emerald-100 mt-1">
            Organized by: <span className="font-semibold text-white">{campaign.organization?.name}</span>
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleDonate} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Contribution Amount (INR)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {presets.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handlePresetClick(val)}
                  className={`py-2 px-1 text-sm font-bold rounded-xl border transition ${
                    amount === val && !customAmount
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  ₹{val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="mt-2.5 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <input
                type="number"
                placeholder="Or enter custom amount"
                value={customAmount}
                onChange={handleCustomChange}
                className="w-full pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
              />
            </div>
          </div>

          {/* Payment Method Selector (Simulated) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Simulated Payment Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI (GPay / PhonePe)', 'Credit/Debit Card', 'NetBanking'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition ${
                    paymentMethod.includes(method.split(' ')[0])
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Supporter Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Keep up the phenomenal work for the community!"
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 80G Tax Exemption PAN input */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Section 80G Tax Exemption Certificate
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                50% Deduction
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter PAN Number (e.g. ABCDE1234F)"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-[10px] text-slate-400">
              Your donation receipt will include registration details for Indian Income Tax deductions.
            </p>
          </div>

          {/* Anonymous toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span className="text-xs text-slate-600">
              Make my donation anonymous on the public supporters list
            </span>
          </label>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading || amount <= 0}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Simulating Secure Transfer...
              </span>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" />
                <span>Confirm & Donate ₹{amount.toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
