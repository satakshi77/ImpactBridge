const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const VolunteerApplication = require('../models/VolunteerApplication');
const Organization = require('../models/Organization');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Rule-based Smart Matching Helper
const computeMatchScore = (user, opp) => {
  if (!user || user.role !== 'volunteer') {
    return { score: 75, reasons: ['General Community Opportunity'] };
  }

  let score = 50;
  const reasons = [];

  // Skill matching (+30 max)
  const userSkills = (user.skills || []).map((s) => s.toLowerCase());
  const oppSkills = (opp.requiredSkills || []).map((s) => s.toLowerCase());
  const matchedSkills = userSkills.filter((s) =>
    oppSkills.some((os) => os.includes(s) || s.includes(os))
  );

  if (matchedSkills.length > 0) {
    const skillBonus = Math.min(matchedSkills.length * 15, 30);
    score += skillBonus;
    reasons.push(`Direct skill match: ${matchedSkills.slice(0, 2).join(', ')}`);
  }

  // Cause Interest (+15)
  const userInterests = (user.interests || []).map((i) => i.toLowerCase());
  const matchedCause = userInterests.some((i) =>
    opp.causeArea.toLowerCase().includes(i) || i.includes(opp.causeArea.toLowerCase())
  );
  if (matchedCause) {
    score += 15;
    reasons.push(`Aligns with your chosen cause: ${opp.causeArea}`);
  }

  // Location / Remote match (+10)
  if (opp.locationType === 'Remote') {
    score += 10;
    reasons.push('Remote opportunity matching any schedule');
  } else if (
    user.location?.city &&
    opp.location?.city &&
    user.location.city.toLowerCase() === opp.location.city.toLowerCase()
  ) {
    score += 10;
    reasons.push(`Local opportunity in your city (${opp.location.city})`);
  }

  return {
    score: Math.min(score, 98),
    reasons: reasons.length > 0 ? reasons : ['Open opportunity for committed change-makers'],
  };
};

// @desc Get volunteer opportunities with smart matching for user
exports.getOpportunities = async (req, res) => {
  try {
    const { cause, locationType, skill, search } = req.query;
    const filter = { status: { $in: ['open', 'in_progress'] } };

    if (cause && cause !== 'All') filter.causeArea = cause;
    if (locationType && locationType !== 'All') filter.locationType = locationType;
    if (skill) filter.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const opps = await VolunteerOpportunity.find(filter)
      .populate('organization', 'name logo verificationStatus address')
      .populate('campaign', 'title coverImage')
      .sort({ createdAt: -1 });

    // If user is authenticated volunteer, attach smart match computation!
    const opportunitiesWithMatch = opps.map((opp) => {
      const matchData = computeMatchScore(req.user, opp);
      return {
        ...opp.toObject(),
        matchScore: matchData.score,
        matchReasons: matchData.reasons,
      };
    });

    // Sort by matchScore if user logged in
    if (req.user && req.user.role === 'volunteer') {
      opportunitiesWithMatch.sort((a, b) => b.matchScore - a.matchScore);
    }

    res.json({ success: true, count: opportunitiesWithMatch.length, opportunities: opportunitiesWithMatch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single volunteer opportunity
exports.getOpportunityById = async (req, res) => {
  try {
    const opp = await VolunteerOpportunity.findById(req.params.id)
      .populate('organization', 'name logo description verificationStatus contactEmail')
      .populate('campaign', 'title coverImage causeArea');

    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const matchData = computeMatchScore(req.user, opp);

    res.json({
      success: true,
      opportunity: {
        ...opp.toObject(),
        matchScore: matchData.score,
        matchReasons: matchData.reasons,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create volunteer opportunity (NGO only)
exports.createOpportunity = async (req, res) => {
  try {
    const org = await Organization.findOne({ user: req.user._id });
    if (!org) {
      return res.status(403).json({ success: false, message: 'Organization profile required' });
    }

    const {
      title,
      description,
      causeArea,
      requiredSkills,
      locationType,
      location,
      startDate,
      endDate,
      timeCommitment,
      availableSlots,
      responsibilities,
      perks,
      coverImage,
      campaignId,
    } = req.body;

    const opp = await VolunteerOpportunity.create({
      organization: org._id,
      campaign: campaignId || null,
      title,
      description,
      causeArea,
      requiredSkills: requiredSkills || ['General Support'],
      locationType: locationType || 'On-site',
      location: location || { city: org.address?.city || 'New Delhi', address: org.address?.street || 'Community Center' },
      startDate,
      endDate,
      timeCommitment: timeCommitment || '3-4 hours/week',
      availableSlots: Number(availableSlots) || 10,
      responsibilities: responsibilities || [],
      perks: perks || ['Volunteer Certificate', 'Impact Badge', 'Meals Provided'],
      coverImage: coverImage || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    });

    res.status(201).json({ success: true, opportunity: opp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Apply for a volunteer opportunity
exports.applyForOpportunity = async (req, res) => {
  try {
    const { opportunityId, motivation, skillsOffered, availabilityNote } = req.body;

    const opp = await VolunteerOpportunity.findById(opportunityId);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    if (opp.filledSlots >= opp.availableSlots) {
      return res.status(400).json({ success: false, message: 'This opportunity is already full' });
    }

    const existingApplication = await VolunteerApplication.findOne({
      opportunity: opportunityId,
      volunteer: req.user._id,
    });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this opportunity' });
    }

    const application = await VolunteerApplication.create({
      opportunity: opportunityId,
      volunteer: req.user._id,
      organization: opp.organization,
      motivation,
      skillsOffered: skillsOffered || req.user.skills || [],
      availabilityNote: availabilityNote || req.user.availability,
      status: 'pending',
    });

    // Notify NGO
    const org = await Organization.findById(opp.organization);
    if (org?.user) {
      await Notification.create({
        recipient: org.user,
        sender: req.user._id,
        title: 'New Volunteer Application! 🤝',
        message: `${req.user.name} applied for "${opp.title}".`,
        type: 'application_status',
        link: '/ngo/applications',
      });
    }

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get volunteer's applications & verified portfolio
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({ volunteer: req.user._id })
      .populate('opportunity')
      .populate('organization', 'name logo verificationStatus address')
      .sort({ createdAt: -1 });

    const totalHours = applications.reduce((sum, app) => sum + (app.hoursLogged || 0), 0);
    const confirmedCount = applications.filter((app) => app.attendanceConfirmed).length;

    res.json({
      success: true,
      stats: {
        totalApplications: applications.length,
        confirmedActivities: confirmedCount,
        confirmedHours: totalHours,
      },
      applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc NGO: Get all volunteer applications for NGO
exports.getNgoApplications = async (req, res) => {
  try {
    const org = await Organization.findOne({ user: req.user._id });
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    const applications = await VolunteerApplication.find({ organization: org._id })
      .populate('opportunity', 'title causeArea locationType startDate')
      .populate('volunteer', 'name email avatar phone skills availability')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc NGO: Review Application (Approve / Reject)
exports.reviewApplication = async (req, res) => {
  try {
    const { status, feedback } = req.body; // 'approved' or 'rejected'
    const application = await VolunteerApplication.findById(req.params.id)
      .populate('opportunity')
      .populate('volunteer');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    if (feedback) application.feedbackFromNGO = feedback;

    if (status === 'approved') {
      await VolunteerOpportunity.findByIdAndUpdate(application.opportunity._id, {
        $inc: { filledSlots: 1 },
      });
    }
    await application.save();

    // Notify Volunteer
    await Notification.create({
      recipient: application.volunteer._id,
      title: status === 'approved' ? 'Application Approved! 🌟' : 'Application Update',
      message:
        status === 'approved'
          ? `Your application for "${application.opportunity.title}" has been approved! The NGO team is excited to have you.`
          : `Update regarding your application for "${application.opportunity.title}".`,
      type: 'application_status',
      link: '/volunteer/applications',
    });

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc NGO: Confirm Attendance and Log Verified Volunteer Hours
exports.confirmAttendance = async (req, res) => {
  try {
    const { hoursLogged, feedback } = req.body;
    const application = await VolunteerApplication.findById(req.params.id)
      .populate('opportunity')
      .populate('volunteer');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const hours = Number(hoursLogged) || 4;
    application.attendanceConfirmed = true;
    application.status = 'completed';
    application.hoursLogged = hours;
    application.certificateIssued = true;
    application.confirmedAt = new Date();
    if (feedback) application.feedbackFromNGO = feedback;
    await application.save();

    // Increment user hoursVolunteered
    await User.findByIdAndUpdate(application.volunteer._id, {
      $inc: { hoursVolunteered: hours },
    });

    // Notify Volunteer
    await Notification.create({
      recipient: application.volunteer._id,
      title: 'Hours Confirmed & Certificate Ready! 🎖️',
      message: `${hours} hours confirmed for "${application.opportunity.title}". Certificate added to your personal impact portfolio!`,
      type: 'volunteer_confirmed',
      link: '/volunteer/portfolio',
    });

    res.json({ success: true, message: 'Volunteer attendance and hours confirmed', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
