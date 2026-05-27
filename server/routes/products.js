const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require('../controllers/productController');

// public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// admin only routes
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// any logged in user can leave a review
router.post('/:id/reviews', protect, addReview);

module.exports = router;
