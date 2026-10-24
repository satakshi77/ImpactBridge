const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, demoSwitch } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/demo-switch', demoSwitch);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
