function SummaryCards({ totalIncome, totalExpense }) {
  const currentBalance = totalIncome - totalExpense;

  const cards = [
    {
      label: 'TOTAL INCOME',
      value: totalIncome,
      color: '#16a34a',
      bg: '#f0fdf4',
      border: '#16a34a',
      icon: '💰',
      prefix: '+'
    },
    {
      label: 'TOTAL EXPENSE',
      value: totalExpense,
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#dc2626',
      icon: '💸',
      prefix: '-'
    },
    {
      label: 'NET BALANCE',
      value: currentBalance,
      color: currentBalance >= 0 ? '#0ea5e9' : '#f97316',
      bg: currentBalance >= 0 ? '#f0f9ff' : '#fff7ed',
      border: currentBalance >= 0 ? '#0ea5e9' : '#f97316',
      icon: currentBalance >= 0 ? '📈' : '📉',
      prefix: currentBalance >= 0 ? '+' : ''
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '18px', marginBottom: '28px'
    }}>
      {cards.map(card => (
        <div key={card.label} style={{
          backgroundColor: card.bg, padding: '20px 22px', borderRadius: '12px',
          borderLeft: `5px solid ${card.border}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '18px' }}>{card.icon}</span>
            <p style={{ margin: 0, color: '#64748b', fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px' }}>
              {card.label}
            </p>
          </div>
          <h2 style={{ margin: 0, color: card.color, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Rs. {Math.abs(card.value).toFixed(2)}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
