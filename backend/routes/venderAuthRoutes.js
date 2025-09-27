const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TiffinVendor = require('../models/TiffinVendor');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, business_name, address, phone_number, license_number, password } = req.body;
    if (!username || !email || !business_name || !address || !phone_number || !license_number || !password)
      return res.status(400).json({ success: false, error: 'All fields required' });

    const exists = await TiffinVendor.findOne({ $or: [{ username }, { email }, { license_number }] });
    if (exists) return res.status(400).json({ success: false, error: 'Username, email, or license already exists' });

    const hash = await bcrypt.hash(password, 10);
    const vendor = await TiffinVendor.create({
      username, email, business_name, address, phone_number, license_number, password: hash
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
    const { identifier, password } = req.body; // identifier can be username, email, or license_number
    const vendor = await TiffinVendor.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { license_number: identifier }
      ]
    });
    if (!vendor) return res.status(400).json({ success: false, error: 'Vendor not found' });
    const match = await bcrypt.compare(password, vendor.password);
    if (!match) return res.status(400).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ _id: vendor._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, vendor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get('/check-auth/', auth, async (req, res) => {
  try {
    const vendor = await TiffinVendor.findById(req.vendor._id).select('-password');
    if (!vendor) return res.json({ success: true, authenticated: false });
    res.json({ success: true, authenticated: true, vendor });
  } catch (err) {
    res.json({ success: true, authenticated: false });
  }
});

// Logout (just a frontend token clear, but for API completeness)
router.get('/logout/', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;