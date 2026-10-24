const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
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
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Donation must be at least 1'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentGateway: {
      type: String,
      default: 'Razorpay Sandbox (Simulated)',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ['completed', 'pending', 'failed', 'refunded'],
      default: 'completed',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    donorMessage: {
      type: String,
      default: '',
    },
    taxExemption80G: {
      type: Boolean,
      default: true,
    },
    panNumber: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
