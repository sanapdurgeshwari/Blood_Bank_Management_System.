
const mongoose = require('mongoose');

const BloodStockSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: true,
    unique: true
  },
  units: {
    type: Number,
    required: true,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BloodStock', BloodStockSchema);
