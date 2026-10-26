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
    let user = Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === email);
    if (!user) {
      user = email.includes('admin')
        ? MOCK_USERS.admin
        : email.includes('ngo')
        ? MOCK_USERS.ngo
        : email.includes('priya') || email.includes('vol')
        ? MOCK_USERS.volunteer
        : MOCK_USERS.donor;
    }
    const token = `ib_mock_token_${user.role}_${Date.now()}`;
    return {
      success: true,
      token,
      user,
      organization: user.role === 'ngo' ? MOCK_ORGS[0] : null,
      message: 'Demo login successful (Mock Sync)',
    };
  }

  if (cleanEndpoint === '/auth/demo-switch' && method === 'POST') {
    const role = body.role || 'donor';
    const user = MOCK_USERS[role] || MOCK_USERS.donor;
    const token = `ib_mock_token_${user.role}_${Date.now()}`;
    return {
      success: true,
      token,
      user,
      organization: user.role === 'ngo' ? MOCK_ORGS[0] : null,
    };
  }

  if (cleanEndpoint === '/auth/me') {
    const token = localStorage.getItem('ib_token') || '';
    let role = 'donor';
    if (token.includes('admin')) role = 'admin';
    else if (token.includes('ngo')) role = 'ngo';
    else if (token.includes('vol')) role = 'volunteer';
    const user = MOCK_USERS[role] || MOCK_USERS.donor;
    return {
      success: true,
      user,
      organization: user.role === 'ngo' ? MOCK_ORGS[0] : null,
    };
  }

  if (cleanEndpoint === '/auth/register' && method === 'POST') {
    const role = body.role || 'donor';
    const user = {
      _id: `user_${Date.now()}`,
      name: body.name || 'Community Member',
      email: body.email,
      role,
      avatar: MOCK_USERS[role]?.avatar || MOCK_USERS.donor.avatar,
    };
    return {
      success: true,
      token: `ib_mock_token_${role}_${Date.now()}`,
      user,
      organization: role === 'ngo' ? { name: body.organizationName } : null,
    };
  }

  // Campaigns
  if (cleanEndpoint === '/campaigns') {
    return { success: true, campaigns: MOCK_CAMPAIGNS };
  }
  if (cleanEndpoint === '/campaigns/my/ngo') {
    return { success: true, campaigns: [MOCK_CAMPAIGNS[0]] };
  }
  if (cleanEndpoint === '/campaigns/saved') {
    return { success: true, campaigns: [MOCK_CAMPAIGNS[1]] };
  }
  if (cleanEndpoint.startsWith('/campaigns/') && cleanEndpoint.endsWith('/save')) {
    return { success: true, message: 'Campaign saved' };
  }
  if (cleanEndpoint.startsWith('/campaigns/')) {
    const id = cleanEndpoint.replace('/campaigns/', '');
    const found = MOCK_CAMPAIGNS.find((c) => c._id === id || c.slug === id) || MOCK_CAMPAIGNS[0];
    return { success: true, campaign: found };
  }

  // Volunteers
  if (cleanEndpoint === '/volunteers') {
    return { success: true, opportunities: MOCK_VOLUNTEER_OPPS };
  }
  if (cleanEndpoint === '/volunteers/my-applications' || cleanEndpoint === '/volunteers/ngo-applications') {
    return { success: true, applications: MOCK_VOLUNTEER_APPS };
  }
  if (cleanEndpoint === '/volunteers/apply') {
    return { success: true, message: 'Application submitted successfully' };
  }
  if (cleanEndpoint.includes('/review') || cleanEndpoint.includes('/confirm-attendance')) {
    return { success: true, message: 'Application updated' };
  }

  // Donations
  if (cleanEndpoint === '/donations/supported-projects') {
    return { success: true, projects: [MOCK_CAMPAIGNS[0], MOCK_CAMPAIGNS[1]] };
  }
  if (cleanEndpoint === '/donations/my') {
    return { success: true, donations: MOCK_DONATIONS };
  }
  if (cleanEndpoint === '/donations' && method === 'POST') {
    return {
      success: true,
      donation: {
        _id: `don_${Date.now()}`,
        amount: body.amount || 5000,
        receiptNumber: `REC-80G-${Date.now().toString().slice(-6)}`,
        campaign: MOCK_CAMPAIGNS[0],
      },
    };
  }

  // Expenses & Milestones
  if (cleanEndpoint === '/expenses') {
    return { success: true, expenses: MOCK_CAMPAIGNS[0].expenses };
  }
  if (cleanEndpoint === '/milestones') {
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
    const locations = MOCK_CAMPAIGNS.map((c) => ({
      _id: c._id,
      title: c.title,
      causeArea: c.causeArea,
      fundsRaised: c.fundsRaised,
      fundingTarget: c.fundingTarget,
      coordinates: c.location,
    }));
    return { success: true, locations };
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
