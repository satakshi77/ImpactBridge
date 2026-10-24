const mongoose = require('mongoose');

const volunteerApplicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VolunteerOpportunity',
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    skillsOffered: [String],
    availabilityNote: {
      type: String,
      default: 'Available as per schedule',
    },
    motivation: {
      type: String,
      required: [true, 'Please provide a brief statement of interest'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'withdrawn'],
      default: 'pending',
    },
    hoursLogged: {
      type: Number,
      default: 0,
    },
    attendanceConfirmed: {
      type: Boolean,
      default: false,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    feedbackFromNGO: {
      type: String,
      default: '',
    },
    feedbackFromVolunteer: {
      type: String,
      default: '',
    },
    confirmedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
