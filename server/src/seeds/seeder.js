const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Organization = require('../models/Organization');
const Campaign = require('../models/Campaign');
const Milestone = require('../models/Milestone');
const ExpenseEntry = require('../models/ExpenseEntry');
const Donation = require('../models/Donation');
const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const VolunteerApplication = require('../models/VolunteerApplication');
const ProjectUpdate = require('../models/ProjectUpdate');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/impactbridge';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({}),
      Campaign.deleteMany({}),
      Milestone.deleteMany({}),
      ExpenseEntry.deleteMany({}),
      Donation.deleteMany({}),
      VolunteerOpportunity.deleteMany({}),
      VolunteerApplication.deleteMany({}),
      ProjectUpdate.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);
    console.log('[Seeder] Cleared previous collections...');

    // 1. Create Core Users
    // A. NGO User
    const ngoUser = await User.create({
      name: 'Sunita Rao (Green Earth Alliance)',
      email: 'greenearth@ngo.org',
      password: 'password123',
      role: 'ngo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      bio: 'Leading high-impact environmental sustainability and clean water programs across rural India since 2014.',
      phone: '+91 98112 34567',
      location: { city: 'New Delhi', country: 'India' },
    });

    // B. Donor User
    const donorUser = await User.create({
      name: 'Alex Morgan',
      email: 'alex.donor@example.com',
      password: 'password123',
      role: 'donor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Philanthropist passionate about education equity, clean water infrastructure, and measurable social ROI.',
      phone: '+91 99201 88442',
      location: { city: 'Bengaluru', country: 'India' },
      totalDonated: 45000,
      badges: [
        { name: 'Seed Giver', description: 'Made first community donation', icon: '🌱' },
        { name: 'Impact Champion', description: 'Funded over ₹25,000 with verified outcomes', icon: '🏆' },
        { name: 'Water Guardian', description: 'Supported 12 clean water filtration units', icon: '💧' },
      ],
    });

    // C. Volunteer User
    const volunteerUser = await User.create({
      name: 'Priya Patel',
      email: 'priya.volunteer@example.com',
      password: 'password123',
      role: 'volunteer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      bio: 'Final year Computer Science student & certified first responder passionate about digital literacy and environmental conservation.',
      phone: '+91 98765 43210',
      location: { city: 'New Delhi', country: 'India' },
      skills: ['Teaching', 'Digital Literacy', 'Social Media', 'Communication', 'First Aid'],
      interests: ['Quality Education', 'Environment & Climate', 'Clean Water & Sanitation'],
      availability: 'Weekends',
      preferredLocationType: 'All',
      hoursVolunteered: 24,
      badges: [
        { name: 'First Milestone', description: 'Completed first verified volunteer activity', icon: '⭐' },
        { name: 'Community Pillar', description: 'Over 20+ verified community service hours', icon: '🤝' },
      ],
    });

    // D. Admin User
    const adminUser = await User.create({
      name: 'Dr. Sarah Chen',
      email: 'admin@impactbridge.org',
      password: 'password123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      bio: 'Senior Compliance Director and Platform Administrator at ImpactBridge Trust Network.',
      phone: '+91 91234 56789',
      location: { city: 'Mumbai', country: 'India' },
    });

    // 2. Create Organizations
    const org1 = await Organization.create({
      user: ngoUser._id,
      name: 'Green Earth Alliance',
      tagline: 'Sustainable ecosystems, clean drinking water, and rural empowerment.',
      description: 'Green Earth Alliance works with tribal and drought-affected communities to restore indigenous watersheds, deploy solar desalination units, and cultivate community resilience.',
      registrationNumber: 'NGO-DEL-2015-8841A',
      causeAreas: ['Clean Water & Sanitation', 'Environment & Climate'],
      logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      website: 'https://greenearthalliance.ngo',
      contactEmail: 'contact@greenearthalliance.ngo',
      contactPhone: '+91 11 2654 9901',
      address: {
        street: '14 Vasant Kunj Institutional Area',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        pincode: '110070',
      },
      coordinates: { lat: 28.5244, lng: 77.1554 },
      verificationStatus: 'verified',
      verifiedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      verificationDocuments: [
        {
          title: 'Trust Registration & FCRA Approval',
          fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
          documentType: 'Registration Certificate',
          uploadedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Section 80G & 12A Tax Exemption',
          fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
          documentType: 'Tax Exemption (80G/12A)',
          uploadedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'FY 2025-26 Independent Audit Balance Sheet',
          fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
          documentType: 'Annual Audited Report',
          uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      ],
      totalRaised: 1165000,
      impactMetrics: {
        beneficiariesServed: 18400,
        volunteersEngaged: 320,
        projectsCompleted: 8,
      },
    });

    const org2 = await Organization.create({
      user: new mongoose.Types.ObjectId(),
      name: 'Asha Literacy Foundation',
      tagline: 'Bridging the digital divide for underserved girls.',
      description: 'Asha Foundation establishes solar-powered smart computer hubs and equips rural government schools with digital curricula.',
      registrationNumber: 'NGO-MUM-2018-4421B',
      causeAreas: ['Quality Education', 'Women Empowerment'],
      logo: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      contactEmail: 'contact@ashafoundation.org',
      address: { street: 'Bandra Kurla Complex', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
      coordinates: { lat: 19.0760, lng: 72.8777 },
      verificationStatus: 'verified',
      verifiedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      totalRaised: 840000,
      impactMetrics: { beneficiariesServed: 8200, volunteersEngaged: 180, projectsCompleted: 5 },
    });

    const org3 = await Organization.create({
      user: new mongoose.Types.ObjectId(),
      name: 'Sanjeevani Health Outreach',
      tagline: 'Mobile triage clinics and preventative medicine for informal settlements.',
      description: 'Delivering weekly doctor consultations, diagnostic screenings, and free medication directly into urban slums.',
      registrationNumber: 'NGO-BLR-2022-9118C',
      causeAreas: ['Healthcare & Medical'],
      logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      contactEmail: 'help@sanjeevanihealth.org',
      address: { street: 'Indiranagar 100ft Rd', city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      coordinates: { lat: 12.9716, lng: 77.5946 },
      verificationStatus: 'pending', // Pending for Admin review demo!
      verificationDocuments: [
        {
          title: 'Karnataka Societies Registration Certificate',
          fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
          documentType: 'Registration Certificate',
          uploadedAt: new Date(),
        },
      ],
      totalRaised: 340000,
    });

    // 3. Create Featured Campaigns
    // Campaign 1: Clean Water Barmer
    const camp1 = await Campaign.create({
      title: 'Clean Drinking Water for 12 Drought-Hit Villages in Barmer',
      slug: 'clean-drinking-water-barmer-villages',
      organization: org1._id,
      shortDescription: 'Installing 12 solar-powered reverse-osmosis filtration units in deep desert villages where fluorosis and salinity threaten over 6,400 villagers.',
      story: `Water is life, but in Barmer's Thar Desert, women and adolescent girls walk over 7 kilometers every day under 45°C heat to draw saline, fluoride-contaminated water from drying open wells. 

Our engineers and community organizers have formulated a decentralized, 100% solar-driven water purification system that produces 1,500 liters/hour of safe WHO-standard drinking water without recurring diesel costs. 

Through ImpactBridge, every single rupee donated will be tracked against physical hardware, water quality laboratory reports, and village water panchayat training records.`,
      causeArea: 'Clean Water & Sanitation',
      fundingTarget: 800000,
      fundsRaised: 620000,
      donorCount: 48,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active',
      coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
      location: { city: 'Barmer', state: 'Rajasthan', country: 'India', lat: 25.7532, lng: 71.4181 },
      beneficiaryGroup: '6,400 Desert Villagers & School Children',
      isFeatured: true,
      budgetPlan: [
        { category: 'Equipment & Materials', plannedAmount: 480000, description: '12 Solar RO Filtration units and submersible pumps' },
        { category: 'Logistics & Transport', plannedAmount: 140000, description: 'Heavy desert truck freight, crane installation & piping' },
        { category: 'Personnel & Field Honorarium', plannedAmount: 100000, description: 'Civil engineers, geologists, and village technicians' },
        { category: 'Permits, Tests & Operations', plannedAmount: 80000, description: 'NABL accredited pre/post water purity laboratory tests' },
      ],
      tags: ['Clean Water', 'Solar Energy', 'Desert Relief', 'Health'],
    });

    // Milestones for Campaign 1
    const m1_1 = await Milestone.create({
      campaign: camp1._id,
      organization: org1._id,
      orderIndex: 1,
      title: 'Hydrogeological Borewell Testing & Water Chemistry Analysis',
      description: 'Completed comprehensive aquifer testing across all 12 village sites. Confirmed groundwater yields and water chemistry profiles for custom RO membrane selection.',
      targetBudget: 80000,
      actualSpend: 78500,
      plannedCompletionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      actualCompletionDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      status: 'Completed',
      measurableTarget: { metric: 'Village Sites Tested', targetValue: 12, currentValue: 12, unit: 'villages' },
      latestUpdateNote: 'All 12 sites certified. TDS ranges from 2,400 to 4,100 ppm; high fluoride confirmed, validating RO membrane specs.',
      proofEvidence: [
        {
          type: 'Report PDF',
          title: 'NABL Certified Water Analysis Dossier',
          url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
          note: 'Signed test report validating raw salinity and required treatment thresholds.',
        },
        {
          type: 'Photo',
          title: 'Groundwater Sensor Deployment',
          url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
          note: 'Field hydrologist conducting electrical resistivity survey.',
        },
      ],
    });

    const m1_2 = await Milestone.create({
      campaign: camp1._id,
      organization: org1._id,
      orderIndex: 2,
      title: 'Solar RO Plant Fabrication & Delivery to Barmer',
      description: 'Procurement of weather-resistant photovoltaic solar panels, pumps, and SS316 food-grade filtration enclosures.',
      targetBudget: 420000,
      actualSpend: 395000,
      plannedCompletionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      actualCompletionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'Completed',
      measurableTarget: { metric: 'RO Units Fabricated & Delivered', targetValue: 12, currentValue: 12, unit: 'units' },
      latestUpdateNote: 'Convoy arrived in Barmer warehouse safely. Field technicians initiated foundation work.',
      proofEvidence: [
        {
          type: 'Photo',
          title: 'Unloading Solar Panels at Barmer Central Hub',
          url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
          note: 'High-efficiency mono-crystalline solar panels inspected and cleared.',
        },
        {
          type: 'Receipt Slip',
          title: 'Apex Solar Technologies Factory Delivery Receipt',
          url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
          note: 'Invoice #APX-2026-901 for ₹3,95,000.',
        },
      ],
    });

    const m1_3 = await Milestone.create({
      campaign: camp1._id,
      organization: org1._id,
      orderIndex: 3,
      title: 'Field Installation, Membrane Calibration & Community Taps',
      description: 'Mounting solar frames, connecting water pipes to overhead tanks, and establishing automated smart dispensing kiosks.',
      targetBudget: 220000,
      actualSpend: 110000,
      plannedCompletionDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'In Progress',
      measurableTarget: { metric: 'Plants Operational', targetValue: 12, currentValue: 8, unit: 'plants' },
      latestUpdateNote: '8 of 12 solar plants are active and delivering pristine water! The remaining 4 units are undergoing piping hookups.',
      proofEvidence: [
        {
          type: 'Photo',
          title: 'First Flow of Clean Water at Dhorimanna Village',
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
          note: 'Children celebrating first clean water flow test (TDS reduced to 110 ppm).',
        },
      ],
    });

    const m1_4 = await Milestone.create({
      campaign: camp1._id,
      organization: org1._id,
      orderIndex: 4,
      title: 'Village Water Committee Training & Long-term Operations Handover',
      description: 'Training 3 women and 2 youth per village on maintenance, membrane backwashing, and community tap stewardship.',
      targetBudget: 80000,
      actualSpend: 0,
      plannedCompletionDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'Not Started',
      measurableTarget: { metric: 'Committee Members Trained', targetValue: 60, currentValue: 0, unit: 'stewards' },
    });

    // Expenses for Campaign 1
    await ExpenseEntry.create([
      {
        campaign: camp1._id,
        organization: org1._id,
        milestone: m1_1._id,
        title: 'Hydrological Groundwater Survey & Sample Lab Testing',
        category: 'Permits, Tests & Operations',
        amount: 78500,
        date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        vendor: 'National Geo-Testing Labs Pvt Ltd',
        description: 'Comprehensive 12-village chemical and biological contamination assay.',
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        verificationLevel: 'Document/Receipt Attached',
      },
      {
        campaign: camp1._id,
        organization: org1._id,
        milestone: m1_2._id,
        title: 'Solar Panels, SS316 RO Enclosures & Inverters',
        category: 'Equipment & Materials',
        amount: 395000,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        vendor: 'Apex Solar Technologies Jaipur',
        description: 'Batch of 12 custom skid-mounted solar filtration modules with pumps.',
        receiptUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        verificationLevel: 'Independently Audited',
      },
      {
        campaign: camp1._id,
        organization: org1._id,
        milestone: m1_3._id,
        title: 'Heavy Transport Logistics & Desert Pipeline Freight',
        category: 'Logistics & Transport',
        amount: 68000,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        vendor: 'Thar Logistics Transport Co.',
        description: 'Trailer transport of solar structures from Jaipur to interior Barmer dunes.',
        receiptUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        verificationLevel: 'Document/Receipt Attached',
      },
      {
        campaign: camp1._id,
        organization: org1._id,
        milestone: m1_3._id,
        title: 'Civil Foundation Concrete & Piping Fittings',
        category: 'Equipment & Materials',
        amount: 42000,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        vendor: 'Marwar Hardware & Building Supplies',
        description: 'Cement plinths, shade sheds, and food-grade HDPE pipes for 8 villages.',
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        verificationLevel: 'NGO-Reported (Self-Declared)',
      },
    ]);

    // Project Updates for Campaign 1
    await ProjectUpdate.create([
      {
        campaign: camp1._id,
        organization: org1._id,
        milestone: m1_3._id,
        title: 'Major Milestone Reached: Clean Water Flowing in First 8 Desert Villages!',
        content: `Today is an unforgettable day for 4,200 residents of Dhorimanna, Gudamalani, and surrounding desert hamlets. The solar pumps were powered on at 9:15 AM under bright Thar sunshine. 

Within 20 minutes, crystal-clear, sweet water with a TDS of 110 ppm started pouring from the community distribution taps. Local village elders who have suffered from joint pain due to high fluoride levels expressed deep gratitude to every single ImpactBridge supporter.`,
        category: 'Milestone Completion',
        photos: [
          'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        ],
        outcomeIndicators: [
          { label: 'Villagers with Clean Water Access', value: 4200, unit: 'people' },
          { label: 'Hours Saved by Women per Day', value: 3.5, unit: 'hours/family' },
          { label: 'Liters Purified Daily', value: 18000, unit: 'liters' },
        ],
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ]);

    // Campaign 2: Solar Classrooms
    const camp2 = await Campaign.create({
      title: 'Solar Smart Classrooms for 15 Remote Tribal Schools',
      slug: 'solar-smart-classrooms-tribal-schools',
      organization: org2._id,
      shortDescription: 'Equipping 15 off-grid schools in Palghar with rooftop solar, digital offline smart TVs, interactive regional content, and STEM kits.',
      story: `Electricity outages in rural Palghar disrupt over 60% of school days. We are deploying plug-and-play solar power units paired with interactive smart learning stations loaded with Maharashtra State Board audio-visual lessons.`,
      causeArea: 'Quality Education',
      fundingTarget: 500000,
      fundsRaised: 545000,
      donorCount: 62,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'active',
      coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      location: { city: 'Palghar', state: 'Maharashtra', country: 'India', lat: 19.6967, lng: 72.7655 },
      beneficiaryGroup: '3,200 Tribal School Students',
      isFeatured: true,
      budgetPlan: [
        { category: 'Equipment & Materials', plannedAmount: 350000, description: '15 Smart 55" LED learning screens and 1kW rooftop solar setups' },
        { category: 'Personnel & Field Honorarium', plannedAmount: 90000, description: 'Digital curriculum trainer and technicians' },
        { category: 'Logistics & Transport', plannedAmount: 60000, description: 'Transport to remote hilly hamlets' },
      ],
      tags: ['Education', 'Solar', 'Tribal Youth', 'Digital Literacy'],
    });

    await Milestone.create([
      {
        campaign: camp2._id,
        organization: org2._id,
        orderIndex: 1,
        title: 'Solar Inverters and Digital Smart TVs Delivery',
        description: 'Delivered and mounted equipment across 15 government ashram schools.',
        targetBudget: 350000,
        actualSpend: 342000,
        plannedCompletionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        actualCompletionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        measurableTarget: { metric: 'Schools Equipped', targetValue: 15, currentValue: 15, unit: 'schools' },
        proofEvidence: [
          {
            type: 'Photo',
            title: 'Students engaging with the digital science lesson',
            url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
          },
        ],
      },
    ]);

    // Campaign 3: Healthcare Mobile Clinic
    const camp3 = await Campaign.create({
      title: 'Emergency Mobile Health Clinic for Urban Slum Settlements',
      slug: 'emergency-mobile-health-clinic-slums',
      organization: org1._id,
      shortDescription: 'Deploying a fully equipped customized diagnostic ambulance with doctor, nurse, ECG, and free pharmacy to 20 peri-urban bastis.',
      story: `Over 45,000 daily wage laborers in peri-urban industrial belts forfeit healthcare because visiting a government hospital means losing a day's livelihood. Our mobile clinic delivers free screenings right at their doorstep.`,
      causeArea: 'Healthcare & Medical',
      fundingTarget: 1200000,
      fundsRaised: 890000,
      donorCount: 74,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'active',
      coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946 },
      beneficiaryGroup: '45,000 Slum Residents',
      isFeatured: true,
      budgetPlan: [
        { category: 'Equipment & Materials', plannedAmount: 700000, description: 'Medical vehicle fabrication and diagnostic analyzers' },
        { category: 'Beneficiary Aid & Supplies', plannedAmount: 300000, description: 'Free generic antibiotics, diabetes, and hypertension medication' },
        { category: 'Personnel & Field Honorarium', plannedAmount: 200000, description: 'Doctor, lab technician, and nurse stipends' },
      ],
      tags: ['Healthcare', 'Mobile Clinic', 'Medical Aid'],
    });

    // 4. Create Pre-seeded Donations for Alex Morgan
    const don1 = await Donation.create({
      campaign: camp1._id,
      organization: org1._id,
      donor: donorUser._id,
      amount: 25000,
      currency: 'INR',
      paymentGateway: 'Razorpay Sandbox (Simulated)',
      transactionId: 'TXN-IB-2026-881290-771',
      receiptNumber: 'RCP-2026-004419',
      paymentStatus: 'completed',
      isAnonymous: false,
      donorMessage: 'Thrilled to back sustainable solar water access for the Barmer villages. Keep up the transparent reporting!',
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    });

    const don2 = await Donation.create({
      campaign: camp2._id,
      organization: org2._id,
      donor: donorUser._id,
      amount: 20000,
      currency: 'INR',
      paymentGateway: 'Razorpay Sandbox (Simulated)',
      transactionId: 'TXN-IB-2026-992144-882',
      receiptNumber: 'RCP-2026-005128',
      paymentStatus: 'completed',
      isAnonymous: false,
      donorMessage: 'Every child deserves access to modern digital education.',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    });

    // Save campaigns to Alex's watchlist
    donorUser.savedCampaigns = [camp1._id, camp2._id];
    await donorUser.save();

    // 5. Create Volunteer Opportunities
    const opp1 = await VolunteerOpportunity.create({
      organization: org1._id,
      campaign: camp1._id,
      title: 'Water Quality Field Testing & Community Surveyor',
      description: 'Assist our hydrology team in Barmer with portable water testing kits, conducting TDS, fluoride, and pH tests, and documenting feedback from beneficiary households.',
      causeArea: 'Clean Water & Sanitation',
      requiredSkills: ['Communication', 'First Aid', 'Teaching', 'General Support'],
      locationType: 'On-site',
      location: {
        city: 'New Delhi',
        address: 'Green Earth Field Center / Field site Barmer',
        lat: 28.5244,
        lng: 77.1554,
      },
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      timeCommitment: '4-6 hours / weekend',
      availableSlots: 15,
      filledSlots: 6,
      status: 'open',
      coverImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
      responsibilities: [
        'Collect clean water samples from village community taps',
        'Operate digital photometer water testing meters under supervision',
        'Interview beneficiary families and record water consumption shifts',
      ],
      perks: ['Verified ImpactBridge Service Certificate', 'Travel and meal stipend', 'Letter of Recommendation'],
    });

    const opp2 = await VolunteerOpportunity.create({
      organization: org2._id,
      campaign: camp2._id,
      title: 'Digital Literacy & Coding Mentor for High School Girls',
      description: 'Teach basic computer operations, internet safety, and introduction to Python programming through interactive weekend Zoom and hybrid workshops.',
      causeArea: 'Quality Education',
      requiredSkills: ['Teaching', 'Digital Literacy', 'Communication', 'Social Media'],
      locationType: 'Remote',
      location: {
        city: 'Mumbai',
        address: 'Online Virtual Classroom',
        lat: 19.0760,
        lng: 72.8777,
      },
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      timeCommitment: '3 hours / week (Saturdays)',
      availableSlots: 20,
      filledSlots: 8,
      status: 'open',
      coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      responsibilities: [
        'Lead interactive 60-minute weekend digital skills classes',
        'Review student exercises and provide encouraging feedback',
        'Inspire students towards STEM educational pathways',
      ],
      perks: ['Organization-Verified Service Record', 'Official Mentor Badge', 'Annual Changemaker Award Eligibility'],
    });

    const opp3 = await VolunteerOpportunity.create({
      organization: org1._id,
      title: 'Urban Afforestation & Miyawaki Forest Maintenance',
      description: 'Hands-on sapling planting, mulching, drip-irrigation layout, and tree health monitoring for our native biodiversity corridor in Delhi-NCR.',
      causeArea: 'Environment & Climate',
      requiredSkills: ['Outdoor Activities', 'Communication', 'First Aid'],
      locationType: 'On-site',
      location: {
        city: 'New Delhi',
        address: 'Aravalli Biodiversity Park, Vasant Kunj',
        lat: 28.5355,
        lng: 77.1512,
      },
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      timeCommitment: '3 hours / Sunday morning',
      availableSlots: 25,
      filledSlots: 14,
      status: 'open',
      coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      responsibilities: [
        'Plant native Indian saplings (Neem, Peepal, Jamun, Amaltas)',
        'Check natural soil moisture levels and organic compost layering',
      ],
      perks: ['Verified 4 Volunteer Hours per session', 'Refreshments provided', 'Eco-champion badge'],
    });

    // 6. Pre-seeded Volunteer Application for Priya Patel
    const app1 = await VolunteerApplication.create({
      opportunity: opp2._id,
      volunteer: volunteerUser._id,
      organization: org2._id,
      skillsOffered: ['Teaching', 'Digital Literacy', 'Communication'],
      availabilityNote: 'Free every Saturday morning 10 AM to 1 PM',
      motivation: 'As a computer science student, I want to ensure every young girl has the tools and confidence to create software.',
      status: 'completed',
      hoursLogged: 24,
      attendanceConfirmed: true,
      certificateIssued: true,
      feedbackFromNGO: 'Priya demonstrated outstanding patience and clarity. Her students achieved 95% completion on their digital projects!',
      confirmedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    // Another pending application for Priya on opp1 (so NGO can demonstrate "Approve Application" live in demo!)
    const app2 = await VolunteerApplication.create({
      opportunity: opp1._id,
      volunteer: volunteerUser._id,
      organization: org1._id,
      skillsOffered: ['Communication', 'First Aid'],
      availabilityNote: 'Available on upcoming weekend field testing trip',
      motivation: 'I want to experience field work firsthand and help test clean water purity in rural communities.',
      status: 'pending',
    });

    // 7. Pre-seeded In-App Notifications
    await Notification.create([
      {
        recipient: donorUser._id,
        title: 'Milestone Update for Barmer Project! 🎯',
        message: 'Milestone "Solar RO Plant Fabrication & Delivery" was marked Completed. 8 plants are now operational!',
        type: 'milestone_completed',
        link: `/campaigns/${camp1._id}`,
        isRead: false,
      },
      {
        recipient: donorUser._id,
        title: 'Donation Receipt Generated 🧾',
        message: 'Receipt #RCP-2026-004419 for ₹25,000 is ready for tax exemption download.',
        type: 'donation_success',
        link: `/donor/receipt/${don1._id}`,
        isRead: true,
      },
      {
        recipient: volunteerUser._id,
        title: 'Volunteer Certificate Issued! 🎖️',
        message: 'Asha Literacy Foundation confirmed 24 hours of service. Your verified certificate has been added to your Portfolio.',
        type: 'volunteer_confirmed',
        link: '/volunteer/portfolio',
        isRead: false,
      },
      {
        recipient: ngoUser._id,
        title: 'New Volunteer Application Received! 🤝',
        message: 'Priya Patel applied for "Water Quality Field Testing & Community Surveyor". Review and confirm her slots.',
        type: 'application_status',
        link: '/ngo/applications',
        isRead: false,
      },
    ]);

    // 8. Pre-seeded Audit Logs for Admin
    await AuditLog.create([
      {
        action: 'NGO_VERIFICATION_APPROVED',
        performedBy: adminUser._id,
        targetType: 'Organization',
        targetId: org1._id,
        previousStatus: 'pending',
        newStatus: 'verified',
        details: 'Verified Section 80G tax exemption, valid trust deed, and 3-year audited financial returns.',
      },
      {
        action: 'CAMPAIGN_MODERATION_APPROVED',
        performedBy: adminUser._id,
        targetType: 'Campaign',
        targetId: camp1._id,
        previousStatus: 'draft',
        newStatus: 'active',
        details: 'Approved campaign targets and milestone budget breakdown after feasibility review.',
      },
    ]);

    console.log('[Seeder] Database successfully populated with realistic high-fidelity data!');
    console.log('----------------------------------------------------');
    console.log('Demo Accounts:');
    console.log('1. NGO Admin:       greenearth@ngo.org   / password123');
    console.log('2. Donor:           alex.donor@example.com / password123');
    console.log('3. Volunteer:       priya.volunteer@example.com / password123');
    console.log('4. Platform Admin:  admin@impactbridge.org / password123');
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
