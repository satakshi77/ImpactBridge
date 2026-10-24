const ProjectUpdate = require('../models/ProjectUpdate');
const Campaign = require('../models/Campaign');
const Organization = require('../models/Organization');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

// @desc Create project progress update with photo & evidence
exports.createUpdate = async (req, res) => {
  try {
    const { campaignId, milestoneId, title, content, category, photos, documents, outcomeIndicators, challengesFaced } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const org = await Organization.findOne({ user: req.user._id });
    if (!org || campaign.organization.toString() !== org._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to publish updates for this campaign' });
    }

    const update = await ProjectUpdate.create({
      campaign: campaignId,
      organization: org._id,
      milestone: milestoneId || null,
      title,
      content,
      category: category || 'Field Photo Report',
      photos: photos || ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'],
      documents: documents || [],
      outcomeIndicators: outcomeIndicators || [],
      challengesFaced: challengesFaced || '',
      publishedAt: new Date(),
    });

    // Notify all supporters of this project
    const donations = await Donation.find({ campaign: campaignId, paymentStatus: 'completed' });
    const donorUserIds = [...new Set(donations.map((d) => d.donor.toString()))];

    for (const donorId of donorUserIds) {
      await Notification.create({
        recipient: donorId,
        title: `New Progress Update: ${campaign.title}`,
        message: `The team posted: "${title}". See how your donation is driving real impact!`,
        type: 'campaign_update',
        link: `/campaigns/${campaignId}`,
      });
    }

    res.status(201).json({ success: true, update });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all updates for a campaign
exports.getCampaignUpdates = async (req, res) => {
  try {
    const updates = await ProjectUpdate.find({ campaign: req.params.campaignId })
      .populate('milestone', 'title')
      .sort({ publishedAt: -1 });

    res.json({ success: true, count: updates.length, updates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
