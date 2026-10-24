const express = require('express');
const router = express.Router();
const {
  getAllNgos,
  getNgoById,
  getMyNgoProfile,
  updateNgoProfile,
  submitVerification,
} = require('../controllers/ngoController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleAuth');

router.get('/', getAllNgos);
router.get('/profile/me', protect, authorizeRoles('ngo', 'admin'), getMyNgoProfile);
router.put('/profile/me', protect, authorizeRoles('ngo', 'admin'), updateNgoProfile);
router.post('/verification/submit', protect, authorizeRoles('ngo', 'admin'), submitVerification);
router.get('/:id', getNgoById);

module.exports = router;
