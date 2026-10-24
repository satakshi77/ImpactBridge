const express = require('express');
const router = express.Router();
const { createUpdate, getCampaignUpdates } = require('../controllers/updateController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleAuth');

router.get('/campaign/:campaignId', getCampaignUpdates);
router.post('/', protect, authorizeRoles('ngo', 'admin'), createUpdate);

module.exports = router;
