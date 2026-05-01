const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'AUTH_TOKEN_MISSING'
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.',
          error: 'USER_NOT_FOUND'
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
        error: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: 'AUTH_ERROR'
    });
  }
};

module.exports = authenticate;
