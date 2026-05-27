const jwt = require('jsonwebtoken');
const User = require('../models/User');

// middleware to protect routes - checks the Authorization header
exports.protect = async (req, res, next) => {
  let token;

  // pull token from the Bearer header if it exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach the user to the request (minus the password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// only lets admin users through
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  res.status(403).json({ success: false, message: 'Admin access required' });
};
