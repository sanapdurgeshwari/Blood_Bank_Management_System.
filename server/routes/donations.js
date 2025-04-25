
const express = require('express');
const router = express.Router();
const DonationRequest = require('../models/DonationRequest');
const BloodStock = require('../models/BloodStock');
const auth = require('../middleware/auth');

// Create donation request
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can create donation requests' });
    }
    
    const { bloodGroup, units, disease } = req.body;
    
    const newDonation = new DonationRequest({
      donorId: req.user.id,
      donorName: req.user.name,
      bloodGroup,
      units,
      disease
    });
    
    const donation = await newDonation.save();
    
    res.status(201).json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all donations (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const donations = await DonationRequest.find().sort({ requestDate: -1 });
      return res.json(donations);
    } else {
      // For donors, return only their donations
      const donations = await DonationRequest.find({ donorId: req.user.id }).sort({ requestDate: -1 });
      return res.json(donations);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update donation status (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { status } = req.body;
    
    const donation = await DonationRequest.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation request not found' });
    }
    
    donation.status = status;
    await donation.save();
    
    // If approved, update blood stock
    if (status === 'approved') {
      let bloodStock = await BloodStock.findOne({ bloodGroup: donation.bloodGroup });
      
      if (!bloodStock) {
        bloodStock = new BloodStock({
          bloodGroup: donation.bloodGroup,
          units: donation.units
        });
      } else {
        bloodStock.units += donation.units;
      }
      
      bloodStock.updatedAt = Date.now();
      await bloodStock.save();
    }
    
    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
