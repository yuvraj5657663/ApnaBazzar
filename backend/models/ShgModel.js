const mongoose = require('mongoose');

const ShgSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  voId: { type: mongoose.Schema.Types.ObjectId, ref: 'VO', required: true },
  createdAt: { type: Date, default: Date.now }
});

ShgSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('SHG', ShgSchema);
