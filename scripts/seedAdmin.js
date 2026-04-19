const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log(`Email Verified: ${existingAdmin.isEmailVerified}\n`);
    } else {
      // Create admin user
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@testemail.com',
        password: 'admin321123', // Will be hashed by the pre-save hook
        phone: '1234567000',
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!\n');
      console.log('Admin Credentials:');
      console.log(`Email: admin@test.com`);
      console.log(`Password: admin123`);
      console.log(`Role: admin\n`);
    }

    // Also ensure any test customer exists
    let customerUser = await User.findOne({ email: 'customer@test.com' });
    
    if (!customerUser) {
      customerUser = new User({
        firstName: 'Test',
        lastName: 'Customer',
        email: 'customer@test.com',
        password: 'customer123',
        phone: '9876543210',
        role: 'customer',
        isEmailVerified: true,
        isActive: true,
      });
      await customerUser.save();
      console.log('✅ Test customer user created!\n');
      console.log('Customer Credentials:');
      console.log(`Email: customer@test.com`);
      console.log(`Password: customer123`);
      console.log(`Role: customer\n`);
    } else {
      console.log('ℹ️  Test customer already exists\n');
    }

    console.log('========================================');
    console.log('Seeding Complete!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
