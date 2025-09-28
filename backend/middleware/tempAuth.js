const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      // Try to decode without verifying (for testing only)
      const decoded = jwt.decode(token);
      req.user = decoded;
    } catch (err) {
      // If decode fails, continue without user
      console.log('Token decode failed:', err.message);
    }
  }
  
  // Always call next, even if no token
  next();
};
