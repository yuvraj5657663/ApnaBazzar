import { useState } from 'react';
import BazaarView from './components/BazzarView';
import VoExpenseTracker from './components/VoExpenseTracker/index';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { getStoredUser, clearAuth } from './utils/api';

function App() {
  // Restore user from localStorage on page load (JWT persistence)
  const [user, setUser] = useState(() => getStoredUser());
  const [authPage, setAuthPage] = useState('login');
  const [currentTab, setCurrentTab] = useState('tracker');

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setCurrentTab('tracker');
    setAuthPage('login');
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setCurrentTab('tracker');
  };

  // ── Auth Wall ────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={styles.authWrap}>
        {authPage === 'login' ? (
          <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setAuthPage('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthPage('login')} />
        )}
      </div>
    );
  }

  // ── Main App ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.app}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>🔲</div>
          <div>
            <span style={styles.navTitle}>JIVIKA</span>
            <span style={styles.navSubtitle}> SUITE</span>
          </div>
        </div>

        <div style={styles.navTabs}>
          {[
            { key: 'tracker', label: '📊 VO Tracker' },
            { key: 'bazaar', label: '🛍️ ApnaBazaar' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setCurrentTab(tab.key)}
              style={{
                ...styles.navTab,
                backgroundColor: currentTab === tab.key ? '#0ea5e9' : 'transparent',
                border: currentTab === tab.key ? 'none' : '1px solid #334155'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={styles.navUser}>
          <div style={styles.userAvatar}>{user.name?.charAt(0).toUpperCase() || 'U'}</div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{user.name}</p>
            <span style={styles.userRole}>{user.role}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {currentTab === 'tracker' ? (
          <div>
            <div style={styles.pageHeader}>
              <h2 style={styles.pageTitle}>Financial Dashboard</h2>
              <p style={styles.pageDesc}>Track income and expenses across Village Organizations.</p>
            </div>
            <VoExpenseTracker userRole={user.role} />
          </div>
        ) : (
          <div>
            <div style={styles.pageHeader}>
              <h2 style={styles.pageTitle}>ApnaBazaar Marketplace</h2>
              <p style={styles.pageDesc}>Browse and manage village products.</p>
            </div>
            <BazaarView />
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  authWrap: {
    minHeight: '100vh', backgroundColor: '#f8fafc',
    fontFamily: "'Segoe UI', Roboto, sans-serif", padding: '40px 10px'
  },
  app: {
    minHeight: '100vh', backgroundColor: '#f1f5f9',
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  nav: {
    backgroundColor: '#0f172a', padding: '0 24px', height: '60px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 1000
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo: {
    backgroundColor: '#0ea5e9', color: 'white', width: '34px', height: '34px',
    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', fontSize: '16px'
  },
  navTitle: { color: 'white', fontWeight: '800', fontSize: '17px', letterSpacing: '1.5px' },
  navSubtitle: { color: '#38bdf8', fontWeight: '500', fontSize: '13px' },
  navTabs: { display: 'flex', gap: '10px' },
  navTab: {
    color: 'white', padding: '7px 16px', borderRadius: '6px',
    fontWeight: '600', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s'
  },
  navUser: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: {
    backgroundColor: '#0ea5e9', color: 'white', width: '34px', height: '34px',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '15px'
  },
  userInfo: { textAlign: 'right' },
  userName: { margin: 0, color: 'white', fontSize: '13px', fontWeight: '700' },
  userRole: {
    color: '#38bdf8', fontSize: '10px', fontWeight: '600',
    backgroundColor: 'rgba(56,189,248,0.12)', padding: '2px 6px', borderRadius: '4px'
  },
  logoutBtn: {
    backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444',
    padding: '6px 12px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer',
    fontSize: '12px', transition: 'all 0.2s'
  },
  main: { padding: '28px 24px', maxWidth: '1300px', margin: '0 auto' },
  pageHeader: { marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' },
  pageTitle: { margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '700' },
  pageDesc: { margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }
};

export default App;
