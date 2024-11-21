import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { JWT_SECRET } from '../constants/constants.js';

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check for Bearer token in the authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: "failed", message: "Unauthorized: No token provided." });
        }

        // Extract the token
        const token = authHeader.split(" ")[1];

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user details from the database
        const user = await User.findById(decoded.userId);

        // If user not found, return Unauthorized
        if (!user) {
            return res.status(401).json({ status: "failed", message: "Unauthorized: User not found." });
        }

        // Attach the user to the request object
        req.user = user;

        // Continue to the next middleware/route handler
        return next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ status: "failed", message: "Unauthorized: Invalid or expired token." });
        }

        // Log the error for debugging (don't expose this in production)
        console.error("Authentication error:", error);

        // Return a generic error response for server issues
        return res.status(500).json({ status: "failed", message: "Internal Server Error." });
    }
};

export default authenticateUser;
