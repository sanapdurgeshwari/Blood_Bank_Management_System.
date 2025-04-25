
const mongoose = require('mongoose');

const DonationRequestSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donorName: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  units: {
    type: Number,
    required: true
  },
  disease: {
    type: String
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('DonationRequest', DonationRequestSchema);
