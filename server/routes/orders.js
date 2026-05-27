const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
} = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);

// only admins can change order status
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
