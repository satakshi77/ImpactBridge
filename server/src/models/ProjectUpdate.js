const mongoose = require('mongoose');

const projectUpdateSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    milestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone',
    },
    title: {
      type: String,
      required: [true, 'Update title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Update narrative is required'],
    },
    category: {
      type: String,
      enum: ['Milestone Completion', 'Field Photo Report', 'Fund Utilization Update', 'Community Impact Story', 'Urgent Notice'],
      default: 'Field Photo Report',
    },
    photos: [String],
    documents: [
      {
        title: String,
        url: String,
      },
    ],
    outcomeIndicators: [
      {
        label: String, // e.g., "Meals Distributed", "Trees Planted", "Water Filters Installed"
        value: Number,
        unit: String,
      },
    ],
    challengesFaced: {
      type: String,
      default: '',
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectUpdate', projectUpdateSchema);
