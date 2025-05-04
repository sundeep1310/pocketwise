const express = require('express');
const { exportPDF } = require('../controllers/reportController');
const protect = require('../middlewares/auth');
const router = express.Router();

router.get('/pdf', protect, exportPDF);

module.exports = router;