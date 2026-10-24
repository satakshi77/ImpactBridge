const express = require('express');
const router = express.Router();
const {
  addMilestone,
  updateMilestone,
  getCampaignMilestones,
} = require('../controllers/milestoneController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleAuth');

router.get('/campaign/:campaignId', getCampaignMilestones);
router.post('/', protect, authorizeRoles('ngo', 'admin'), addMilestone);
router.put('/:id', protect, authorizeRoles('ngo', 'admin'), updateMilestone);

module.exports = router;
