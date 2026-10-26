const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'impactbridge_jwt_secret_college_demo_2026_super_secure', {
    expiresIn: '30d',
  });
};

// @desc Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, organizationName, registrationNumber, causeAreas } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'donor',
      skills: req.body.skills || [],
      interests: req.body.interests || [],
      availability: req.body.availability || 'Flexible',
    });

    let org = null;
    if (user.role === 'ngo') {
      org = await Organization.create({
        user: user._id,
        name: organizationName || `${name}'s Foundation`,
        registrationNumber: registrationNumber || `REG-${Date.now().toString().slice(-6)}`,
        description: req.body.description || 'Dedicated non-profit organization striving for sustainable social development.',
        contactEmail: email,
        causeAreas: causeAreas || ['Community Development'],
        verificationStatus: 'pending',
      });
    }

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        hoursVolunteered: user.hoursVolunteered,
        totalDonated: user.totalDonated,
      },
      organization: org,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(user._id);

    let org = null;
    if (user.role === 'ngo') {
      org = await Organization.findOne({ user: user._id });
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        skills: user.skills,
        availability: user.availability,
        hoursVolunteered: user.hoursVolunteered,
        totalDonated: user.totalDonated,
        isPublicProfile: user.isPublicProfile,
      },
      organization: org,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let org = null;
    if (user.role === 'ngo') {
      org = await Organization.findOne({ user: user._id });
    }
    res.json({ success: true, user, organization: org });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {};
    const allowed = ['name', 'phone', 'bio', 'location', 'skills', 'interests', 'availability', 'isPublicProfile', 'avatar'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) fieldsToUpdate[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Demo one-click switch for evaluations
exports.demoSwitch = async (req, res) => {
  try {
    const { role } = req.body; // 'admin', 'donor', 'volunteer', 'ngo'
    const targetRole = role || 'donor';
    let user = await User.findOne({ role: targetRole });

    if (!user) {
      const demoUsers = {
        admin: {
          name: 'Dr. Sarah Chen (Platform Admin)',
          email: 'admin@impactbridge.org',
          password: 'password123',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        },
        donor: {
          name: 'Alex Morgan (Donor)',
          email: 'alex.donor@example.com',
          password: 'password123',
          role: 'donor',
          totalDonated: 45000,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
        volunteer: {
          name: 'Priya Patel (Volunteer)',
          email: 'priya.volunteer@example.com',
          password: 'password123',
          role: 'volunteer',
          skills: ['Teaching', 'First Aid', 'Community Outreach'],
          hoursVolunteered: 24,
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        },
        ngo: {
          name: 'Sunita Rao (Green Earth Alliance)',
          email: 'greenearth@ngo.org',
          password: 'password123',
          role: 'ngo',
          avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
        },
      };

      const def = demoUsers[targetRole] || demoUsers.donor;
      user = await User.create(def);
    }

    const token = signToken(user._id);
    let org = null;
    if (user.role === 'ngo') {
      org = await Organization.findOne({ user: user._id });
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        skills: user.skills,
        availability: user.availability,
        hoursVolunteered: user.hoursVolunteered,
        totalDonated: user.totalDonated,
      },
      organization: org,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
