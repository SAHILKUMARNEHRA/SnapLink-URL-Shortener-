import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  qrCode: { type: String }, // Base64 data URI
  clicks: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Link = mongoose.model('Link', linkSchema);
export default Link;
