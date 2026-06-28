function AnalyticsCharts({ transactions }) {
  // Safe array fallback mechanism taaki data undefined hone par screen blank na ho
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // 1. Calculate Income vs Expense for Donut Chart securely
  const incomeSum = safeTransactions
    .filter(t => t && (t.isIncome === true || t.type === 'INCOME'))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const expenseSum = safeTransactions
    .filter(t => t && (t.isIncome === false || t.type === 'EXPENSE'))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalVolume = incomeSum + expenseSum;

  // Donut chart mathematics logic checks
  const incomePercentage = totalVolume > 0 ? (incomeSum / totalVolume) * 100 : 0;
  const expensePercentage = totalVolume > 0 ? (expenseSum / totalVolume) * 100 : 0;
  
  const circumference = 2 * Math.PI * 40; // 251.2
  const incomeStrokeDash = totalVolume > 0 ? (incomePercentage / 100) * circumference : 0;

  // 2. Calculate Category-wise distribution securely
  const categories = {};
  safeTransactions.forEach(t => {
    if (!t) return;
    const catName = t.title || 'Other';
    categories[catName] = (categories[catName] || 0) + Number(t.amount || 0);
  });

  // Get top 4 drivers array data safely
  const sortedCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const maxCategoryAmount = sortedCategories.length > 0 ? Math.max(...sortedCategories.map(c => c[1])) : 1;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '40px' }}>
      
      {/* WIDGET A: CASH FLOW RATIO (DONUT CHART) */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h4 style={{ margin: '0 0 20px 0', color: '#000000', alignSelf: 'flex-start', fontSize: '16px', fontWeight: 'bold', borderBottom: '2px solid #0066cc', paddingBottom: '6px' }}>
          💵 CASH FLOW RATIO
        </h4>
        
        {totalVolume === 0 ? (
          <p style={{ color: '#666666', fontSize: '13px', margin: '40px 0' }}>No chart data available yet.</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', width: '100%', justifyContent: 'center' }}>
            <svg width="140" height="140" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#cc0000" strokeWidth="12" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00cc00" strokeWidth="12" 
                strokeDasharray={`${incomeStrokeDash} ${circumference}`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              <circle cx="50" cy="50" r="28" fill="white" />
            </svg>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', color: '#000000' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: '#00cc00', borderRadius: '3px' }}></span>
                  Income ({incomePercentage.toFixed(0)}%)
                </div>
                <span style={{ fontSize: '12px', color: '#666666', marginLeft: '20px' }}>Rs. {incomeSum.toFixed(2)}</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', color: '#000000' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: '#cc0000', borderRadius: '3px' }}></span>
                  Expense ({expensePercentage.toFixed(0)}%)
                </div>
                <span style={{ fontSize: '12px', color: '#666666', marginLeft: '20px' }}>Rs. {expenseSum.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WIDGET B: TOP TRANSACTION TITLES (HORIZONTAL BAR CHART) */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h4 style={{ margin: '0 0 20px 0', color: '#000000', fontSize: '16px', fontWeight: 'bold', borderBottom: '2px solid #0066cc', paddingBottom: '6px' }}>
          📈 TOP VOLUME DRIVERS
        </h4>

        {sortedCategories.length === 0 ? (
          <p style={{ color: '#666666', fontSize: '13px', textAlign: 'center', margin: '40px 0' }}>Add transactions to generate volume metrics.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sortedCategories.map(([title, amount]) => {
              const barWidth = (amount / maxCategoryAmount) * 100;
              return (
                <div key={title}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: '#333333', marginBottom: '4px' }}>
                    <span style={{ textTransform: 'uppercase' }}>{title}</span>
                    <span style={{ color: '#000000' }}>Rs. {amount.toFixed(2)}</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${barWidth}%`, 
                      height: '100%', 
                      backgroundColor: '#0066cc', 
                      borderRadius: '5px',
                      transition: 'width 0.5s ease-in-out'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default AnalyticsCharts;