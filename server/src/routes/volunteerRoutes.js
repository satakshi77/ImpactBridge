const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  applyForOpportunity,
  getMyApplications,
  getNgoApplications,
  reviewApplication,
  confirmAttendance,
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleAuth');

// Optional protect for smart matching: if token present, we parse user
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'impactbridge_jwt_secret_college_demo_2026_super_secure');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // ignore
    }
  }
  next();
};

router.get('/', optionalProtect, getOpportunities);
router.get('/my-applications', protect, authorizeRoles('volunteer', 'donor'), getMyApplications);
router.get('/ngo-applications', protect, authorizeRoles('ngo', 'admin'), getNgoApplications);
router.get('/:id', optionalProtect, getOpportunityById);
router.post('/', protect, authorizeRoles('ngo', 'admin'), createOpportunity);
router.post('/apply', protect, authorizeRoles('volunteer', 'donor'), applyForOpportunity);
router.put('/application/:id/review', protect, authorizeRoles('ngo', 'admin'), reviewApplication);
router.put('/application/:id/confirm-attendance', protect, authorizeRoles('ngo', 'admin'), confirmAttendance);

module.exports = router;
