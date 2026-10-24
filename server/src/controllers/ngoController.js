const Organization = require('../models/Organization');
const Campaign = require('../models/Campaign');
const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const AuditLog = require('../models/AuditLog');

// @desc Get all verified or listed NGOs
exports.getAllNgos = async (req, res) => {
  try {
    const { cause, verified, search } = req.query;
    const filter = {};

    if (verified === 'true') filter.verificationStatus = 'verified';
    if (cause && cause !== 'All') filter.causeAreas = { $in: [cause] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
      ];
    }

    const organizations = await Organization.find(filter).sort({ totalRaised: -1 });
    res.json({ success: true, count: organizations.length, organizations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single NGO public profile
exports.getNgoById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    const campaigns = await Campaign.find({ organization: org._id, status: { $ne: 'draft' } }).sort({ createdAt: -1 });
    const opportunities = await VolunteerOpportunity.find({ organization: org._id, status: 'open' });

    res.json({
      success: true,
      organization: org,
      campaigns,
      opportunities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get currently logged-in NGO profile
exports.getMyNgoProfile = async (req, res) => {
  try {
    const org = await Organization.findOne({ user: req.user._id });
    if (!org) {
      return res.status(404).json({ success: false, message: 'No organization linked to this account' });
    }
    res.json({ success: true, organization: org });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update NGO profile
exports.updateNgoProfile = async (req, res) => {
  try {
    const org = await Organization.findOne({ user: req.user._id });
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    const fields = [
      'name',
      'tagline',
      'description',
      'registrationNumber',
      'causeAreas',
      'logo',
      'bannerImage',
      'website',
      'contactEmail',
      'contactPhone',
      'address',
      'coordinates',
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) org[f] = req.body[f];
    });

    await org.save();
    res.json({ success: true, organization: org });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Submit verification document
exports.submitVerification = async (req, res) => {
  try {
    const { title, fileUrl, documentType } = req.body;
    const org = await Organization.findOne({ user: req.user._id });

    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    org.verificationDocuments.push({
      title: title || 'Official Verification Certificate',
      fileUrl: fileUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      documentType: documentType || 'Registration Certificate',
      uploadedAt: new Date(),
    });

    org.verificationStatus = 'pending';
    await org.save();

    await AuditLog.create({
      action: 'NGO_SUBMITTED_DOCUMENTS',
      performedBy: req.user._id,
      targetType: 'Organization',
      targetId: org._id,
      details: `Submitted new verification document: ${documentType}`,
    });

    res.json({ success: true, message: 'Document submitted for administrative review', organization: org });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
