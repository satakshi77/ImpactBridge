const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['donor', 'ngo', 'volunteer', 'admin'],
      default: 'donor',
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    phone: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      city: { type: String, default: 'New Delhi' },
      country: { type: String, default: 'India' },
    },
    // Volunteer specific profile fields
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: ['Weekends', 'Weekdays', 'Flexible', 'Evenings'],
      default: 'Flexible',
    },
    preferredLocationType: {
      type: String,
      enum: ['All', 'On-site', 'Remote'],
      default: 'All',
    },
    hoursVolunteered: {
      type: Number,
      default: 0,
    },
    // Donor specific stats & preferences
    totalDonated: {
      type: Number,
      default: 0,
    },
    isPublicProfile: {
      type: Boolean,
      default: true,
    },
    badges: [
      {
        name: String,
        description: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    savedCampaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
