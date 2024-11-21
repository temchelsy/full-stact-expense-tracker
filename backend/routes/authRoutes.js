import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/user.js'; 
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
    session: false, // No session will be used, as we are generating a JWT
    failureRedirect: '/login', // Redirect to login if authentication fails
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'failed',
          message: 'Google authentication failed',
        });
      }

      // Check if the user exists, or create a new one if they don't
      let user = await User.findOne({ googleId: req.user.id });

      if (!user) {
        user = new User({
          googleId: req.user.id,
          firstName: req.user.name.givenName,
          lastName: req.user.name.familyName,
          email: req.user.emails[0].value,
        });

        // Save the new user to the database
        await user.save();
      }

      // Generate JWT token
      const token = createJWT(user._id);

      console.log("Generated Google OAuth Token:", token);  // <-- Add this line to check if token is generated

      // Redirect to frontend with the token
      const frontendRedirectURL = `https://full-stact-expense-tracker.vercel.app/oauth-callback?token=${token}`;
      res.redirect(frontendRedirectURL);
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      return res.status(500).json({
        status: 'failed',
        message: 'Internal server error.',
      });
    }
  }
);

export default router;
