const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const Category = require('../models/Category');

// Helper to get user's budget from categories (for demo, hardcoded)
const getUserBudget = async (userId) => {
  // In production, fetch from user profile/settings
  return 1000; // Example: 1000 currency units per month
};

exports.addTransaction = async (req, res) => {
  let { type, amount, category, note, location } = req.body;
  let photo = req.file ? req.file.filename : null;
  const transaction = await Transaction.create({
    user: req.user._id, type, amount, category, note, photo, location
  });

  // Budget Alert Logic
  if (type === 'expense') {
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const expenses = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense', date: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = expenses[0]?.total || 0;
    const budget = await getUserBudget(req.user._id);
    if (totalExpenses > budget) {
      await Notification.create({
        user: req.user._id,
        message: `You have exceeded your monthly budget!`
      });
    } else if (totalExpenses > 0.9 * budget) {
      await Notification.create({
        user: req.user._id,
        message: `You are nearing your monthly budget limit.`
      });
    }
  }

  res.status(201).json(transaction);
};

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
  res.json(transactions);
};
