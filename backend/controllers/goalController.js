const Goal = require('../models/Goal');

exports.addGoal = async (req, res) => {
  const { title, targetAmount, deadline } = req.body;
  const goal = await Goal.create({
    user: req.user._id, title, targetAmount, deadline
  });
  res.status(201).json(goal);
};

exports.getGoals = async (req, res) => {
  const goals = await Goal.find({ user: req.user._id });
  res.json(goals);
};

exports.saveAmount = async (req, res) => {
  const { amount } = req.body;
  const goal = await Goal.findById(req.params.id);
  
  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }
  
  if (goal.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  goal.savedAmount += parseFloat(amount);
  await goal.save();
  
  res.json(goal);
};
