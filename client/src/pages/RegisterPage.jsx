import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Users, ShieldCheck, Mail, Lock, User, Building, FileText } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('donor'); // 'donor', 'volunteer', 'ngo'
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
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">Join ImpactBridge</h1>
        <p className="text-xs text-slate-500">Give with purpose. Volunteer with impact. See the change.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Role Selector Tabs */}
        <div>
          <label className="font-semibold text-slate-700 text-xs block mb-2 uppercase tracking-wider">
            I am joining as a:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'donor', label: 'Donor / Supporter', icon: Heart },
              { id: 'volunteer', label: 'Volunteer', icon: Users },
              { id: 'ngo', label: 'NGO / Non-Profit', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`py-3 px-2 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    role === item.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {role === 'ngo' ? 'Representative Full Name' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Maya Sharma"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Role specific inputs */}
          {role === 'ngo' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Organization Legal Name</label>
                <input
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="e.g. Pratham Vikas Trust"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Registration / 80G Number</label>
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="e.g. NGO-DEL-2022-9901"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {role === 'volunteer' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Teaching, Digital Literacy, Graphic Design"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Weekly Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Weekends</option>
                  <option>Weekdays</option>
                  <option>Flexible</option>
                  <option>Evenings</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};
