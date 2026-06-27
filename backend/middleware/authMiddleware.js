const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Protect routes — verifies JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists.' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Not authorized. Invalid token.' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }
};

// Role-based access control
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not permitted for this action.`
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
