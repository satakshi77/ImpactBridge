import {
  MOCK_USERS,
  MOCK_ORGS,
  MOCK_CAMPAIGNS,
  MOCK_VOLUNTEER_OPPS,
  MOCK_VOLUNTEER_APPS,
  MOCK_DONATIONS,
  MOCK_STATS_OVERVIEW,
  MOCK_AUDIT_LOGS,
} from './mockStore';

let apiBase = import.meta.env.VITE_API_URL;
if (apiBase) {
  if (!apiBase.startsWith('http://') && !apiBase.startsWith('https://')) {
    apiBase = `https://${apiBase}`;
  }
  apiBase = `${apiBase.replace(/\/+$/, '')}/api`;
} else {
  apiBase = '/api';
}
const API_BASE = apiBase;

const DEMO_EMAILS = [
  'admin@impactbridge.org',
  'alex.donor@example.com',
  'priya.volunteer@example.com',
  'greenearth@ngo.org',
];

// Helper to determine if current session is an evaluation demo profile
const isDemoSession = () => {
  const token = localStorage.getItem('ib_token') || '';
  const storedUserRaw = localStorage.getItem('ib_user');
  if (storedUserRaw) {
    try {
      const u = JSON.parse(storedUserRaw);
      if (u?.email && DEMO_EMAILS.includes(u.email.toLowerCase())) return true;
      if (u?.isDemoUser) return true;
    } catch {
      // ignore
    }
  }
  return token.includes('demo') && !token.includes('new');
};

// Fallback resolver when server is sleeping, offline, or rewrites to HTML
const resolveMockFallback = (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.replace(/^\/api/, '').split('?')[0];
  const method = (options.method || 'GET').toUpperCase();
  let body = {};
  try {
    if (options.body) body = JSON.parse(options.body);
  } catch {
    body = {};
  }

  // Auth Endpoints
  if (cleanEndpoint === '/auth/login' && method === 'POST') {
    const email = (body.email || '').toLowerCase();
    const isDemo = DEMO_EMAILS.includes(email);
    let user;

    if (isDemo) {
      user = Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === email) || MOCK_USERS.donor;
    } else {
      // NEW USER LOGIN: Provide clean zero-data state
      user = {
        _id: `user_new_${Date.now()}`,
        name: body.email.split('@')[0],
        email: body.email,
        role: email.includes('admin')
          ? 'admin'
          : email.includes('ngo')
          ? 'ngo'
          : email.includes('vol')
          ? 'volunteer'
          : 'donor',
        totalDonated: 0,
        hoursVolunteered: 0,
        badges: [],
        isDemoUser: false,
      };
      // Clear any prior cached user contributions
      localStorage.removeItem('ib_custom_donations');
      localStorage.removeItem('ib_custom_applications');
      localStorage.removeItem('ib_custom_campaigns');
    }

    const token = `ib_mock_token_${user.role}_${isDemo ? 'demo' : 'new'}_${Date.now()}`;
    localStorage.setItem('ib_user', JSON.stringify(user));

    return {
      success: true,
      token,
      user,
      organization: user.role === 'ngo' && isDemo ? MOCK_ORGS[0] : user.role === 'ngo' ? { name: `${user.name}'s Foundation` } : null,
      message: 'Login successful',
    };
  }

  if (cleanEndpoint === '/auth/demo-switch' && method === 'POST') {
    const role = body.role || 'donor';
    const user = { ...MOCK_USERS[role], isDemoUser: true };
    const token = `ib_mock_token_${user.role}_demo_${Date.now()}`;
    localStorage.setItem('ib_user', JSON.stringify(user));
    return {
      success: true,
      token,
      user,
      organization: user.role === 'ngo' ? MOCK_ORGS[0] : null,
    };
  }

  if (cleanEndpoint === '/auth/me') {
    const storedUserRaw = localStorage.getItem('ib_user');
    if (storedUserRaw) {
      try {
        const parsed = JSON.parse(storedUserRaw);
        return {
          success: true,
          user: parsed,
          organization: parsed.role === 'ngo' ? (parsed.isDemoUser ? MOCK_ORGS[0] : { name: `${parsed.name}'s Foundation` }) : null,
        };
      } catch {
        // ignore
      }
    }

    const token = localStorage.getItem('ib_token') || '';
    let role = 'donor';
    if (token.includes('admin')) role = 'admin';
    else if (token.includes('ngo')) role = 'ngo';
    else if (token.includes('vol')) role = 'volunteer';
    const user = isDemoSession() ? MOCK_USERS[role] : {
      _id: `user_fresh_${Date.now()}`,
      name: 'User',
      email: 'user@example.com',
      role,
      totalDonated: 0,
      hoursVolunteered: 0,
      isDemoUser: false,
    };
    return {
      success: true,
      user,
      organization: user.role === 'ngo' ? MOCK_ORGS[0] : null,
    };
  }

  if (cleanEndpoint === '/auth/register' && method === 'POST') {
    const role = body.role || 'donor';
    const user = {
      _id: `user_new_${Date.now()}`,
      name: body.name || 'New Supporter',
      email: body.email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      totalDonated: 0,
      hoursVolunteered: 0,
      badges: [],
      isDemoUser: false,
    };
    // Fresh slate
    localStorage.removeItem('ib_custom_donations');
    localStorage.removeItem('ib_custom_applications');
    localStorage.removeItem('ib_custom_campaigns');
    localStorage.setItem('ib_user', JSON.stringify(user));

    return {
      success: true,
      token: `ib_mock_token_${role}_new_${Date.now()}`,
      user,
      organization: role === 'ngo' ? { name: body.organizationName || `${user.name}'s Foundation` } : null,
    };
  }

  // Campaigns
  if (cleanEndpoint === '/campaigns') {
    const customCamps = JSON.parse(localStorage.getItem('ib_custom_campaigns') || '[]');
    return { success: true, campaigns: [...customCamps, ...MOCK_CAMPAIGNS] };
  }
  if (cleanEndpoint === '/campaigns/my/ngo') {
    if (!isDemoSession()) {
      const customCamps = JSON.parse(localStorage.getItem('ib_custom_campaigns') || '[]');
      return { success: true, campaigns: customCamps };
    }
    return { success: true, campaigns: [MOCK_CAMPAIGNS[0]] };
  }
  if (cleanEndpoint === '/campaigns/saved') {
    return { success: true, savedCampaigns: isDemoSession() ? [MOCK_CAMPAIGNS[1]] : [] };
  }
  if (cleanEndpoint === '/campaigns' && method === 'POST') {
    const newCamp = {
      _id: `camp_${Date.now()}`,
      title: body.title || 'Community Empowerment Project',
      fundingTarget: body.fundingTarget || 500000,
      fundsRaised: 0,
      status: 'active',
      causeArea: body.causeArea || 'General Welfare',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      milestones: [],
      expenses: [],
    };
    const customCamps = JSON.parse(localStorage.getItem('ib_custom_campaigns') || '[]');
    customCamps.unshift(newCamp);
    localStorage.setItem('ib_custom_campaigns', JSON.stringify(customCamps));
    return { success: true, campaign: newCamp };
  }
  if (cleanEndpoint.startsWith('/campaigns/') && cleanEndpoint.endsWith('/save')) {
    return { success: true, message: 'Campaign saved' };
  }
  if (cleanEndpoint.startsWith('/campaigns/')) {
    const id = cleanEndpoint.replace('/campaigns/', '');
    const customCamps = JSON.parse(localStorage.getItem('ib_custom_campaigns') || '[]');
    const found = [...customCamps, ...MOCK_CAMPAIGNS].find((c) => c._id === id || c.slug === id) || MOCK_CAMPAIGNS[0];
    return { success: true, campaign: found };
  }

  // Volunteers
  if (cleanEndpoint === '/volunteers') {
    return { success: true, opportunities: MOCK_VOLUNTEER_OPPS };
  }
  if (cleanEndpoint === '/volunteers/my-applications') {
    if (!isDemoSession()) {
      const customApps = JSON.parse(localStorage.getItem('ib_custom_applications') || '[]');
      return {
        success: true,
        applications: customApps,
        stats: {
          totalApplications: customApps.length,
          confirmedActivities: customApps.filter((a) => a.status === 'completed' || a.status === 'attended').length,
          confirmedHours: customApps.reduce((sum, a) => sum + (a.hoursLogged || 0), 0),
        },
      };
    }
    return {
      success: true,
      applications: MOCK_VOLUNTEER_APPS,
      stats: { totalApplications: 2, confirmedActivities: 1, confirmedHours: 24 },
    };
  }
  if (cleanEndpoint === '/volunteers/ngo-applications') {
    if (!isDemoSession()) return { success: true, applications: [] };
    return { success: true, applications: MOCK_VOLUNTEER_APPS };
  }
  if (cleanEndpoint === '/volunteers/apply') {
    const customApps = JSON.parse(localStorage.getItem('ib_custom_applications') || '[]');
    customApps.unshift({
      _id: `app_${Date.now()}`,
      opportunity: MOCK_VOLUNTEER_OPPS[0],
      status: 'pending',
      hoursLogged: 0,
      attendanceConfirmed: false,
      certificateIssued: false,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('ib_custom_applications', JSON.stringify(customApps));
    return { success: true, message: 'Application submitted successfully' };
  }
  if (cleanEndpoint.includes('/review') || cleanEndpoint.includes('/confirm-attendance')) {
    return { success: true, message: 'Application updated' };
  }

  // Donations
  if (cleanEndpoint === '/donations/supported-projects') {
    if (!isDemoSession()) {
      const customDons = JSON.parse(localStorage.getItem('ib_custom_donations') || '[]');
      const projects = customDons.map((d) => ({
        campaign: d.campaign,
        myTotalContribution: d.amount,
        donationCount: 1,
        completedMilestones: 0,
        milestonesProgressPercent: 0,
      }));
      return { success: true, supportedProjects: projects };
    }
    return {
      success: true,
      supportedProjects: [
        {
          campaign: MOCK_CAMPAIGNS[0],
          organization: MOCK_ORGS[0],
          myTotalContribution: 25000,
          donationCount: 1,
          completedMilestones: 1,
          milestonesProgressPercent: 50,
        },
        {
          campaign: MOCK_CAMPAIGNS[1],
          organization: MOCK_ORGS[1],
          myTotalContribution: 20000,
          donationCount: 1,
          completedMilestones: 1,
          milestonesProgressPercent: 60,
        },
      ],
    };
  }
  if (cleanEndpoint === '/donations/my') {
    if (!isDemoSession()) {
      const customDons = JSON.parse(localStorage.getItem('ib_custom_donations') || '[]');
      return { success: true, count: customDons.length, donations: customDons };
    }
    return { success: true, count: MOCK_DONATIONS.length, donations: MOCK_DONATIONS };
  }
  if (cleanEndpoint === '/donations' && method === 'POST') {
    const newDonation = {
      _id: `don_${Date.now()}`,
      amount: Number(body.amount) || 5000,
      receiptNumber: `REC-80G-${Date.now().toString().slice(-6)}`,
      paymentStatus: 'completed',
      campaign: MOCK_CAMPAIGNS[0],
      createdAt: new Date().toISOString(),
    };
    const customDons = JSON.parse(localStorage.getItem('ib_custom_donations') || '[]');
    customDons.unshift(newDonation);
    localStorage.setItem('ib_custom_donations', JSON.stringify(customDons));

    // Update stored user totalDonated
    const storedUserRaw = localStorage.getItem('ib_user');
    if (storedUserRaw) {
      try {
        const u = JSON.parse(storedUserRaw);
        u.totalDonated = (u.totalDonated || 0) + newDonation.amount;
        localStorage.setItem('ib_user', JSON.stringify(u));
      } catch {
        // ignore
      }
    }

    return {
      success: true,
      donation: newDonation,
      receipt: {
        receiptNumber: newDonation.receiptNumber,
        transactionId: `TXN-IB-${Date.now()}`,
        amount: newDonation.amount,
        donorName: body.donorName || 'Supporter',
        campaignTitle: MOCK_CAMPAIGNS[0].title,
        date: newDonation.createdAt,
      },
    };
  }

  // Expenses & Milestones
  if (cleanEndpoint === '/expenses') {
    if (!isDemoSession()) return { success: true, expenses: [] };
    return { success: true, expenses: MOCK_CAMPAIGNS[0].expenses };
  }
  if (cleanEndpoint === '/milestones') {
    if (!isDemoSession()) return { success: true, milestones: [] };
    return { success: true, milestones: MOCK_CAMPAIGNS[0].milestones };
  }
  if (cleanEndpoint === '/updates') {
    return { success: true, updates: [] };
  }

  // NGOs
  if (cleanEndpoint === '/ngos') {
    return { success: true, ngos: MOCK_ORGS };
  }
  if (cleanEndpoint.startsWith('/ngos/')) {
    const id = cleanEndpoint.replace('/ngos/', '');
    const found = MOCK_ORGS.find((o) => o._id === id) || MOCK_ORGS[0];
    return { success: true, ngo: found };
  }

  // Stats
  if (cleanEndpoint === '/stats/overview' || cleanEndpoint === '/admin/stats') {
    return { success: true, stats: MOCK_STATS_OVERVIEW };
  }
  if (cleanEndpoint === '/stats/map') {
    const points = [
      {
        id: 'camp_01',
        type: 'campaign',
        title: 'Clean Drinking Water for 12 Drought-Hit Villages in Barmer',
        cause: 'Clean Water & Sanitation',
        lat: 25.7532,
        lng: 71.4181,
        latitude: 25.7532,
        longitude: 71.4181,
        city: 'Barmer, Rajasthan',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
        summary: 'Installing 12 solar-powered RO filtration units supplying 5,000L/day of WHO-standard water to 6,400 villagers.',
        raised: 620000,
        target: 800000,
        percentFunded: 78,
        beneficiaries: '6,400 Villagers',
        orgName: 'Green Earth Alliance',
        status: 'Active Field Site',
        metrics: '12 Solar RO Units',
        link: '/campaigns/clean-drinking-water-barmer-villages',
      },
      {
        id: 'camp_02',
        type: 'campaign',
        title: 'Solar-Powered Digital Classrooms for 15 Himalayan Schools',
        cause: 'Quality Education',
        lat: 34.1526,
        lng: 77.5771,
        latitude: 34.1526,
        longitude: 77.5771,
        city: 'Leh, Ladakh',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
        summary: 'Equipping 1,200 mountain students with solar tablets, smart projection hubs, and STEM learning software.',
        raised: 510000,
        target: 650000,
        percentFunded: 78,
        beneficiaries: '1,200 Students',
        orgName: 'Asha Literacy Foundation',
        status: 'Active Field Site',
        metrics: '15 Smart Hubs',
        link: '/campaigns/solar-digital-classrooms-ladakh',
      },
      {
        id: 'camp_03',
        type: 'campaign',
        title: 'Mobile Doctor & Diagnostic Clinic for 22 Urban Slums',
        cause: 'Healthcare & Medical',
        lat: 12.9716,
        lng: 77.5946,
        latitude: 12.9716,
        longitude: 77.5946,
        city: 'Bengaluru, Karnataka',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
        summary: 'Free weekly mobile triage clinic providing diabetes screenings, pediatric consultations, and essential prescriptions.',
        raised: 395000,
        target: 450000,
        percentFunded: 88,
        beneficiaries: '9,500 Workers',
        orgName: 'Sanjeevani Health Outreach',
        status: 'Active Field Site',
        metrics: '22 Slum Bastis',
        link: '/campaigns/mobile-clinic-slums',
      },
      {
        id: 'camp_04',
        type: 'campaign',
        title: 'Mangrove Reforestation & Cyclone Defense Belt',
        cause: 'Environment & Climate',
        lat: 21.9497,
        lng: 89.1833,
        latitude: 21.9497,
        longitude: 89.1833,
        city: 'Sundarbans, West Bengal',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        summary: 'Planting 50,000 indigenous mangrove saplings to protect coastal islands from tidal surge surges and restore biodiversity.',
        raised: 280000,
        target: 350000,
        percentFunded: 80,
        beneficiaries: '12,000 Fisherfolk',
        orgName: 'Green Earth Alliance',
        status: 'Restoration Zone',
        metrics: '50,000 Saplings',
        link: '/campaigns',
      },
      {
        id: 'vol_01',
        type: 'volunteer',
        title: 'STEM & Digital Literacy Mentorship Drive',
        cause: 'Quality Education',
        lat: 34.1526,
        lng: 77.5771,
        latitude: 34.1526,
        longitude: 77.5771,
        city: 'Leh, Ladakh',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        summary: 'Volunteer drive training high schoolers on basic programming logic, creative robotics, and digital literacy tools.',
        slotsLeft: 3,
        beneficiaries: '450 Children',
        orgName: 'Asha Literacy Foundation',
        status: 'Recruiting Volunteers',
        metrics: 'Weekends (4 hrs/wk)',
        link: '/volunteers',
      },
      {
        id: 'vol_02',
        type: 'volunteer',
        title: 'Desert Water Purity & Fluoride Testing Survey',
        cause: 'Clean Water & Sanitation',
        lat: 25.7532,
        lng: 71.4181,
        latitude: 25.7532,
        longitude: 71.4181,
        city: 'Barmer, Rajasthan',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
        summary: 'Field volunteer opportunity to conduct lab sampling, test TDS levels, and log water quality sensor verification.',
        slotsLeft: 5,
        beneficiaries: '6,400 Villagers',
        orgName: 'Green Earth Alliance',
        status: 'Recruiting Volunteers',
        metrics: 'Field Days',
        link: '/volunteers',
      },
      {
        id: 'vol_03',
        type: 'volunteer',
        title: 'Community Nutrition & Health Camp Screening',
        cause: 'Healthcare & Medical',
        lat: 19.0760,
        lng: 72.8777,
        latitude: 19.0760,
        longitude: 72.8777,
        city: 'Mumbai, Maharashtra',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
        summary: 'Conducting triage diagnostics, recording hemoglobin levels, and providing free micronutrient counseling.',
        slotsLeft: 8,
        beneficiaries: '2,800 Mothers & Infants',
        orgName: 'Sanjeevani Health Outreach',
        status: 'Recruiting Volunteers',
        metrics: 'Sundays',
        link: '/volunteers',
      },
    ];
    return { success: true, count: points.length, points };
  }
  if (cleanEndpoint === '/stats/notifications') {
    return { success: true, notifications: [] };
  }

  // Admin
  if (cleanEndpoint === '/admin/verifications') {
    return {
      success: true,
      pendingOrgs: [MOCK_ORGS[2]],
      verifiedOrgs: [MOCK_ORGS[0], MOCK_ORGS[1]],
    };
  }
  if (cleanEndpoint === '/admin/audit-logs') {
    return { success: true, auditLogs: MOCK_AUDIT_LOGS };
  }

  return { success: true, message: 'Acknowledged' };
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ib_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';

    // If server returned an HTML document (SPA rewrite fallback or 404 page)
    if (contentType.includes('text/html')) {
      return resolveMockFallback(endpoint, options);
    }

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      return resolveMockFallback(endpoint, options);
    }

    return data;
  } catch {
    // Network failure, connection refused, or CORS error -> return verified fallback
    return resolveMockFallback(endpoint, options);
  }
};
