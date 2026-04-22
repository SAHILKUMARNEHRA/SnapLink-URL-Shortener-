import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  ipAddress: { type: String },
  country: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Unknown' },
  browser: { type: String, default: 'Unknown' }
}, {
  timestamps: true // Automatically handles the timestamp field
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
