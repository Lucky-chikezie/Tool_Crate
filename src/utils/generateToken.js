const jwt = require('jsonwebtoken');

function generateToken(userId) {
  const token=jwt.sign(
    {id: userId},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
  );
  return token;
}

module.exports = generateToken;