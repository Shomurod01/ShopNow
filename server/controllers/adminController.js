const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// get dashboard stats for the admin panel
exports.getStats = async (req, res, next) => {
  try {
    // run all queries at the same time to keep it fast
    const [totalProducts, totalOrders, totalUsers, revenueData, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.find().sort('-createdAt').limit(10).populate('user', 'name email'),
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// get all users (admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// delete a user (can't delete admins)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users',
      });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// get all orders for the admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort('-createdAt').populate('user', 'name email');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};
