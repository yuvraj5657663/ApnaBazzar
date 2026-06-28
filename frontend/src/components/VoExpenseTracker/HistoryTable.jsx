import { exportData } from '../../utils/api';

function HistoryTable({ transactions, userRole, loading, onRefresh }) {
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const handleExport = async (type) => {
    try {
      await exportData(type);
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
          <p style={{ color: '#666666', fontWeight: '500', margin: 0 }}>No transactions yet. Start by adding income or expenses above.</p>
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
                  style={{ ...styles.tr, backgroundColor: idx % 2 === 0 ? '#fff' : '#f5f5f5' }}
                >
                  <td style={styles.td}>
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td style={styles.td}>{t.vo || t.voId || '—'}</td>
                  <td style={styles.td}>{t.shg || 'N/A'}</td>
                  <td style={styles.td}>
                    <span style={{
                      backgroundColor: t.isIncome ? '#e6ffe6' : '#ffe6e6',
                      color: t.isIncome ? '#00cc00' : '#cc0000',
                      padding: '3px 9px', borderRadius: '5px', fontSize: '11px', fontWeight: '700',
                      border: `1px solid ${t.isIncome ? '#00cc00' : '#cc0000'}`
                    }}>
                      {t.type || (t.isIncome ? 'INCOME' : 'EXPENSE')}
                    </span>
                  </td>
                  <td style={styles.td}>{t.title}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: '700', color: t.isIncome ? '#00cc00' : '#cc0000' }}>
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
        <div style={{ marginTop: '14px', fontSize: '12px', color: '#999999', textAlign: 'right' }}>
          Showing {safeTransactions.length} transaction{safeTransactions.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white', padding: '24px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '20px', paddingBottom: '14px', borderBottom: '2px solid #cc0000'
  },
  title: { margin: 0, color: '#000000', fontSize: '16px', fontWeight: '700' },
  loadingDot: { color: '#999999', fontSize: '13px', fontWeight: '500' },
  refreshBtn: {
    backgroundColor: '#f5f5f5', color: '#333333', border: '1px solid #cccccc',
    padding: '7px 14px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '12px'
  },
  excelBtn: {
    backgroundColor: '#000000', color: '#fff', border: 'none',
    padding: '7px 14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px'
  },
  pdfBtn: {
    backgroundColor: '#cc0000', color: '#fff', border: 'none',
    padding: '7px 14px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '12px'
  },
  restrictedNote: { fontSize: '11px', color: '#999999', fontStyle: 'italic' },
  emptyState: {
    textAlign: 'center', padding: '50px 20px'
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' },
  thead: { borderBottom: '2px solid #cccccc' },
  th: {
    padding: '10px 12px', color: '#333333', fontWeight: '600',
    fontSize: '11px', letterSpacing: '0.6px', backgroundColor: '#f5f5f5'
  },
  tr: { borderBottom: '1px solid #cccccc', transition: 'background-color 0.15s' },
  td: { padding: '12px 12px', color: '#000000' }
};

export default HistoryTable;
