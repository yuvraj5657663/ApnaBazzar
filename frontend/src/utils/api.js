const BASE_URL = 'http://127.0.0.1:5000/api';

// Get stored JWT token
export const getToken = () => localStorage.getItem('jivika_token');

// Store token + user
export const setAuth = (token, user) => {
  localStorage.setItem('jivika_token', token);
  localStorage.setItem('jivika_user', JSON.stringify(user));
};

// Clear auth on logout
export const clearAuth = () => {
  localStorage.removeItem('jivika_token');
  localStorage.removeItem('jivika_user');
};

// Get persisted user (for page refresh)
export const getStoredUser = () => {
  try {
    const u = localStorage.getItem('jivika_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

// Build request headers with JWT
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

// ─── Exports (open in new tab with token in header won't work — use param) ──
export const getExcelUrl = () => `${BASE_URL}/exports/excel`;
export const getPdfUrl = () => `${BASE_URL}/exports/pdf`;
