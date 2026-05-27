const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one cart per user
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// virtual field to get cart total without storing it in db
cartSchema.virtual('total').get(function () {
  let total = 0;
  for (const item of this.items) {
    total += item.price * item.quantity;
  }
  return total;
});

module.exports = mongoose.model('Cart', cartSchema);
