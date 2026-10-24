const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
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
    orderIndex: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Milestone description is required'],
    },
    targetBudget: {
      type: Number,
      required: true,
      default: 0,
    },
    actualSpend: {
      type: Number,
      default: 0,
    },
    plannedCompletionDate: {
      type: Date,
      required: true,
    },
    actualCompletionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Delayed'],
      default: 'Not Started',
    },
    measurableTarget: {
      metric: { type: String, default: 'Beneficiaries Reached' },
      targetValue: { type: Number, default: 100 },
      currentValue: { type: Number, default: 0 },
      unit: { type: String, default: 'people' },
    },
    proofEvidence: [
      {
        type: {
          type: String,
          enum: ['Photo', 'Report PDF', 'Receipt Slip', 'Field Certificate'],
          default: 'Photo',
        },
        title: String,
        url: String,
        note: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    latestUpdateNote: {
      type: String,
      default: '',
    },
    lastUpdatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

milestoneSchema.virtual('progressPercent').get(function () {
  if (this.status === 'Completed') return 100;
  if (this.measurableTarget && this.measurableTarget.targetValue > 0) {
    return Math.min(
      Math.round((this.measurableTarget.currentValue / this.measurableTarget.targetValue) * 100),
      100
    );
  }
  if (this.status === 'In Progress') return 50;
  return 0;
});

module.exports = mongoose.model('Milestone', milestoneSchema);
