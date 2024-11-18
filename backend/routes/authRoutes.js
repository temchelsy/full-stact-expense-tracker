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


router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Route to get the current authenticated user
router.get('/current', authenticateUser, getCurrentUser);

// Route to start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback 
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  (req, res) => {
    if (!req.user) {
      console.error('Google authentication failed: User not found.');
      return res.status(401).json({
        status: 'failed',
        message: 'Google authentication failed',
      });
    }

    // Generate token and return success response
    try {
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
    } catch (error) {
      console.error('Token generation error:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
);


export default router;
