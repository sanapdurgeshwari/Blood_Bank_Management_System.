
const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');
const BloodStock = require('../models/BloodStock');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create blood request
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { bloodGroup, units, reason, hospital } = req.body;
    
    const newRequest = new BloodRequest({
      userId: req.user.id,
      userName: user.name,
      userRole: user.role,
      bloodGroup,
      units,
      reason,
      hospital
    });
    
    const request = await newRequest.save();
    
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all blood requests
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // Admin sees all requests
      const requests = await BloodRequest.find().sort({ requestDate: -1 });
      return res.json(requests);
    } else {
      // Users see only their requests
      const requests = await BloodRequest.find({ userId: req.user.id }).sort({ requestDate: -1 });
      return res.json(requests);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blood request status (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { status } = req.body;
    
    // Get the blood request first to have access to its details
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    
    // If approving, check blood stock before updating status
    if (status === 'approved') {
      const bloodStock = await BloodStock.findOne({ bloodGroup: request.bloodGroup });
      
      if (!bloodStock || bloodStock.units < request.units) {
        return res.status(400).json({ message: 'Insufficient blood stock' });
      }
      
      // Reduce blood stock
      bloodStock.units -= request.units;
      bloodStock.updatedAt = Date.now();
      await bloodStock.save();
    }
    
    // Update request status
    request.status = status;
    await request.save();
    
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;