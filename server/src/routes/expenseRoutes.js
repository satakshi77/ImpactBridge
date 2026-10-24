const express = require('express');
const router = express.Router();
const { addExpense, getCampaignExpenses } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleAuth');

router.get('/campaign/:campaignId', getCampaignExpenses);
router.post('/', protect, authorizeRoles('ngo', 'admin'), addExpense);

module.exports = router;
