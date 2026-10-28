import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Users, Building2, Mail, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlRole = searchParams.get('role');
  const [role, setRole] = useState(
    ['donor', 'volunteer', 'ngo'].includes(urlRole) ? urlRole : 'donor'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
    registrationNumber: '',
    description: '',
    skills: 'Teaching, Communication',
    availability: 'Flexible',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      };

      if (role === 'ngo') {
        payload.organizationName = formData.organizationName || `${formData.name}'s Foundation`;
        payload.registrationNumber = formData.registrationNumber || `REG-${Date.now().toString().slice(-6)}`;
        payload.description = formData.description;
      } else if (role === 'volunteer') {
        payload.skills = formData.skills.split(',').map((s) => s.trim());
        payload.availability = formData.availability;
      }

      const data = await register(payload);
      if (data.user.role === 'ngo') navigate('/ngo/dashboard');
      else if (data.user.role === 'volunteer') navigate('/volunteer/dashboard');
      else navigate('/donor/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-100 p-3">
            <svg className="w-10 h-10 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Join ImpactBridge
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Create an account to start contributing, volunteering, or launching verified campaigns
            </p>
          </div>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-200/70 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'donor'
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Donor</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('volunteer')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'volunteer'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Volunteer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('ngo')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === 'ngo'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>NGO Org</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06)] p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 font-heading capitalize">
              Register as {role === 'ngo' ? 'an NGO Organization' : role}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill out the details below to complete your registration.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-700 rounded-2xl text-xs border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="alex.donor@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {role === 'ngo' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Organization Official Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GreenEarth Foundation"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Trust Registration / FCRA Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NGO-DEL-2018-9941"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </>
            )}

            {role === 'volunteer' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Core Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Teaching, First Aid, Social Media"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 text-sm mt-4"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
