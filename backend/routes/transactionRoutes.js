const express = require('express');
const router = express.Router();
const Transaction = require('../models/ExpenseModel');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// @route  GET /api/transactions
// @desc   Get all transactions (with populated VO and SHG names)
// @access Private
router.get('/', protect, async (req, res) => {
  try {
    const { voId, type, limit = 100, page = 1 } = req.query;
    const filter = {};
    if (voId) filter.voId = voId;
    if (type) filter.type = type.toUpperCase();

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(filter)
      .populate('voId', 'name')
      .populate('shgId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      success: true,
      total,
      data: transactions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/transactions/income
// @desc   Add a new income transaction
// @access Private (Admin, VO Accountant)
router.post('/income', protect, restrictTo('Admin', 'VO Accountant'), async (req, res) => {
  try {
    const { voId, shgId, title, amount } = req.body;

    if (!voId || !title || !amount) {
      return res.status(400).json({ success: false, message: 'voId, title, and amount are required.' });
    }

    const transaction = await Transaction.create({
      voId,
      shgId: shgId || null,
      title,
      amount: parseFloat(amount),
      isIncome: true,
      type: 'INCOME',
      createdBy: req.user._id
    });

    const populated = await Transaction.findById(transaction._id)
      .populate('voId', 'name')
      .populate('shgId', 'name');

    res.status(201).json({ success: true, message: 'Income recorded successfully.', data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/transactions/expense
// @desc   Add a new expense transaction
// @access Private (Admin, VO Accountant)
router.post('/expense', protect, restrictTo('Admin', 'VO Accountant'), async (req, res) => {
  try {
    const { voId, shgId, title, amount } = req.body;

    if (!voId || !title || !amount) {
      return res.status(400).json({ success: false, message: 'voId, title, and amount are required.' });
    }

    const transaction = await Transaction.create({
      voId,
      shgId: shgId || null,
      title,
      amount: parseFloat(amount),
      isIncome: false,
      type: 'EXPENSE',
      createdBy: req.user._id
    });

    const populated = await Transaction.findById(transaction._id)
      .populate('voId', 'name')
      .populate('shgId', 'name');

    res.status(201).json({ success: true, message: 'Expense recorded successfully.', data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  DELETE /api/transactions/:id
// @desc   Delete a transaction (Admin only)
// @access Private/Admin
router.delete('/:id', protect, restrictTo('Admin'), async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }
    await transaction.deleteOne();
    res.json({ success: true, message: 'Transaction deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
