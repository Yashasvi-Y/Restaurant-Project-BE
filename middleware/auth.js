const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 Auth middleware triggered');
    console.log('  Authorization header:', authHeader ? 'Present' : 'MISSING');
    
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.log('❌ No token in Authorization header');
      return res.status(401).json({ message: 'No token provided' });
    }
    
    console.log('  Token received:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✓ Token verified. User ID:', decoded.id);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware
};