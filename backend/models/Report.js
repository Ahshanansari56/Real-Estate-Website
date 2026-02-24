const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['sales', 'inventory', 'user-activity', 'revenue', 'custom'], required: true },
  description: { type: String },
  data: { type: mongoose.Schema.Types.Mixed },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filters: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
