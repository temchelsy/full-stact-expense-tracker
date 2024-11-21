import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// JWT Creation Function
const createJWT = (id) => {
  return jwt.sign(
    { userId: id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// Google OAuth Routes
router.get(
  '/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'failed',
          message: 'Google authentication failed',
        });
      }

      // Generate JWT token
      const token = createJWT(req.user._id);

      console.log("Generated Google OAuth Token:", token);

      // Frontend Redirect with Token
      const frontendRedirectURL = `${process.env.FRONTEND_URL || 'https://full-stact-expense-tracker.vercel.app'}/oauth-callback?token=${token}`;
      res.redirect(frontendRedirectURL);
    } catch (error) {
      console.error('Google OAuth Callback Error:', error);
      res.status(500).json({
        status: 'failed',
        message: 'Internal server error',
      });
    }
  }
);

export default router;