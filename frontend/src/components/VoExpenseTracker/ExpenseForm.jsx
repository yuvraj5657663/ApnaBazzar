import { useState } from 'react';

function ExpenseForm({ vos, onExpenseSubmit }) {
  const [selectedVo, setSelectedVo] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const safeVos = Array.isArray(vos) ? vos : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVo || !title || !amount) {
      alert('Please fill all fields for Expense!');
      return;
    }
    onExpenseSubmit({ voId: selectedVo, title, amount: parseFloat(amount) });
    setTitle('');
    setAmount('');
    setSelectedVo('');
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>💸 ADD EXPENSE TRANSACTION</h3>
      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.field}>
          <label style={styles.label}>SELECT VILLAGE ORGANIZATION (VO)</label>
          <select
            value={selectedVo} onChange={(e) => setSelectedVo(e.target.value)}
            style={styles.input}
          >
            <option value="">-- Choose VO --</option>
            {safeVos.map(vo => (
              <option key={vo.id || vo._id} value={vo.id || vo._id}>{vo.name}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>EXPENSE TITLE / DESCRIPTION</label>
          <input
            type="text" placeholder="e.g., Office Supplies, Training Fee"
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
          ➖ Record Expense
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff', padding: '24px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderTop: '4px solid #cc0000'
  },
  heading: { margin: '0 0 20px 0', color: '#cc0000', fontSize: '16px', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: {},
  label: {
    display: 'block', fontSize: '11px', fontWeight: '600', color: '#333333',
    marginBottom: '5px', letterSpacing: '0.6px'
  },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: '7px', border: '1px solid #cccccc',
    fontSize: '14px', color: '#000000', boxSizing: 'border-box', outline: 'none'
  },
  btn: {
    width: '100%', padding: '12px', backgroundColor: '#cc0000', color: '#fff', border: 'none',
    borderRadius: '7px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', marginTop: '4px'
  }
};

export default ExpenseForm;
