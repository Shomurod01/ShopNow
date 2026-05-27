const Cart = require('../models/Cart');
const Product = require('../models/Product');

// get the current user's cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price images stock'
    );

    if (!cart) {
      // return an empty cart if none exists yet
      return res.json({ success: true, cart: { items: [], total: 0 } });
    }

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// add a product to the cart or update its quantity if already there
exports.addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const quantity = req.body.quantity || 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // get or create the user's cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // update quantity if product is already in cart
    const existingItem = cart.items.find(function (item) {
      return item.product.toString() === productId;
    });

    if (existingItem) {
      existingItem.quantity = Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: product.price,
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// update the quantity of a specific item in the cart
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    // remove the item if quantity is 0 or less
    if (Number(quantity) <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// remove a specific item from the cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// wipe the entire cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
