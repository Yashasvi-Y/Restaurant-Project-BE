require('dotenv').config();
const mongoose = require('mongoose');
const Staff = require('../models/Staff');

const mongoURI = process.env.MONGODB_URI || 
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

const staffMembers = [
  {
    name: 'Rayo Emma',
    role: 'Executive Chef',
    bio: 'Award-winning chef with 15+ years of culinary excellence. Specializes in contemporary fine dining with global influences.',
    speciality: 'Contemporary European & Fusion Cuisine',
    experienceYears: 15,
    certifications: ['CIA Culinary Arts', 'Michelin Training', 'Sommelier'],
    highlights: ['Michelin Star Chef', 'Best Chef 2023'],
    isActive: true,
    socialLinks: {
      instagram: '@rayo.emma',
      twitter: '@rayoemmachef',
      linkedin: 'rayo-emma-chef'
    }
  },
  {
    name: 'Liam Bennett',
    role: 'Executive Chef',
    bio: 'Creative culinary mind with expertise in sustainable cooking and seasonal menus. 12 years in fine dining.',
    speciality: 'Seasonal & Sustainable Cuisine',
    experienceYears: 12,
    certifications: ['CIA Culinary Arts', 'Sustainable Cooking Certification'],
    highlights: ['Green Chef Award', 'Innovation in Cuisine'],
    isActive: true,
    socialLinks: {
      instagram: '@liam.bennett.chef',
      twitter: '@liambennettcooking'
    }
  },
  {
    name: 'Aditya Joshi',
    role: 'Chef de Cuisine',
    bio: 'Passionate about Indian spice profiles and modern techniques. Brings authenticity with innovation.',
    speciality: 'Modern Indian & Asian Fusion',
    experienceYears: 10,
    certifications: ['Advanced Culinary Arts', 'Asian Cuisine Specialist'],
    highlights: ['Best Indian Chef 2022'],
    isActive: true,
    socialLinks: {
      instagram: '@aditya.joshi.kitchen'
    }
  },
  {
    name: 'Nguyen Minh',
    role: 'Pastry Maestro',
    bio: 'Master pastry chef with 8 years specializing in artisanal desserts and baking. Award-winning pastries.',
    speciality: 'French Pastry & Artisanal Baking',
    experienceYears: 8,
    certifications: ['French Pastry Diploma', 'Baking & Confectionery'],
    highlights: ['Best Pastry Chef 2023', 'Pastry Innovation Award'],
    isActive: true,
    socialLinks: {
      instagram: '@pastry_maestro_minh',
      twitter: '@nguyen_pastry'
    }
  },
  {
    name: 'Alejandro Torres',
    role: 'Sommelier',
    bio: 'Master Sommelier with expertise in wine pairings. 9 years of wine education and curation.',
    speciality: 'Wine Curation & Pairing',
    experienceYears: 9,
    certifications: ['Master Sommelier', 'Wine & Beverage Management', 'Spirits Education'],
    highlights: ['Master Sommelier Award', 'Best Wine List 2023'],
    isActive: true,
    socialLinks: {
      instagram: '@alejandro.sommelier',
      linkedin: 'alejandro-torres-sommelier'
    }
  },
  {
    name: 'Manyta Collins',
    role: 'Head Barista & Mixologist',
    bio: 'Expert in specialty coffee and craft cocktails. Creates signature drinks and coffee experiences.',
    speciality: 'Specialty Coffee & Craft Cocktails',
    experienceYears: 7,
    certifications: ['Certified Specialty Coffee Professional', 'Advanced Mixology'],
    highlights: ['Best Cocktail Creator 2022', 'Coffee Excellence Award'],
    isActive: true,
    socialLinks: {
      instagram: '@manyta.collins.bar'
    }
  },
  {
    name: 'Jean-Luc Dubois',
    role: 'Senior Waitstaff & Maître D\'',
    bio: 'Elegant service specialist with 11 years of fine dining experience. Master of guest relations.',
    speciality: 'Fine Dining Service & Hospitality',
    experienceYears: 11,
    certifications: ['Fine Dining Service Excellence', 'Guest Relations'],
    highlights: ['Best Service Professional 2023'],
    isActive: true,
    socialLinks: {
      linkedin: 'jean-luc-dubois'
    }
  },
  {
    name: 'Daniel Morgan',
    role: 'Waitstaff',
    bio: 'Professional server with 6 years in high-end restaurants. Exceptional attention to detail.',
    speciality: 'Guest Service & Menu Knowledge',
    experienceYears: 6,
    certifications: ['Restaurant Service Professional', 'Food Safety'],
    highlights: ['Guest Satisfaction Award'],
    isActive: true,
    socialLinks: {}
  },
  {
    name: 'Aisha Abdi',
    role: 'Guest Experience Manager',
    bio: 'Dedicated to creating memorable experiences. 7 years in hospitality management.',
    speciality: 'Guest Relations & Event Coordination',
    experienceYears: 7,
    certifications: ['Hospitality Management', 'Event Coordination'],
    highlights: ['Best Guest Experience Award 2023'],
    isActive: true,
    socialLinks: {
      linkedin: 'aisha-abdi-hospitality'
    }
  },
  {
    name: 'Fatoumata Diallo',
    role: 'Hygiene & Ambiance Specialist',
    bio: 'Creates pristine and welcoming dining environments. 5 years of facility management excellence.',
    speciality: 'Facility Management & Ambiance Curation',
    experienceYears: 5,
    certifications: ['Facility Management', 'Hygiene & Safety'],
    highlights: ['Best Cleanliness Award 2023'],
    isActive: true,
    socialLinks: {}
  }
];

async function seedStaff() {
  try {
    // Clear existing staff
    await Staff.deleteMany({});
    console.log('✓ Cleared existing staff members');

    // Insert new staff
    const result = await Staff.insertMany(staffMembers);
    console.log(`✓ Successfully added ${result.length} staff members to database\n`);

    // Display summary
    console.log('📋 Staff Members Added:');
    console.log('=======================');
    staffMembers.forEach((staff, index) => {
      console.log(`${index + 1}. ${staff.name} - ${staff.role} (${staff.experienceYears} years)`);
    });

    console.log('\n✅ Staff seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding staff:', error.message);
    process.exit(1);
  }
}

seedStaff();
