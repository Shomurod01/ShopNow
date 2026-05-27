const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendTokens, generateAccessToken } = require('../utils/generateToken');

// register a new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // check if the email is already taken
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const user = await User.create({ name, email, password });
    sendTokens(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// login with email and password
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // we need the password for comparison so we explicitly select it
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const passwordOk = await user.comparePassword(password);
    if (!passwordOk) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    sendTokens(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// clear the refresh token cookie
exports.logout = (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

// use refresh token to get a new access token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const accessToken = generateAccessToken(user._id);
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// get the logged in user's profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// update profile info or change password
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, address, phone, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    // only update password if a new one was provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required',
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      user.password = newPassword;
    }

    await user.save();

    // don't send the password back
    user.password = undefined;
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// send a password reset link (just logs it for now since no email service is set up)
exports.resetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // always return success so we don't reveal whether an email exists
    if (!user) {
      return res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    // log the token since we don't have email set up
    console.log('Reset token for ' + email + ': ' + resetToken);
    console.log('Reset URL: ' + process.env.CLIENT_URL + '/reset-password/' + resetToken);

    res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
  } catch (error) {
    next(error);
  }
};

// actually reset the password using the token from the link
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendTokens(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// get user's wishlist with product details
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// add a product to wishlist if it's not already there
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const updated = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: updated.wishlist });
  } catch (error) {
    next(error);
  }
};

// remove a product from wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(function (id) {
      return id.toString() !== productId;
    });

    await user.save();

    const updated = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: updated.wishlist });
  } catch (error) {
    next(error);
  }
};
