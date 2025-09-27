const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ success: false, error: 'All fields required' });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ success: false, error: 'Username or email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });

    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ success: false, error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/check-auth/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.json({ success: true, authenticated: false });
    res.json({ success: true, authenticated: true, user });
  } catch (err) {
    res.json({ success: true, authenticated: false });
  }
});

// Logout (just a frontend token clear, but for API completeness)
router.get('/logout/', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;