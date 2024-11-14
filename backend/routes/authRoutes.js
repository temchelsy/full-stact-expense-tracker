import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import authenticateUser from '../middleware/authMiddleware.js'; // Custom middleware to check authenticated user
import { getCurrentUser, register, login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Function to create a JWT for authenticated user
const createJWT = (id) => {
  return jwt.sign(
    { userId: id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Standard authentication routes for user registration, login, and password reset
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Route to get the current authenticated user
router.get('/current', authenticateUser, getCurrentUser);

// Route to start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback handler
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }), // Fail to login if authentication fails
  (req, res) => {
    // If `req.user` is undefined, the authentication has failed
    if (!req.user) {
      return res.status(401).json({
        status: 'failed',
        message: 'Google authentication failed',
      });
    }

    // Generate a JWT token for the user
    const token = createJWT(req.user._id);

    // Return user information along with the JWT token
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
