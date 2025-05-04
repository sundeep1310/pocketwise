const express = require('express');
const { addGoal, getGoals, saveAmount } = require('../controllers/goalController');
const protect = require('../middlewares/auth');
const router = express.Router();

router.route('/')
  .post(protect, addGoal)
  .get(protect, getGoals);

router.post('/:id/save', protect, saveAmount);

module.exports = router;
