import express from 'express';
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { logActivity, asyncHandler } from '../middleware/logger.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ✅ Same secret as middleware — must match or tokens won't verify
const JWT_SECRET = process.env.JWT_SECRET || 'default_dev_secret';

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET not set — using fallback. Set it in server/.env for production!');
  }
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// ─── SIGNUP ──────────────────────────────────────────────────────────────────
router.post('/signup', asyncHandler(async (req, res) => {
  const { username, email, password, role = 'user', department = null } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are all required' });
  }

  // Check for existing user
  const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
  if (existing) {
    const field = existing.email === email.toLowerCase() ? 'Email' : 'Username';
    return res.status(400).json({ message: `${field} is already in use` });
  }

  const user = await User.create({ username, email, password, role, department });

  try {
    await logActivity('SIGNUP', `New ${role} signed up: ${username}`, user, 'user');
  } catch (_) { /* non-fatal */ }

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: user.toJSON()
  });
}));

// ─── LOGIN ───────────────────────────────────────────────────────────────────
router.post('/login', asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  if (!username && !email) {
    return res.status(400).json({ message: 'Username or email is required' });
  }

  // Build OR query — frontend sends both username & email fields simultaneously
  const orConditions = [];
  if (username) orConditions.push({ username });
  if (email)    orConditions.push({ email: email.toLowerCase() });
  // Also try treating the username field as an email (user typed email in username box)
  if (username && username.includes('@')) orConditions.push({ email: username.toLowerCase() });

  const user = await User.findOne({ $or: orConditions });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'Account is deactivated. Contact an administrator.' });
  }

  // ✅ matchPassword works because password field is no longer select:false
  const ok = await user.matchPassword(password);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  user.lastLogin = new Date();
  await user.save();

  try {
    await logActivity('LOGIN', `${user.role} logged in: ${user.username}`, user, 'system');
  } catch (_) { /* non-fatal */ }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: user.toJSON()
  });
}));

// ─── ME ──────────────────────────────────────────────────────────────────────
router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user.toJSON() });
});

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
router.post('/logout', protect, asyncHandler(async (req, res) => {
  try {
    await logActivity('LOGOUT', `${req.user.role} logged out: ${req.user.username}`, req.user, 'system');
  } catch (_) {}
  res.status(200).json({ success: true, message: 'Logged out' });
}));

// ─── LIST USERS (admin) ──────────────────────────────────────────────────────
router.get('/users', protect, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(200).json({ success: true, count: users.length, data: users });
}));

// ─── UPDATE USER (admin) ─────────────────────────────────────────────────────
router.put('/users/:userId', protect, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  const user = await User.findByIdAndUpdate(req.params.userId, { isActive: req.body.isActive }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.status(200).json({ success: true, user });
}));

export default router;
