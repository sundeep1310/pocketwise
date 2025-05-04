const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  note: { type: String },
  photo: { type: String },
  location: { type: String },
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Transaction', transactionSchema);
