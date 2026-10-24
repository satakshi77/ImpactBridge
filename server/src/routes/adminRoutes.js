const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getVerificationRequests,
  reviewNgoVerification,
  moderateCampaign,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleAuth');

router.use(protect, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/verifications', getVerificationRequests);
router.put('/verifications/:id', reviewNgoVerification);
router.put('/campaigns/:id/moderate', moderateCampaign);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
