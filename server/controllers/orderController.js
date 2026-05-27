const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// place a new order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentResult } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    let itemsPrice = 0;
    const validatedItems = [];

    // go through each item, check stock, and calculate the price
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found: ' + item.product,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Not enough stock for ' + product.name,
        });
      }

      // reduce the stock
      product.stock -= item.quantity;
      await product.save();

      const price = product.price;
      itemsPrice += price * item.quantity;

      let imageUrl = '';
      if (product.images && product.images.length > 0) {
        imageUrl = product.images[0].url;
      }

      validatedItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price,
        image: imageUrl,
      });
    }

    // free shipping over $100
    const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
    const taxPrice = Math.round(itemsPrice * 0.08 * 100) / 100;
    const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'stripe',
      paymentResult,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      status: 'Processing',
    });

    // clear the cart after successful order
    await Cart.findOneAndDelete({ user: req.user._id });

    console.log('Order confirmed for user ' + req.user.email + ', order id: ' + order._id);

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// get all orders for the logged in user
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// get a single order - users can only see their own
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // only the owner or an admin can view the order
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// admin: update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    // if cancelled, give the stock back
    if (status === 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
