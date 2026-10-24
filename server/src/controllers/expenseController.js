const ExpenseEntry = require('../models/ExpenseEntry');
const Campaign = require('../models/Campaign');
const Organization = require('../models/Organization');
const Milestone = require('../models/Milestone');

// @desc Add new expense entry to a campaign
exports.addExpense = async (req, res) => {
  try {
    const {
      campaignId,
      milestoneId,
      title,
      category,
      amount,
      date,
      vendor,
      description,
      receiptUrl,
      verificationLevel,
    } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const org = await Organization.findOne({ user: req.user._id });
    if (!org || campaign.organization.toString() !== org._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to log expenses for this campaign' });
    }

    const expense = await ExpenseEntry.create({
      campaign: campaignId,
      organization: org._id,
      milestone: milestoneId || null,
      title,
      category,
      amount: Number(amount),
      date: date || new Date(),
      vendor: vendor || 'Authorized Merchant / Supplier',
      description: description || '',
      receiptUrl: receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      verificationLevel: verificationLevel || 'Document/Receipt Attached',
    });

    // If milestone was specified, update actualSpend on milestone
    if (milestoneId) {
      await Milestone.findByIdAndUpdate(milestoneId, {
        $inc: { actualSpend: Number(amount) },
        lastUpdatedDate: new Date(),
      });
    }

    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get fund utilization and expense breakdown for a campaign
exports.getCampaignExpenses = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const expenses = await ExpenseEntry.find({ campaign: campaignId })
      .populate('milestone', 'title')
      .sort({ date: -1 });

    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const budgetCategories = campaign.budgetPlan || [];

    // Group expenses by category
    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const categoryBreakdown = budgetCategories.map((b) => {
      const spent = categoryTotals[b.category] || 0;
      return {
        category: b.category,
        plannedAmount: b.plannedAmount,
        actualSpent: spent,
        remainingBudget: Math.max(0, b.plannedAmount - spent),
        burnRatePercent: b.plannedAmount > 0 ? Math.min(Math.round((spent / b.plannedAmount) * 100), 100) : 0,
      };
    });

    res.json({
      success: true,
      summary: {
        fundingTarget: campaign.fundingTarget,
        fundsRaised: campaign.fundsRaised,
        totalReportedSpent: totalSpent,
        unspentFunds: Math.max(0, campaign.fundsRaised - totalSpent),
        categoryBreakdown,
      },
      expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
