import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, register);
router.post("/login", authenticateUser, login);
router.post("/forgot-password", authenticateUser, forgotPassword);  // For requesting reset code
router.post("/reset-password", authenticateUser, resetPassword);    // For resetting the password

export default router;
