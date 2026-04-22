import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google Auth users
  googleId: { type: String },
  isAdmin: { type: Boolean, default: false }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);
export default User;
