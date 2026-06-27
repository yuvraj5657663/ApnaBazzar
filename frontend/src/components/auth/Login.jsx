import { useState } from 'react';
import { apiLogin, setAuth } from '../../utils/api';
import jeevikaLogo from '../../assets/jeevika-logo.png';

function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      if (data.success) {
        setAuth(data.token, data.user);
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch {
      setError('Could not connect to server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setRecoveryMessage('');
    setTimeout(() => {
      setRecoveryMessage(`📩 A recovery link has been sent to '${recoveryEmail}'. Check your inbox.`);
      setRecoveryEmail('');
    }, 800);
  };

  if (isForgotPassword) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={jeevikaLogo} alt="Jeevika" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
          </div>
          <h2 style={styles.title}>Reset Password</h2>
          <p style={styles.subtitle}>Enter your registered email and we will send a recovery link.</p>

          {recoveryMessage && <div style={styles.success}>{recoveryMessage}</div>}

          <form onSubmit={handleForgotSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>REGISTERED EMAIL</label>
              <input
                type="email" placeholder="your@email.com"
                value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)}
                style={styles.input} required
              />
            </div>
            <button type="submit" style={styles.btnPrimary}>Send Recovery Link</button>
          </form>

          <p style={styles.switchText}>
            <span onClick={() => { setIsForgotPassword(false); setRecoveryMessage(''); }} style={styles.link}>
              ← Back to Sign In
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <img src={jeevikaLogo} alt="Jeevika" style={styles.logoImg} />
          <div>
            <h1 style={styles.brandName}>JIVIKA SUITE</h1>
            <p style={styles.brandTag}>Village Financial Management Platform</p>
          </div>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to manage financial records securely.</p>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <input
              type="email" placeholder="yourname@jivika.org"
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={styles.input} required autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={styles.label}>PASSWORD</label>
              <span onClick={() => setIsForgotPassword(true)} style={styles.link}>Forgot Password?</span>
            </div>
            <input
              type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={styles.input} required autoComplete="current-password"
            />
          </div>

          <button type="submit" style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In Securely →'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don&apos;t have an account?{' '}
          <span onClick={onSwitchToSignup} style={styles.link}>Create Account</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '80vh', padding: '20px'
  },
  card: {
    backgroundColor: 'white', padding: '40px', borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px',
    border: '1px solid #f1f5f9'
  },
  logoArea: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px',
    paddingBottom: '20px', borderBottom: '1px solid #f1f5f9'
  },
  logoImg: {
    width: '52px', height: '52px', objectFit: 'contain',
    borderRadius: '10px', backgroundColor: '#f8fafc', padding: '4px'
  },
  brandName: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '1px' },
  brandTag: { margin: 0, fontSize: '11px', color: '#94a3b8' },
  title: { margin: '0 0 6px 0', color: '#0f172a', fontSize: '22px', fontWeight: '700' },
  subtitle: { margin: '0 0 24px 0', color: '#64748b', fontSize: '14px' },
  errorBox: {
    backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626',
    padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', fontWeight: '500'
  },
  success: {
    backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a',
    padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', fontWeight: '500'
  },
  field: { marginBottom: '18px' },
  label: {
    display: 'block', fontWeight: '600', marginBottom: '6px',
    fontSize: '11px', color: '#475569', letterSpacing: '0.8px'
  },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '8px',
    border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px',
    boxSizing: 'border-box', color: '#0f172a', transition: 'border-color 0.2s'
  },
  btnPrimary: {
    width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none',
    padding: '13px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer',
    fontSize: '15px', marginTop: '8px', transition: 'background-color 0.2s'
  },
  switchText: { textAlign: 'center', marginTop: '22px', marginBottom: 0, fontSize: '14px', color: '#64748b' },
  link: { color: '#0ea5e9', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' }
};

export default Login;
