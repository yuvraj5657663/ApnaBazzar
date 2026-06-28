function SummaryCards({ totalIncome, totalExpense }) {
  const currentBalance = totalIncome - totalExpense;

  const cards = [
    {
      label: 'TOTAL INCOME',
      value: totalIncome,
      color: '#00cc00',
      bg: '#e6ffe6',
      border: '#00cc00',
      icon: '💰',
      prefix: '+'
    },
    {
      label: 'TOTAL EXPENSE',
      value: totalExpense,
      color: '#cc0000',
      bg: '#ffe6e6',
      border: '#cc0000',
      icon: '💸',
      prefix: '-'
    },
    {
      label: 'NET BALANCE',
      value: currentBalance,
      color: currentBalance >= 0 ? '#0066cc' : '#cc0000',
      bg: currentBalance >= 0 ? '#e6f0ff' : '#ffe6e6',
      border: currentBalance >= 0 ? '#0066cc' : '#cc0000',
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
            <p style={{ margin: 0, color: '#666666', fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px' }}>
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
