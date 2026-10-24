const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration / 80G / 12A / FCRA number is required'],
      trim: true,
    },
    causeAreas: {
      type: [String],
      default: ['Community Development'],
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    },
    website: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      default: '',
    },
    address: {
      street: String,
      city: { type: String, default: 'New Delhi' },
      state: { type: String, default: 'Delhi' },
      country: { type: String, default: 'India' },
      pincode: String,
    },
    coordinates: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.2090 },
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'action_required'],
      default: 'pending',
    },
    verificationDocuments: [
      {
        title: String,
        fileUrl: String,
        documentType: {
          type: String,
          enum: ['Registration Certificate', 'Tax Exemption (80G/12A)', 'Annual Audited Report', 'FCRA Certificate', 'Govt ID Proof'],
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    verificationNotes: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
    },
    totalRaised: {
      type: Number,
      default: 0,
    },
    impactMetrics: {
      beneficiariesServed: { type: Number, default: 0 },
      volunteersEngaged: { type: Number, default: 0 },
      projectsCompleted: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', organizationSchema);
