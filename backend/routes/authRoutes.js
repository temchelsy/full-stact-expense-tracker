import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import authenticateUser from '../middleware/authMiddleware.js';
import { getCurrentUser, register, login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Function to create a JWT
const createJWT = (id) => {
  return jwt.sign(
    { userId: id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Standard authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Route to get the current authenticated user
router.get('/current', authenticateUser, getCurrentUser);

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // If authentication fails, `req.user` will be undefined
    if (!req.user) {
      return res.status(401).json({
        status: 'failed',
        message: 'Google authentication failed',
      });
    }

    // Generate JWT and return user information and token
    const token = createJWT(req.user._id);
    res.status(200).json({
      status: 'success',
      message: 'Google login successful',
      user: {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
      },
      token,
    });
  }
);

export default router;
