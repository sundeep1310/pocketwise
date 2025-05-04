const Category = require('../models/Category');
exports.addCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ user: req.user._id, name });
  res.status(201).json(category);
};
exports.getCategories = async (req, res) => {
  const categories = await Category.find({ user: req.user._id });
  res.json(categories);
};
