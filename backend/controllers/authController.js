import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const register = async (req, res) => {
  console.log("Registering user...");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;
  console.log("First name:", firstName, "Last name:", lastName, "Email:", email, "Password:", password);

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    console.log("Checking if user already exists...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("Creating user...");
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    console.log("Generating JWT token...");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("User registered successfully, returning response...");
    res.status(201).json({
      token,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Finding user with email...");
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Checking password...");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Generating JWT token...");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("Login successful, returning response...");
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error", error });
  }
};

// Forgot Password - Send Reset Code
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("Finding user with email...");
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Generating reset code...");
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const resetCodeExpiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

    user.resetCode = resetCode;
    user.resetCodeExpiresAt = resetCodeExpiresAt;
    await user.save();

    console.log("Sending email...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Code",
      html: `<p>Your password reset code is: <strong>${resetCode}</strong></p>
             <p>This code will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Reset code sent, returning response...");
    res.status(200).json({ message: "Reset code sent to your email." });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ message: "Error sending reset code" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { resetCode, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    console.log("Finding user with reset code...");
    const user = await User.findOne({
      resetCode,
      resetCodeExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired reset code" });
    }

    console.log("Resetting password...");
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpiresAt = null;
    await user.save();

    console.log("Password reset successfully...");
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

export { register, login, forgotPassword, resetPassword };
