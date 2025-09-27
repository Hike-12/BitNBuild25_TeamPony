const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TiffinVendor = require('../models/TiffinVendor');

// Register
router.post('/register', async (req, res) => {
  try {
    const { kitchen_name, address, phone_number, license_number, password } = req.body;
    if (!kitchen_name || !address || !phone_number || !license_number || !password)
      return res.status(400).json({ success: false, error: 'All fields required' });

    const exists = await TiffinVendor.findOne({ license_number });
    if (exists) return res.status(400).json({ success: false, error: 'License already exists' });

    const hash = await bcrypt.hash(password, 10);
    const vendor = await TiffinVendor.create({
      kitchen_name, address, phone_number, license_number, password: hash
    });

    const token = jwt.sign({ _id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { license_number, password } = req.body;
    const vendor = await TiffinVendor.findOne({ license_number });
    if (!vendor) return (res.status400).json({ success: false, error: 'Vendor not found' });

    const match = await bcrypt.compare(password, vendor.password);
    if (!match) return res.status(400).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ _id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;