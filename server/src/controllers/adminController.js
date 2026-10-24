const Organization = require('../models/Organization');
const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Donation = require('../models/Donation');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

// @desc Admin Platform Overview & Statistics
exports.getAdminStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ paymentStatus: 'completed' });
    const totalRaisedAgg = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRaised = totalRaisedAgg[0]?.total || 0;

    const totalCampaigns = await Campaign.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
    const pendingVerifications = await Organization.countDocuments({ verificationStatus: 'pending' });
    const totalNgos = await Organization.countDocuments();
    const totalUsers = await User.countDocuments();

    const recentAuditLogs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .sort({ timestamp: -1, createdAt: -1 })
      .limit(10);

    const recentDonations = await Donation.find()
      .populate('campaign', 'title')
      .populate('donor', 'name email')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      stats: {
        totalRaised,
        totalDonations,
        totalCampaigns,
        activeCampaigns,
        pendingVerifications,
        totalNgos,
        totalUsers,
      },
      recentAuditLogs,
      recentDonations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all verification requests
exports.getVerificationRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.verificationStatus = status;

    const organizations = await Organization.find(filter)
      .populate('user', 'name email createdAt')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: organizations.length, organizations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Verify, Reject, or Request Action for an NGO
exports.reviewNgoVerification = async (req, res) => {
  try {
    const { status, notes } = req.body; // 'verified', 'rejected', 'action_required'
    const org = await Organization.findById(req.params.id);

    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    const previousStatus = org.verificationStatus;
    org.verificationStatus = status;
    org.verificationNotes = notes || '';
    if (status === 'verified') org.verifiedAt = new Date();
    await org.save();

    // Log administrative action in audit trail
    await AuditLog.create({
      action: `NGO_VERIFICATION_${status.toUpperCase()}`,
      performedBy: req.user._id,
      targetType: 'Organization',
      targetId: org._id,
      previousStatus,
      newStatus: status,
      details: notes || `Organization verification marked as ${status}`,
    });

    // Notify NGO
    await Notification.create({
      recipient: org.user,
      title: `Organization Verification Status: ${status.replace('_', ' ').toUpperCase()}`,
      message: `Your verification status was updated to "${status}". Notes: ${notes || 'Reviewed by admin team.'}`,
      type: 'verification_status',
      link: '/ngo/profile',
    });

    res.json({ success: true, message: `Organization successfully marked as ${status}`, organization: org });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Moderate Campaign (Approve, Pause, Moderate)
exports.moderateCampaign = async (req, res) => {
  try {
    const { status, reason } = req.body; // 'active', 'paused', 'moderated'
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const previousStatus = campaign.status;
    campaign.status = status;
    await campaign.save();

    // Create Audit Log
    await AuditLog.create({
      action: `CAMPAIGN_MODERATED_${status.toUpperCase()}`,
      performedBy: req.user._id,
      targetType: 'Campaign',
      targetId: campaign._id,
      previousStatus,
      newStatus: status,
      details: reason || `Admin updated status to ${status}`,
    });

    res.json({ success: true, message: `Campaign status updated to ${status}`, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get complete audit logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
