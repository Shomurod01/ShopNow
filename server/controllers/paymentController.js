const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// create a stripe payment intent
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }

    // calculate the total in cents
    let subtotalCents = 0;
    for (const item of items) {
      subtotalCents += item.price * item.quantity * 100;
    }
    subtotalCents = Math.round(subtotalCents);

    const subtotalDollars = subtotalCents / 100;

    // free shipping over $100
    const shippingCents = subtotalDollars > 100 ? 0 : 999;
    const taxCents = Math.round(subtotalCents * 0.08);
    const totalCents = subtotalCents + shippingCents + taxCents;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'usd',
      metadata: {
        userId: req.user._id.toString(),
        itemCount: items.length.toString(),
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: totalCents,
    });
  } catch (error) {
    next(error);
  }
};
