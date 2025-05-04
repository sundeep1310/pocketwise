const express = require('express');
const { getNotifications, markRead } = require('../controllers/notificationController');
const protect = require('../middlewares/auth');
const router = express.Router();

router.get('/', protect, getNotifications);
router.post('/mark-read', protect, markRead);

module.exports = router;
