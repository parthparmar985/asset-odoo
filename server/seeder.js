import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/assetflow');
    
    console.log('Connected. Checking for admin user...');
    
    const adminExists = await User.findOne({ email: 'admin@company.com' });
    
    if (adminExists) {
      // Ensure role is Admin just in case
      if (adminExists.role !== 'Admin') {
        adminExists.role = 'Admin';
        await adminExists.save();
        console.log('Admin user updated to ensure Admin role.');
      } else {
        console.log('Admin user already exists!');
      }
    } else {
      console.log('Creating Admin user...');
      const adminUser = new User({
        name: 'Super Admin',
        email: 'admin@company.com',
        password: 'admin', // The pre-save hook in User model will hash this!
        role: 'Admin'
      });
      await adminUser.save();
      console.log('Admin user successfully created! (email: admin@company.com, password: admin)');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
