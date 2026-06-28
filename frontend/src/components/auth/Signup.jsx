import { useState } from 'react';
import { apiSignup, setAuth } from '../../utils/api';
import jeevikaLogo from '../../assets/jeevika-logo.png';

function Signup({ onSignupSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SHG Member');
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
        setAuth(data.token, data.user);
        onSignupSuccess(data.user);
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
                borderColor: password.length === 0 ? '#cccccc' : isPasswordStrong ? '#00cc00' : '#ff9900'
              }}
              required autoComplete="new-password"
            />
            {password.length > 0 && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '7px', fontSize: '11px', fontWeight: '600' }}>
                <span style={{ color: isLengthValid ? '#00cc00' : '#999999' }}>
                  {isLengthValid ? '✓' : '○'} At least 6 characters
                </span>
                <span style={{ color: hasNumber ? '#00cc00' : '#999999' }}>
                  {hasNumber ? '✓' : '○'} Contains a number
                </span>
              </div>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>ROLE</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
              required
            >
              <option value="SHG Member">SHG Member (View Only)</option>
              <option value="VO Accountant">VO Accountant (Can Add Entries)</option>
              <option value="Admin">Admin (Full Access)</option>
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
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)', width: '100%', maxWidth: '420px',
    border: '1px solid #cccccc'
  },
  logoArea: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px',
    paddingBottom: '20px', borderBottom: '1px solid #cccccc'
  },
  logoImg: {
    width: '52px', height: '52px', objectFit: 'contain',
    borderRadius: '10px', backgroundColor: '#f5f5f5', padding: '4px'
  },
  brandName: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#000000', letterSpacing: '1px' },
  brandTag: { margin: 0, fontSize: '11px', color: '#666666' },
  title: { margin: '0 0 6px 0', color: '#000000', fontSize: '22px', fontWeight: '700' },
  subtitle: { margin: '0 0 24px 0', color: '#666666', fontSize: '14px' },
  errorBox: {
    backgroundColor: '#ffe6e6', border: '1px solid #cc0000', color: '#cc0000',
    padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', fontWeight: '500'
  },
  field: { marginBottom: '16px' },
  label: {
    display: 'block', fontWeight: '600', marginBottom: '6px',
    fontSize: '11px', color: '#333333', letterSpacing: '0.8px'
  },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '8px',
    border: '1px solid #cccccc', outline: 'none', fontSize: '14px',
    boxSizing: 'border-box', color: '#000000'
  },
  btnPrimary: {
    width: '100%', backgroundColor: '#0066cc', color: 'white', border: 'none',
    padding: '13px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer',
    fontSize: '15px', marginTop: '8px'
  },
  switchText: { textAlign: 'center', marginTop: '22px', marginBottom: 0, fontSize: '14px', color: '#666666' },
  link: { color: '#0066cc', cursor: 'pointer', fontWeight: '600' }
};

export default Signup;
