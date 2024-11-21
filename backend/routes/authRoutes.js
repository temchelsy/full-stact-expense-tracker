import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import authenticateUser from '../middleware/authMiddleware.js'; 
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

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Route to get the current authenticated user
router.get('/current', authenticateUser, getCurrentUser);

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login', // Redirect to login if authentication fails
  }),
  (req, res) => {
    if (!req.user) {
      console.error('Google authentication failed: User not found.');
      return res.status(401).json({
        status: 'failed',
        message: 'Google authentication failed',
      });
    }

    // Generate JWT token
    const token = createJWT(req.user._id);

    // Redirect to frontend with the token
    const frontendRedirectURL = `https://full-stact-expense-tracker.vercel.app/oauth-callback?token=${token}`;
    res.redirect(frontendRedirectURL);
  }
);

export default router;
