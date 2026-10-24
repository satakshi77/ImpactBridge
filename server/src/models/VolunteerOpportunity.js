const mongoose = require('mongoose');

const volunteerOpportunitySchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Opportunity description is required'],
    },
    causeArea: {
      type: String,
      required: true,
    },
    requiredSkills: {
      type: [String],
      default: ['General Support'],
    },
    locationType: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site',
    },
    location: {
      city: { type: String, default: 'New Delhi' },
      address: { type: String, default: 'Community Center' },
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.2090 },
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    timeCommitment: {
      type: String,
      default: '3-4 hours / week',
    },
    availableSlots: {
      type: Number,
      default: 10,
    },
    filledSlots: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'filled', 'completed'],
      default: 'open',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    },
    responsibilities: [String],
    perks: [String], // e.g. "Verified Certificate", "T-shirt & Meals", "Letter of Recommendation"
  },
  { timestamps: true }
);

module.exports = mongoose.model('VolunteerOpportunity', volunteerOpportunitySchema);
