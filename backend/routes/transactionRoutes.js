const express = require('express');
const { addTransaction, getTransactions } = require('../controllers/transactionController');
const protect = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const router = express.Router();

router.route('/')
  .post(protect, upload.single('photo'), addTransaction)
  .get(protect, getTransactions);

module.exports = router;
