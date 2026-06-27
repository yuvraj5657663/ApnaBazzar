// Re-export Transaction model (income records are transactions with isIncome: true)
// Kept for backward compatibility
const Transaction = require('./ExpenseModel');
module.exports = Transaction;
