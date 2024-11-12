import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js';
import { getCurrentUser, register, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import passport from 'passport';


const router = express.Router();
const createJWT = (id) => {
    return jwt.sign(
      { userId: id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
  };
  

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/current', authenticateUser, getCurrentUser);

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Check if the user object is available and create a JWT
    if (!req.user) {
      return res.status(401).json({
        status: "failed",
        message: "Google authentication failed",
      });
    }
    
    // Generate the JWT token
    const token = createJWT(req.user._id); 

    // Return user details and token
    res.status(200).json({
      status: "success",
      message: "Google login successful",
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
