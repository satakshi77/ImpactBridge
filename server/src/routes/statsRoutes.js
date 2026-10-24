const express = require('express');
const router = express.Router();
const {
  getPlatformOverview,
  getImpactMapData,
  getMyNotifications,
  markNotificationsRead,
} = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

router.get('/overview', getPlatformOverview);
router.get('/map', getImpactMapData);
router.get('/notifications', protect, getMyNotifications);
router.put('/notifications/mark-read', protect, markNotificationsRead);

module.exports = router;
