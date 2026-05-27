const jwt = require('jsonwebtoken');

// short-lived access token (15 minutes by default)
const generateAccessToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiry = process.env.JWT_EXPIRE || '15m';
  return jwt.sign({ id: userId }, secret, { expiresIn: expiry });
};

// longer refresh token, 7 days
const generateRefreshToken = (userId) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiry = process.env.JWT_REFRESH_EXPIRE || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn: expiry });
};

// sends both tokens back to the client
// refresh token goes in a cookie, access token in the response body
const sendTokens = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: sevenDaysMs,
  });

  res.status(statusCode).json({
    success: true,
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = { generateAccessToken, generateRefreshToken, sendTokens };
