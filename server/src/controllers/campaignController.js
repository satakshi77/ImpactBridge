const Campaign = require('../models/Campaign');
const Organization = require('../models/Organization');
const Milestone = require('../models/Milestone');
const ExpenseEntry = require('../models/ExpenseEntry');
const ProjectUpdate = require('../models/ProjectUpdate');
const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc Get all campaigns with search and filtering
exports.getCampaigns = async (req, res) => {
  try {
    const { cause, status, search, city, featured } = req.query;
    const filter = {};

    if (cause && cause !== 'All') {
      filter.causeArea = cause;
    }
    if (status && status !== 'All') {
      filter.status = status;
    } else if (!status) {
      filter.status = { $in: ['active', 'completed'] };
    }
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { beneficiaryGroup: { $regex: search, $options: 'i' } },
      ];
    }

    const campaigns = await Campaign.find(filter)
      .populate('organization', 'name logo verificationStatus causeAreas')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single campaign with full Impact Tracker suite
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('organization');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Fetch Milestones
    const milestones = await Milestone.find({ campaign: campaign._id }).sort({ orderIndex: 1 });

    // Fetch Expense Entries
    const expenses = await ExpenseEntry.find({ campaign: campaign._id }).sort({ date: -1 });

    // Fetch Project Updates / Stories
    const updates = await ProjectUpdate.find({ campaign: campaign._id }).sort({ publishedAt: -1 });

    // Fetch Recent Public Donations
    const recentDonations = await Donation.find({ campaign: campaign._id, paymentStatus: 'completed' })
      .populate('donor', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate Fund Utilization summary
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const budgetCategories = campaign.budgetPlan || [];

    const categoryBreakdown = budgetCategories.map((b) => {
      const spentForCat = expenses
        .filter((e) => e.category.toLowerCase().includes(b.category.toLowerCase()) || b.category.toLowerCase().includes(e.category.toLowerCase()))
        .reduce((sum, item) => sum + item.amount, 0);
      return {
        category: b.category,
        planned: b.plannedAmount,
        spent: spentForCat,
        remaining: Math.max(0, b.plannedAmount - spentForCat),
      };
    });

    res.json({
      success: true,
      campaign,
      impactTracker: {
        fundingTarget: campaign.fundingTarget,
        fundsRaised: campaign.fundsRaised,
        percentFunded: campaign.percentFunded,
        donorCount: campaign.donorCount,
        totalReportedSpent: totalSpent,
        unspentFunds: Math.max(0, campaign.fundsRaised - totalSpent),
        categoryBreakdown,
        milestones,
        expenses,
        updates,
        recentDonations: recentDonations.map((d) => ({
          _id: d._id,
          donorName: d.isAnonymous ? 'Kind Anonymous Supporter' : (d.donor?.name || 'Supporter'),
          donorAvatar: d.isAnonymous ? null : d.donor?.avatar,
          amount: d.amount,
          message: d.donorMessage,
          createdAt: d.createdAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create new campaign (NGO only)
exports.createCampaign = async (req, res) => {
  try {
    const org = await Organization.findOne({ user: req.user._id });
    if (!org) {
      return res.status(403).json({ success: false, message: 'You must have an organization profile to create campaigns' });
    }

    const {
      title,
      shortDescription,
      story,
      causeArea,
      fundingTarget,
      deadline,
      coverImage,
      location,
      beneficiaryGroup,
      budgetPlan,
      tags,
    } = req.body;

    const campaign = await Campaign.create({
      title,
      organization: org._id,
      shortDescription,
      story,
      causeArea,
      fundingTarget: Number(fundingTarget),
      deadline,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      location: location || { city: org.address?.city || 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090 },
      beneficiaryGroup: beneficiaryGroup || 'Local Community',
      budgetPlan: budgetPlan || [],
      tags: tags || [],
    });

    // Create initial milestone if provided
    if (req.body.initialMilestones && Array.isArray(req.body.initialMilestones)) {
      for (let i = 0; i < req.body.initialMilestones.length; i++) {
        const m = req.body.initialMilestones[i];
        await Milestone.create({
          campaign: campaign._id,
          organization: org._id,
          orderIndex: i + 1,
          title: m.title,
          description: m.description,
          targetBudget: m.targetBudget || 0,
          plannedCompletionDate: m.plannedCompletionDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'Not Started',
          measurableTarget: m.measurableTarget || { metric: 'Beneficiaries', targetValue: 100, currentValue: 0, unit: 'people' },
        });
      }
    }

    res.status(201).json({ success: true, campaign });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get campaigns for current NGO
exports.getMyNgoCampaigns = async (req, res) => {
  try {
    const org = await Organization.findOne({ user: req.user._id });
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization profile not found' });
    }
    const campaigns = await Campaign.find({ organization: org._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle campaign watchlist bookmark
exports.toggleSaveCampaign = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const campaignId = req.params.id;

    const isSaved = user.savedCampaigns.includes(campaignId);
    if (isSaved) {
      user.savedCampaigns = user.savedCampaigns.filter((id) => id.toString() !== campaignId);
    } else {
      user.savedCampaigns.push(campaignId);
    }
    await user.save();

    res.json({ success: true, saved: !isSaved, savedCampaigns: user.savedCampaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get donor's saved campaigns
exports.getSavedCampaigns = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedCampaigns',
      populate: { path: 'organization', select: 'name logo verificationStatus' },
    });
    res.json({ success: true, savedCampaigns: user.savedCampaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
