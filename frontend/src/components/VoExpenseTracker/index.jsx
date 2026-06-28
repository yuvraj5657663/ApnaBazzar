import { useEffect, useState, useCallback } from 'react';
import SummaryCards from './summaryCards';
import IncomeForm from './incomeForm';
import ExpenseForm from './ExpenseForm';
import HistoryTable from './HistoryTable';
import AnalyticsCharts from './AnalyticsCharts';
import { fetchVos, fetchShgs, fetchTransactions, postIncome, postExpense } from '../../utils/api';

function VoExpenseTracker({ userRole }) {
  const [vos, setVos] = useState([]);
  const [shgs, setShgs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedVo, setSelectedVo] = useState('');
  const [selectedShg, setSelectedShg] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loadingTx, setLoadingTx] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadTransactions = useCallback(async () => {
    setLoadingTx(true);
    try {
      const res = await fetchTransactions();
      let data = [];
      if (res && res.success && Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res)) {
        data = res;
      }

      setTransactions(data);

      const incomeSum = data
        .filter(t => t && (t.isIncome === true || t.type === 'INCOME'))
        .reduce((s, t) => s + Number(t.amount || 0), 0);
      const expenseSum = data
        .filter(t => t && (t.isIncome === false || t.type === 'EXPENSE'))
        .reduce((s, t) => s + Number(t.amount || 0), 0);

      setTotalIncome(incomeSum);
      setTotalExpense(expenseSum);
    } catch (err) {
      console.error('Transactions fetch error:', err);
      setTransactions([]);
    } finally {
      setLoadingTx(false);
    }
  }, []);

  useEffect(() => {
    fetchVos()
      .then(data => setVos(Array.isArray(data) ? data : []))
      .catch(() => setVos([]));

    loadTransactions();
  }, [loadTransactions]);

  const handleVoChange = (e) => {
    const voId = e.target.value;
    setSelectedVo(voId);
    setSelectedShg('');
    setShgs([]);

    if (voId) {
      fetchShgs(voId)
        .then(data => setShgs(Array.isArray(data) ? data : []))
        .catch(() => setShgs([]));
    }
  };

  const handleIncomeSubmit = async (formValues) => {
    if (userRole === 'SHG Member') {
      showToast('Permission denied: SHG Members cannot add entries.', 'error');
      return;
    }
    try {
      const res = await postIncome({
        voId: selectedVo,
        shgId: selectedShg || null,
        title: formValues.title,
        amount: parseFloat(formValues.amount)
      });
      if (res.success) {
        showToast('Income recorded successfully! 💰');
        loadTransactions();
      } else {
        showToast(res.message || 'Failed to save income.', 'error');
      }
    } catch (err) {
      showToast('Network error: ' + err.message, 'error');
    }
  };

  const handleExpenseSubmit = async (formValues) => {
    if (userRole === 'SHG Member') {
      showToast('Permission denied: SHG Members cannot add entries.', 'error');
      return;
    }
    try {
      const res = await postExpense({
        voId: formValues.voId,
        shgId: null,
        title: formValues.title,
        amount: parseFloat(formValues.amount)
      });
      if (res.success) {
        showToast('Expense recorded successfully! 💸');
        loadTransactions();
      } else {
        showToast(res.message || 'Failed to save expense.', 'error');
      }
    } catch (err) {
      showToast('Network error: ' + err.message, 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          backgroundColor: toast.type === 'error' ? '#dc2626' : '#10b981',
          color: 'white', padding: '14px 20px', borderRadius: '10px',
          fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '380px'
        }}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.message}
        </div>
      )}

      {/* Access Level Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        backgroundColor: '#e6f0ff', padding: '5px 12px', borderRadius: '6px',
        fontSize: '12px', fontWeight: '600', color: '#003366', marginBottom: '20px'
      }}>
        <span>Access Level:</span>
        <span style={{ color: '#0066cc' }}>{userRole?.toUpperCase()}</span>
      </div>

      <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} />
      <AnalyticsCharts transactions={transactions} />

      {userRole !== 'SHG Member' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px', marginBottom: '32px'
        }}>
          <IncomeForm
            vos={vos} shgs={shgs}
            selectedVo={selectedVo} selectedShg={selectedShg}
            onVoChange={handleVoChange} onIncomeSubmit={handleIncomeSubmit}
            setSelectedShg={setSelectedShg}
          />
          <ExpenseForm vos={vos} onExpenseSubmit={handleExpenseSubmit} />
        </div>
      ) : (
        <div style={{
          backgroundColor: '#e6f0ff', border: '1px solid #0066cc', color: '#003366',
          padding: '16px', borderRadius: '10px', fontSize: '14px', marginBottom: '24px', fontWeight: '500'
        }}>
          ℹ️ You are logged in as an <strong>SHG Member</strong>. Data entry is restricted to view-only access.
        </div>
      )}

      <HistoryTable
        transactions={transactions}
        userRole={userRole}
        loading={loadingTx}
        onRefresh={loadTransactions}
      />
    </div>
  );
}

export default VoExpenseTracker;
