const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  voId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VO',
    required: true
  },
  shgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SHG',
    default: null
  },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  isIncome: { type: Boolean, required: true },
  type: {
    type: String,
    enum: ['INCOME', 'EXPENSE'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

TransactionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    // Format populated VO/SHG as plain name strings for frontend
    if (ret.voId && typeof ret.voId === 'object') {
      ret.vo = ret.voId.name;
      ret.voId = ret.voId._id ? ret.voId._id.toString() : ret.voId.toString();
    }
    if (ret.shgId && typeof ret.shgId === 'object') {
      ret.shg = ret.shgId.name;
      ret.shgId = ret.shgId._id ? ret.shgId._id.toString() : ret.shgId.toString();
    } else {
      ret.shg = 'N/A';
    }
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
