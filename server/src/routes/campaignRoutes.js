const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  getMyNgoCampaigns,
  toggleSaveCampaign,
  getSavedCampaigns,
} = require('../controllers/campaignController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleAuth');

router.get('/', getCampaigns);
router.get('/my/ngo', protect, authorizeRoles('ngo', 'admin'), getMyNgoCampaigns);
router.get('/saved', protect, getSavedCampaigns);
router.get('/:id', getCampaignById);
router.post('/', protect, authorizeRoles('ngo', 'admin'), createCampaign);
router.post('/:id/save', protect, toggleSaveCampaign);

module.exports = router;
