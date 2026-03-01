import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// ✅ FIX: Use the same fallback secret that generateToken() uses,
//    so JWT verification never fails due to a secret mismatch when .env is missing
const JWT_SECRET = process.env.JWT_SECRET || 'default_dev_secret';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized — invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const ownerOrAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?._id.toString() === req.params.userId) {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized to access this resource' });
  }
};
