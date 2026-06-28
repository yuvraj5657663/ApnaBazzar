const apiRoot = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : import.meta.env.PROD
    ? 'https://apna-bazzar-delta.vercel.app'
    : 'http://localhost:5000';

const BASE_URL = `${apiRoot}/api`;

export const getToken = () => localStorage.getItem('jivika_token');

export const setAuth = (token, user) => {
  localStorage.setItem('jivika_token', token);
  localStorage.setItem('jivika_user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('jivika_token');
  localStorage.removeItem('jivika_user');
};

export const getStoredUser = () => {
  try {
    const u = localStorage.getItem('jivika_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const apiLogin = (email, password) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(r => r.json());

export const apiSignup = (name, email, password, role) =>
  fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  }).then(r => r.json());

export const fetchMe = () =>
  fetch(`${BASE_URL}/auth/me`, { headers: authHeaders() }).then(r => r.json());

// ─── VOs & SHGs ──────────────────────────────────────────────────────────────
export const fetchVos = () =>
  fetch(`${BASE_URL}/vos`, { headers: authHeaders() }).then(r => r.json());

export const fetchShgs = (voId) =>
  fetch(`${BASE_URL}/shgs?voId=${voId}`, { headers: authHeaders() }).then(r => r.json());

// ─── Transactions ─────────────────────────────────────────────────────────────
export const fetchTransactions = () =>
  fetch(`${BASE_URL}/transactions`, { headers: authHeaders() }).then(r => r.json());

export const postIncome = (data) =>
  fetch(`${BASE_URL}/transactions/income`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }).then(r => r.json());

export const postExpense = (data) =>
  fetch(`${BASE_URL}/transactions/expense`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  }).then(r => r.json());

export const deleteTransaction = (id) =>
  fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  }).then(r => r.json());

// ─── Products ─────────────────────────────────────────────────────────────────
export const fetchProducts = () =>
  fetch(`${BASE_URL}/products`, { headers: authHeaders() }).then(r => r.json());

// ─── Exports ──────────────────────────────────────────────────────────────────
export const exportData = async (type) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/exports/${type}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Export failed');
  }
  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = type === 'excel' ? 'Jivika_Transactions.xlsx' : 'Jivika_Transactions.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
};
