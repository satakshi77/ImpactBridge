const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short summary is required'],
      maxlength: 300,
    },
    story: {
      type: String,
      required: [true, 'Campaign story is required'],
    },
    causeArea: {
      type: String,
      enum: [
        'Clean Water & Sanitation',
        'Quality Education',
        'Healthcare & Medical',
        'Environment & Climate',
        'Hunger & Nutrition',
        'Disaster Relief',
        'Women Empowerment',
        'Animal Welfare',
      ],
      required: true,
    },
    fundingTarget: {
      type: Number,
      required: [true, 'Funding target is required'],
      min: [100, 'Target must be at least 100'],
    },
    fundsRaised: {
      type: Number,
      default: 0,
    },
    donorCount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
      required: [true, 'Campaign deadline is required'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'draft', 'moderated'],
      default: 'active',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    },
    galleryImages: [String],
    location: {
      city: { type: String, default: 'New Delhi' },
      state: { type: String, default: 'Delhi' },
      country: { type: String, default: 'India' },
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.2090 },
    },
    beneficiaryGroup: {
      type: String,
      default: 'Community members in need',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    budgetPlan: [
      {
        category: {
          type: String,
          required: true,
        },
        plannedAmount: {
          type: Number,
          required: true,
        },
        description: String,
      },
    ],
    tags: [String],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for percentage funded
campaignSchema.virtual('percentFunded').get(function () {
  if (!this.fundingTarget || this.fundingTarget === 0) return 0;
  return Math.min(Math.round((this.fundsRaised / this.fundingTarget) * 100), 999);
});

module.exports = mongoose.model('Campaign', campaignSchema);
