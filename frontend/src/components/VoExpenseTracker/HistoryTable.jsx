import { getToken } from '../../utils/api';

function HistoryTable({ transactions, userRole, loading, onRefresh }) {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Export — pass token as query param since browser fetch for file downloads
  // can't set headers via window.open; we use a temporary link with fetch blob
  const handleExport = async (type) => {
    try {
      const token = getToken();
      const url = `http://127.0.0.1:5000/api/exports/${type}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Export failed.');
        return;
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
    } catch (err) {
      alert('Export error: ' + err.message);
    }
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          TRANSACTION HISTORY
          {loading && <span style={styles.loadingDot}> ⟳ Syncing...</span>}
        </h3>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Refresh */}
          <button onClick={onRefresh} style={styles.refreshBtn} title="Refresh">
            ↻ Refresh
          </button>

          {/* Admin-only export buttons */}
          {userRole === 'Admin' ? (
            <>
              <button onClick={() => handleExport('excel')} style={styles.excelBtn}>
                📥 Excel
              </button>
              <button onClick={() => handleExport('pdf')} style={styles.pdfBtn}>
                📄 PDF
              </button>
            </>
          ) : (
            <span style={styles.restrictedNote}>Exports: Admin only</span>
          )}
        </div>
      </div>

      {/* Table */}
      {safeTransactions.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '36px', margin: '0 0 10px 0' }}>📋</p>
          <p style={{ color: '#64748b', fontWeight: '500', margin: 0 }}>No transactions yet. Start by adding income or expenses above.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>DATE</th>
                <th style={styles.th}>VO NAME</th>
                <th style={styles.th}>SHG NAME</th>
                <th style={styles.th}>TYPE</th>
                <th style={styles.th}>TITLE</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {safeTransactions.map((t, idx) => (
                <tr
                  key={t.id || idx}
                  style={{ ...styles.tr, backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa' }}
                >
                  <td style={styles.td}>
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={styles.td}>{t.vo || t.voId || '—'}</td>
                  <td style={styles.td}>{t.shg || 'N/A'}</td>
                  <td style={styles.td}>
                    <span style={{
                      backgroundColor: t.isIncome ? '#f0fdf4' : '#fef2f2',
                      color: t.isIncome ? '#16a34a' : '#dc2626',
                      padding: '3px 9px', borderRadius: '5px', fontSize: '11px', fontWeight: '700',
                      border: `1px solid ${t.isIncome ? '#bbf7d0' : '#fecaca'}`
                    }}>
                      {t.type || (t.isIncome ? 'INCOME' : 'EXPENSE')}
                    </span>
                  </td>
                  <td style={styles.td}>{t.title}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: '700', color: t.isIncome ? '#16a34a' : '#dc2626' }}>
                    {t.isIncome ? '+' : '−'} Rs. {Number(t.amount || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer count */}
      {safeTransactions.length > 0 && (
        <div style={{ marginTop: '14px', fontSize: '12px', color: '#94a3b8', textAlign: 'right' }}>
          Showing {safeTransactions.length} transaction{safeTransactions.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white', padding: '24px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '20px', paddingBottom: '14px', borderBottom: '2px solid #0ea5e9'
  },
  title: { margin: 0, color: '#0f172a', fontSize: '16px', fontWeight: '700' },
  loadingDot: { color: '#94a3b8', fontSize: '13px', fontWeight: '500' },
  refreshBtn: {
    backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0',
    padding: '7px 14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px'
  },
  excelBtn: {
    backgroundColor: '#0f172a', color: '#fff', border: 'none',
    padding: '7px 14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px'
  },
  pdfBtn: {
    backgroundColor: '#dc2626', color: '#fff', border: 'none',
    padding: '7px 14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px'
  },
  restrictedNote: { fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' },
  emptyState: {
    textAlign: 'center', padding: '50px 20px'
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' },
  thead: { borderBottom: '2px solid #e2e8f0' },
  th: {
    padding: '10px 12px', color: '#64748b', fontWeight: '600',
    fontSize: '11px', letterSpacing: '0.6px', backgroundColor: '#f8fafc'
  },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' },
  td: { padding: '12px 12px', color: '#334155' }
};

export default HistoryTable;
