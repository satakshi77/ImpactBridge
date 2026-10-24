const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const Organization = require('../models/Organization');
const User = require('../models/User');
const Milestone = require('../models/Milestone');
const Notification = require('../models/Notification');

// @desc Create / simulate a donation
exports.createDonation = async (req, res) => {
  try {
    const { campaignId, amount, isAnonymous, donorMessage, paymentMethod, panNumber } = req.body;

    if (!campaignId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid campaign or donation amount' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const org = await Organization.findById(campaign.organization);

    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const transactionId = `TXN-IB-${timestamp}-${randomSuffix}`;
    const receiptNumber = `RCP-${new Date().getFullYear()}-${timestamp.toString().slice(-6)}-${randomSuffix}`;

    const donation = await Donation.create({
      campaign: campaign._id,
      organization: campaign.organization,
      donor: req.user._id,
      amount: Number(amount),
      currency: 'INR',
      paymentGateway: paymentMethod || 'Razorpay Test Sandbox',
      transactionId,
      receiptNumber,
      paymentStatus: 'completed',
      isAnonymous: Boolean(isAnonymous),
      donorMessage: donorMessage || '',
      taxExemption80G: true,
      panNumber: panNumber || '',
    });

    // Increment campaign fundsRaised and donorCount
    campaign.fundsRaised += Number(amount);
    campaign.donorCount += 1;
    await campaign.save();

    // Increment donor totalDonated
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalDonated: Number(amount) },
    });

    // Increment org totalRaised
    if (org) {
      org.totalRaised = (org.totalRaised || 0) + Number(amount);
      await org.save();
    }

    // In-app notification to donor
    await Notification.create({
      recipient: req.user._id,
      sender: org?.user,
      title: 'Donation Confirmed! 🎉',
      message: `Your contribution of ₹${Number(amount).toLocaleString('en-IN')} to "${campaign.title}" was successful. Receipt #${receiptNumber} generated.`,
      type: 'donation_success',
      link: `/donor/receipt/${donation._id}`,
    });

    // In-app notification to NGO
    if (org?.user) {
      await Notification.create({
        recipient: org.user,
        sender: req.user._id,
        title: 'New Donation Received! 💚',
        message: `${isAnonymous ? 'An anonymous supporter' : req.user.name} contributed ₹${Number(amount).toLocaleString('en-IN')} to "${campaign.title}".`,
        type: 'donation_success',
        link: `/campaigns/${campaign._id}`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully',
      donation,
      receipt: {
        receiptNumber,
        transactionId,
        amount: donation.amount,
        donorName: req.user.name,
        campaignTitle: campaign.title,
        organizationName: org ? org.name : 'ImpactBridge Partner',
        date: donation.createdAt,
      },
    });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get donor's donation history
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('campaign', 'title coverImage causeArea status percentFunded')
      .populate('organization', 'name logo')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: donations.length, donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get supported projects with live impact tracker progression
exports.getMySupportedProjects = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id, paymentStatus: 'completed' })
      .populate('campaign')
      .populate('organization');

    const projectMap = {};

    for (const d of donations) {
      if (!d.campaign) continue;
      const cId = d.campaign._id.toString();

      if (!projectMap[cId]) {
        projectMap[cId] = {
          campaign: d.campaign,
          organization: d.organization,
          firstDonationDate: d.createdAt,
          lastDonationDate: d.createdAt,
          myTotalContribution: 0,
          donationCount: 0,
        };
      }

      projectMap[cId].myTotalContribution += d.amount;
      projectMap[cId].donationCount += 1;
      if (new Date(d.createdAt) < new Date(projectMap[cId].firstDonationDate)) {
        projectMap[cId].firstDonationDate = d.createdAt;
      }
    }

    const supportedList = await Promise.all(
      Object.values(projectMap).map(async (item) => {
        const milestones = await Milestone.find({ campaign: item.campaign._id });
        const completedMilestones = milestones.filter((m) => m.status === 'Completed').length;
        return {
          ...item,
          totalMilestones: milestones.length,
          completedMilestones,
          milestonesProgressPercent: milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0,
        };
      })
    );

    res.json({ success: true, supportedProjects: supportedList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get donation receipt by ID
exports.getDonationReceipt = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('campaign', 'title causeArea')
      .populate('organization', 'name registrationNumber address contactEmail contactPhone logo')
      .populate('donor', 'name email');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation receipt not found' });
    }

    res.json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
