
const express = require('express');
const router = express.Router();
const BloodStock = require('../models/BloodStock');
const auth = require('../middleware/auth');

// Get all blood stock
router.get('/', async (req, res) => {
  try {
    const stocks = await BloodStock.find();
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blood stock (admin only)
router.put('/:bloodGroup', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { units } = req.body;
    
    let bloodStock = await BloodStock.findOne({ bloodGroup: req.params.bloodGroup });
    
    if (!bloodStock) {
      bloodStock = new BloodStock({
        bloodGroup: req.params.bloodGroup,
        units
      });
    } else {
      bloodStock.units = units;
    }
    
    bloodStock.updatedAt = Date.now();
    await bloodStock.save();
    
    res.json(bloodStock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
