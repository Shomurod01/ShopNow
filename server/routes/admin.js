const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

const {
  getStats,
  getUsers,
  deleteUser,
  getAllOrders,
} = require('../controllers/adminController');


router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);

module.exports = router;
