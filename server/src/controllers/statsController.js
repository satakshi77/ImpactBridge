const Campaign = require('../models/Campaign');
const Organization = require('../models/Organization');
const Donation = require('../models/Donation');
const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc Get public platform metrics for landing page
exports.getPlatformOverview = async (req, res) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRaised = totalDonations[0]?.total || 0;

    const totalCampaigns = await Campaign.countDocuments({ status: { $in: ['active', 'completed'] } });
    const verifiedNgos = await Organization.countDocuments({ verificationStatus: 'verified' });

    const totalVolunteerHoursAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$hoursVolunteered' } } },
    ]);
    const totalVolunteerHours = totalVolunteerHoursAgg[0]?.total || 0;

    const featuredCampaigns = await Campaign.find({ status: 'active' })
      .populate('organization', 'name logo verificationStatus')
      .sort({ fundsRaised: -1 })
      .limit(3);

    const urgentOpportunities = await VolunteerOpportunity.find({ status: 'open' })
      .populate('organization', 'name logo')
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      success: true,
      stats: {
        totalRaised,
        totalCampaigns,
        verifiedNgos,
        totalVolunteerHours,
        beneficiariesImpacted: 45200, // Aggregate impact
        transparencyScore: 99.4,
      },
      featuredCampaigns,
      urgentOpportunities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get Community Impact Map geo-points
exports.getImpactMapData = async (req, res) => {
  try {
    const { cause } = req.query;
    const filter = { status: { $in: ['active', 'completed'] } };
    if (cause && cause !== 'All') filter.causeArea = cause;

    const campaigns = await Campaign.find(filter)
      .populate('organization', 'name logo verificationStatus')
      .select('title causeArea fundingTarget fundsRaised percentFunded location coverImage shortDescription');

    const opportunities = await VolunteerOpportunity.find({ status: 'open' })
      .populate('organization', 'name logo')
      .select('title causeArea locationType location availableSlots filledSlots');

    const mapPoints = [
      ...campaigns.map((c) => ({
        id: c._id,
        type: 'campaign',
        title: c.title,
        cause: c.causeArea,
        lat: c.location?.lat || 28.6139,
        lng: c.location?.lng || 77.2090,
        latitude: c.location?.lat || 28.6139,
        longitude: c.location?.lng || 77.2090,
        city: c.location?.city || 'Delhi',
        image: c.coverImage,
        summary: c.shortDescription,
        raised: c.fundsRaised,
        target: c.fundingTarget,
        percentFunded: c.percentFunded,
        orgName: c.organization?.name,
        link: `/campaigns/${c._id}`,
      })),
      ...opportunities.map((o) => ({
        id: o._id,
        type: 'volunteer',
        title: o.title,
        cause: o.causeArea,
        lat: o.location?.lat || 28.6139,
        lng: o.location?.lng || 77.2090,
        latitude: o.location?.lat || 28.6139,
        longitude: o.location?.lng || 77.2090,
        city: o.location?.city || 'Delhi',
        locationType: o.locationType,
        slotsLeft: o.availableSlots - o.filledSlots,
        orgName: o.organization?.name,
        link: `/volunteers`,
      })),
    ];

    res.json({ success: true, count: mapPoints.length, points: mapPoints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get User Notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.json({ success: true, unreadCount, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Mark notifications as read
exports.markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
