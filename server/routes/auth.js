const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  resetPasswordRequest,
  resetPassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/authController');

// public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/reset-password', resetPasswordRequest);
router.post('/reset-password/:token', resetPassword);

// protected routes (need to be logged in)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

module.exports = router;
