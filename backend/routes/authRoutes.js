import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/user.js"; // Ensure User is imported
import authenticateUser from "../middleware/authMiddleware.js";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  FRONT_END_URL,
} from "../constants/constants.js";
import {
  getCurrentUser,
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Function to create a JWT for authenticated users
const createJWT = (id) => {
  return jwt.sign(
    { userId: id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN } 
  );
};


// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Route to get the current authenticated user
router.get("/current", authenticateUser, getCurrentUser);

// Google OAuth login route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "failed",
          message: "Google authentication failed",
        });
      }

      // Generate JWT token
      const token = createJWT(req.user._id);

      console.log("Generated Google OAuth Token:", token);

      // Frontend Redirect
      const frontendRedirectURL = `${FRONT_END_URL}/oauth-callback?token=${token}`;
      res.redirect(frontendRedirectURL);
    } catch (error) {
      console.error("Google OAuth Callback Error:", error);
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  }
);

// Export the router
export default router;
