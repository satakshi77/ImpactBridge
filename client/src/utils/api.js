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

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ib_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
