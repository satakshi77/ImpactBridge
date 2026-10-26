import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  ShieldCheck,
  Users,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
} from 'lucide-react';

const ROLE_CONFIGS = {
  donor: {
    id: 'donor',
    name: 'Donor Portal',
    title: 'Donor & Supporter Sign In',
    subtitle: 'Access your donation history, real-time project milestone tracking, and Section 80G tax certificates.',
    color: 'blue',
    accentClass: 'text-blue-600',
    bgBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30',
    borderClass: 'border-blue-200',
    icon: Heart,
    demoUser: {
      email: 'alex.donor@example.com',
      password: 'password123',
      name: 'Alex Morgan',
      note: '₹45,000 Contributed • 2 Active Projects Tracked',
    },
    features: [
      'Live Milestone Execution Roadmap',
      'Instant Section 80G Tax Exemption Receipts',
      'Direct NGO Expense Voucher Auditing',
    ],
  },
  ngo: {
    id: 'ngo',
    name: 'NGO Portal',
    title: 'Verified NGO Partner Sign In',
    subtitle: 'Manage fundraising campaigns, post milestone verification evidence, and review volunteer applications.',
    color: 'emerald',
    accentClass: 'text-emerald-600',
    bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30',
    borderClass: 'border-emerald-200',
    icon: ShieldCheck,
    demoUser: {
      email: 'greenearth@ngo.org',
      password: 'password123',
      name: 'Sunita Rao (Green Earth Alliance)',
      note: 'Verified 80G Entity • 3 Active Campaigns',
    },
    features: [
      'Create Campaigns & Measurable Milestones',
      'Upload Expense Invoices & Vendor Receipts',
      'Review & Confirm Volunteer Service Hours',
    ],
  },
  volunteer: {
    id: 'volunteer',
    name: 'Volunteer Portal',
    title: 'Volunteer & Community Sign In',
    subtitle: 'Find high-impact causes matched to your skills, log verified service hours, and view certificates.',
    color: 'purple',
    accentClass: 'text-purple-600',
    bgBadge: 'bg-purple-50 text-purple-700 border-purple-200',
    buttonClass: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30',
    borderClass: 'border-purple-200',
    icon: Users,
    demoUser: {
      email: 'priya.volunteer@example.com',
      password: 'password123',
      name: 'Priya Patel',
      note: '24 Verified Service Hours • Teaching & First Aid',
    },
    features: [
      'Transparent Skill-Based Matching Scores',
      'Track Application Status in Real-time',
      'Download Verified Community Service Certificates',
    ],
  },
  admin: {
    id: 'admin',
    name: 'Admin Portal',
    title: 'Platform Administration Console',
    subtitle: 'Authorized platform overseers, compliance officers, and independent impact auditors only.',
    color: 'amber',
    accentClass: 'text-amber-600',
    bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
    buttonClass: 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/30',
    borderClass: 'border-amber-200',
    icon: Lock,
    demoUser: {
      email: 'admin@impactbridge.org',
      password: 'password123',
      name: 'Dr. Sarah Chen',
      note: 'Platform Audit & NGO Accreditation Rights',
    },
    features: [
      'Audit NGO Registrations & 80G Documents',
      'Inspect Financial Transparency Disclosures',
      'Platform-wide Analytics & Security Logs',
    ],
  },
};

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { rolePortal } = useParams();
  const [searchParams] = useSearchParams();

  // Determine active role from route params or search query, fallback to 'donor'
  const initialRole =
    rolePortal || searchParams.get('role') || 'donor';
  const [selectedRole, setSelectedRole] = useState(
    ROLE_CONFIGS[initialRole] ? initialRole : 'donor'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Update selected role if URL param changes
  useEffect(() => {
    if (rolePortal && ROLE_CONFIGS[rolePortal]) {
      setSelectedRole(rolePortal);
      setError('');
      setNotice('');
    }
  }, [rolePortal]);

  const currentConfig = ROLE_CONFIGS[selectedRole] || ROLE_CONFIGS.donor;
  const RoleIcon = currentConfig.icon;

  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);
    setError('');
    setNotice('');
    setEmail('');
    setPassword('');
    // Optionally update URL without full reload
    navigate(`/login/${roleKey}`, { replace: true });
  };

  const handlePreFillDemo = () => {
    setEmail(currentConfig.demoUser.email);
    setPassword(currentConfig.demoUser.password);
    setError('');
    setNotice(`Pre-filled credentials for ${currentConfig.demoUser.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const data = await login(email, password);
      const userRole = data.user.role;

      // Check if user logged in through the matching portal
      if (userRole !== selectedRole) {
        setNotice(
          `Notice: Your account has the "${userRole.toUpperCase()}" role. Redirecting you to your ${userRole} workspace...`
        );
        setTimeout(() => {
          redirectToRole(userRole);
        }, 800);
      } else {
        redirectToRole(userRole);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const redirectToRole = (role) => {
    switch (role) {
      case 'ngo':
        navigate('/ngo/dashboard');
        break;
      case 'volunteer':
        navigate('/volunteer/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'donor':
      default:
        navigate('/donor/dashboard');
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
          Role-Based Access Portals
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Select Your Portal to Sign In
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          ImpactBridge provides dedicated workspaces tailored specifically to each role. Select your portal below:
        </p>
      </div>

      {/* Role Selection Tabs / Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.values(ROLE_CONFIGS).map((item) => {
          const ItemIcon = item.icon;
          const isSelected = selectedRole === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleRoleChange(item.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-2 border-slate-900 bg-white shadow-lg ring-2 ring-slate-900/10 scale-[1.02]'
                  : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300 text-slate-600 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <ItemIcon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                )}
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block font-heading">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 capitalize block mt-0.5">
                  {item.id === 'ngo' ? 'Verified Organizations' : `${item.id} Access`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Login Card tailored to Selected Role */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid md:grid-cols-12">
        {/* Left column: Role Context & Features */}
        <div className="md:col-span-5 bg-slate-50/80 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold border border-slate-200 bg-white text-slate-800">
              <RoleIcon className={`w-3.5 h-3.5 ${currentConfig.accentClass}`} />
              <span>{currentConfig.name}</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                {currentConfig.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {currentConfig.subtitle}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                What you can do in this role:
              </span>
              <ul className="space-y-2 text-xs text-slate-600">
                {currentConfig.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Role-Specific Quick Demo Login Button */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Quick Evaluation Demo
              </span>
              <span className="text-[10px] text-slate-400">1-Click</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">{currentConfig.demoUser.name}</p>
            <p className="text-[11px] text-slate-400">{currentConfig.demoUser.note}</p>
            <button
              type="button"
              onClick={handlePreFillDemo}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Auto-Fill Credentials</span>
            </button>
          </div>
        </div>

        {/* Right column: Login Form */}
        <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">Enter Your Credentials</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure authentication for <strong className="text-slate-700 capitalize">{selectedRole}</strong> accounts.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {selectedRole === 'ngo' ? 'Organization Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentConfig.demoUser.email}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white transition cursor-pointer flex items-center justify-center gap-2 ${currentConfig.buttonClass}`}
            >
              {loading ? (
                <span>Authenticating {currentConfig.name}...</span>
              ) : (
                <>
                  <span>Sign In to {currentConfig.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Role Registration & Switcher Footnote */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              Don't have a {selectedRole} account?{' '}
              <Link
                to={`/register?role=${selectedRole}`}
                className="font-bold text-slate-900 hover:underline"
              >
                Register as {selectedRole.toUpperCase()}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
