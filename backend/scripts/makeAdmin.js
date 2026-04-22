import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import db from '../config/db.js';

dotenv.config();

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email address. Usage: npm run make-admin <email>');
    process.exit(1);
  }

  try {
    await db.connect();
    
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();
    
    console.log(`Success! User ${email} is now an Admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error making user admin:', error);
    process.exit(1);
  }
};

makeAdmin();
