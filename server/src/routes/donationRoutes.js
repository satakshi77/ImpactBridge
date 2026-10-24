const express = require('express');
const router = express.Router();
const {
  createDonation,
  getMyDonations,
  getMySupportedProjects,
  getDonationReceipt,
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createDonation);
router.get('/my', protect, getMyDonations);
router.get('/supported-projects', protect, getMySupportedProjects);
router.get('/receipt/:id', protect, getDonationReceipt);

module.exports = router;
