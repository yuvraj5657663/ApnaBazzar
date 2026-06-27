import { useState } from 'react';
import { apiSignup, setAuth } from '../../utils/api';
import jeevikaLogo from '../../assets/jeevika-logo.png';

function Signup({ onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VO Accountant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLengthValid = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const isPasswordStrong = isLengthValid && hasNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isPasswordStrong) {
      setError('Password must be at least 6 characters and contain a number.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiSignup(name, email, password, role);
      if (data.success) {
        // Auto-login after signup
        setAuth(data.token, data.user);
        alert('Account created successfully! Welcome to Jivika Suite 🎉');
        onSwitchToLogin();
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch {
      setError('Server connection error. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

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

        <h2 style={styles.title}>Create an Account</h2>
        <p style={styles.subtitle}>Join Jivika to manage your village financial ecosystem.</p>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>FULL NAME</label>
            <input
              type="text" placeholder="e.g. Ramesh Kumar"
              value={name} onChange={(e) => setName(e.target.value)}
              style={styles.input} required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>EMAIL ADDRESS</label>
            <input
              type="email" placeholder="name@jivika.org"
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={styles.input} required autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>PASSWORD</label>
            <input
              type="password" placeholder="Min 6 chars, include a number"
              value={password} onChange={(e) => setPassword(e.target.value)}
              style={{
                ...styles.input,
                borderColor: password.length === 0 ? '#e2e8f0' : isPasswordStrong ? '#10b981' : '#f59e0b'
              }}
              required autoComplete="new-password"
            />
            {password.length > 0 && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '7px', fontSize: '11px', fontWeight: '600' }}>
                <span style={{ color: isLengthValid ? '#10b981' : '#94a3b8' }}>
                  {isLengthValid ? '✓' : '○'} At least 6 characters
                </span>
                <span style={{ color: hasNumber ? '#10b981' : '#94a3b8' }}>
                  {hasNumber ? '✓' : '○'} Contains a number
                </span>
              </div>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>ACCOUNT ROLE</label>
            <select
              value={role} onChange={(e) => setRole(e.target.value)}
              style={{ ...styles.input, cursor: 'pointer', backgroundColor: '#fff' }}
            >
              <option value="Admin">Admin (Full Access)</option>
              <option value="VO Accountant">VO Accountant</option>
              <option value="SHG Member">SHG Member (View Only)</option>
            </select>
          </div>

          <button
            type="submit"
            style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <span onClick={onSwitchToLogin} style={styles.link}>Sign In</span>
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
  field: { marginBottom: '16px' },
  label: {
    display: 'block', fontWeight: '600', marginBottom: '6px',
    fontSize: '11px', color: '#475569', letterSpacing: '0.8px'
  },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '8px',
    border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px',
    boxSizing: 'border-box', color: '#0f172a'
  },
  btnPrimary: {
    width: '100%', backgroundColor: '#0ea5e9', color: 'white', border: 'none',
    padding: '13px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer',
    fontSize: '15px', marginTop: '8px'
  },
  switchText: { textAlign: 'center', marginTop: '22px', marginBottom: 0, fontSize: '14px', color: '#64748b' },
  link: { color: '#0ea5e9', cursor: 'pointer', fontWeight: '600' }
};

export default Signup;
