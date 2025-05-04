const Notification = require('../models/Notification');
exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ date: -1 });
  res.json(notifications);
};
exports.markRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
};
