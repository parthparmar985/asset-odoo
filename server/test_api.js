import axios from 'axios';
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const testEndpoints = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/assetflow');
    const user = await User.findOne({ email: 'admin@company.com' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
    
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    const endpoints = [
      '/api/assets',
      '/api/allocations',
      '/api/bookings',
      '/api/maintenance',
      '/api/departments',
      '/api/categories',
      '/api/auth/users'
    ];

    for (const ep of endpoints) {
      try {
        await axios.get(`http://localhost:5000${ep}`, config);
        console.log(`✅ ${ep} OK`);
      } catch (err) {
        console.log(`❌ ${ep} FAILED:`, err.response?.data || err.message);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testEndpoints();
