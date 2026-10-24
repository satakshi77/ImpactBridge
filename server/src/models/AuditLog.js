const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true, // e.g. "NGO_VERIFIED", "CAMPAIGN_MODERATED", "DISCREPANCY_FLAGGED"
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['Organization', 'Campaign', 'Donation', 'Milestone', 'ExpenseEntry', 'User'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    previousStatus: String,
    newStatus: String,
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
