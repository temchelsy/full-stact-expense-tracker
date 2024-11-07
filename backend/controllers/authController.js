import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Utility functions
const hashPassword = async (userValue) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userValue, salt);
  return hashedPassword;
};

// Function to create a reset token
const createResetToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET, // Make sure to set a separate JWT secret for reset tokens if needed
    { expiresIn: "1d" } // Token will expire in 1 hour
  );
};

const comparePassword = async (userPassword, password) => {
  try {
    return await bcrypt.compare(userPassword, password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

const createJWT = (id) => {
  return jwt.sign(
    { userId: id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// Controllers
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      return res.status(400).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "failed",
        message: "Email Address already exists. Try Login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = createJWT(user._id);

    res.status(201).json({
      status: "success",
      message: "User account created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ status: "failed", message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    const token = createJWT(user._id);

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id; 

    const user = await User.findById(userId).select('id firstName lastName email');

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};


// Controller for Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ status: "failed", message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found." });
    }

    // Generate the reset token
    const resetToken = createResetToken(user._id);

    // Optionally, store the token and expiration on the user record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Send the token to the user's email or return it as a response for testing
    // You could integrate an email service here, e.g., Nodemailer
    res.status(200).json({
      status: "success",
      message: "Password reset link has been sent.",
      resetToken, // For testing purposes, but don't include in production response
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ status: "failed", message: "Internal server error." });
  }
};

// Controller for Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ status: "failed", message: "Token and new password are required." });
    }

    // Verify the token and check expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ status: "failed", message: "Invalid or expired token." });
    }

    // Update the password
    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ status: "success", message: "Password reset successful." });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ status: "failed", message: "Internal server error." });
  }
};