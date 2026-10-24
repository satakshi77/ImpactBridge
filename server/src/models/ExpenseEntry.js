const mongoose = require('mongoose');

const expenseEntrySchema = new mongoose.Schema(
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
      required: [true, 'Expense title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Equipment & Materials',
        'Beneficiary Aid & Supplies',
        'Logistics & Transport',
        'Personnel & Field Honorarium',
        'Venue & Infrastructure',
        'Permits, Tests & Operations',
        'Other',
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than zero'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    vendor: {
      type: String,
      default: 'Authorized Vendor',
    },
    description: {
      type: String,
      default: '',
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    verificationLevel: {
      type: String,
      enum: ['NGO-Reported (Self-Declared)', 'Document/Receipt Attached', 'Independently Audited'],
      default: 'Document/Receipt Attached',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExpenseEntry', expenseEntrySchema);
