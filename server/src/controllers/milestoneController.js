const Milestone = require('../models/Milestone');
const Campaign = require('../models/Campaign');
const Organization = require('../models/Organization');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

// @desc Add milestone to campaign
exports.addMilestone = async (req, res) => {
  try {
    const { campaignId, title, description, targetBudget, plannedCompletionDate, measurableTarget } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const org = await Organization.findOne({ user: req.user._id });
    if (!org || campaign.organization.toString() !== org._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add milestones to this campaign' });
    }

    const count = await Milestone.countDocuments({ campaign: campaignId });

    const milestone = await Milestone.create({
      campaign: campaignId,
      organization: org._id,
      orderIndex: count + 1,
      title,
      description,
      targetBudget: targetBudget || 0,
      plannedCompletionDate,
      measurableTarget: measurableTarget || { metric: 'Beneficiaries', targetValue: 100, currentValue: 0, unit: 'people' },
      status: 'Not Started',
    });

    res.status(201).json({ success: true, milestone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update milestone status, measurable results, and evidence
exports.updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const org = await Organization.findOne({ user: req.user._id });
    if (!org || milestone.organization.toString() !== org._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this milestone' });
    }

    const { status, measurableTarget, proofEvidence, latestUpdateNote, actualSpend } = req.body;

    if (status) milestone.status = status;
    if (actualSpend !== undefined) milestone.actualSpend = actualSpend;
    if (latestUpdateNote) milestone.latestUpdateNote = latestUpdateNote;
    if (measurableTarget) {
      milestone.measurableTarget = {
        ...milestone.measurableTarget,
        ...measurableTarget,
      };
    }

    if (proofEvidence && Array.isArray(proofEvidence)) {
      milestone.proofEvidence.push(...proofEvidence);
    }

    if (status === 'Completed' && !milestone.actualCompletionDate) {
      milestone.actualCompletionDate = new Date();

      // Notify all donors who supported this campaign!
      const donations = await Donation.find({ campaign: milestone.campaign, paymentStatus: 'completed' });
      const donorUserIds = [...new Set(donations.map((d) => d.donor.toString()))];

      const campaign = await Campaign.findById(milestone.campaign);

      for (const donorId of donorUserIds) {
        await Notification.create({
          recipient: donorId,
          title: 'Milestone Completed! 🎯',
          message: `Milestone "${milestone.title}" has been completed for "${campaign?.title || 'a project you supported'}". Check out the new evidence and field report!`,
          type: 'milestone_completed',
          link: `/campaigns/${milestone.campaign}`,
        });
      }
    }

    milestone.lastUpdatedDate = new Date();
    await milestone.save();

    res.json({ success: true, milestone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get milestones for a campaign
exports.getCampaignMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({ campaign: req.params.campaignId }).sort({ orderIndex: 1 });
    res.json({ success: true, count: milestones.length, milestones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
