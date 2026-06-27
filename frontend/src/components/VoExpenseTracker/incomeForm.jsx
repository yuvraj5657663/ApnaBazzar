import { useState } from 'react';

function IncomeForm({ vos, shgs, selectedVo, selectedShg, onVoChange, onIncomeSubmit, setSelectedShg }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const safeVos = Array.isArray(vos) ? vos : [];
  const safeShgs = Array.isArray(shgs) ? shgs : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVo || !selectedShg || !title || !amount) {
      alert('Please fill all fields including VO and SHG for Income!');
      return;
    }
    onIncomeSubmit({ title, amount: parseFloat(amount) });
    setTitle('');
    setAmount('');
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>💰 ADD INCOME TRANSACTION</h3>
      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.field}>
          <label style={styles.label}>SELECT VILLAGE ORGANIZATION (VO)</label>
          <select value={selectedVo} onChange={onVoChange} style={styles.input}>
            <option value="">-- Choose VO --</option>
            {safeVos.map(vo => (
              <option key={vo.id || vo._id} value={vo.id || vo._id}>{vo.name}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>SELECT SELF HELP GROUP (SHG)</label>
          <select
            value={selectedShg}
            onChange={(e) => setSelectedShg(e.target.value)}
            disabled={!selectedVo}
            style={{ ...styles.input, backgroundColor: !selectedVo ? '#f8fafc' : '#fff', color: !selectedVo ? '#94a3b8' : '#0f172a' }}
          >
            <option value="">-- Choose SHG --</option>
            {safeShgs.map(shg => (
              <option key={shg.id || shg._id} value={shg.id || shg._id}>{shg.name}</option>
            ))}
          </select>
          {!selectedVo && (
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94a3b8' }}>Select a VO first to see SHGs.</p>
          )}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>INCOME TITLE / DESCRIPTION</label>
          <input
            type="text" placeholder="e.g., Rice Procurement, Interest Return"
            value={title} onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>AMOUNT (RS.)</label>
          <input
            type="number" placeholder="0.00" min="0" step="0.01"
            value={amount} onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.btn}>
          ➕ Record Income
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff', padding: '24px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)', borderTop: '4px solid #16a34a'
  },
  heading: { margin: '0 0 20px 0', color: '#16a34a', fontSize: '16px', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: {},
  label: {
    display: 'block', fontSize: '11px', fontWeight: '600', color: '#475569',
    marginBottom: '5px', letterSpacing: '0.6px'
  },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: '7px', border: '1px solid #e2e8f0',
    fontSize: '14px', color: '#0f172a', boxSizing: 'border-box', outline: 'none'
  },
  btn: {
    width: '100%', padding: '12px', backgroundColor: '#16a34a', color: '#fff', border: 'none',
    borderRadius: '7px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '4px'
  }
};

export default IncomeForm;
