const express = require('express');
const { addCategory, getCategories } = require('../controllers/categoryController');
const protect = require('../middlewares/auth');
const router = express.Router();

router.route('/')
  .post(protect, addCategory)
  .get(protect, getCategories);

module.exports = router;
