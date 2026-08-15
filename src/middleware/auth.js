const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  let token;

  const authHeader=req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split('')[1];
  }

  if (!token) {
    res.status(401).json({message: 'Not authorized, no token provided'});
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
  

  if (!user) {
    res.status(401).json({message: 'User attached to token no longer exists'});
    return;
  }

  req.user = user;
  next();
}

catch (error) {
  res.status(401).json({message: 'Not authorized, token invalid or expired'});
}
}


module.exports = protect;