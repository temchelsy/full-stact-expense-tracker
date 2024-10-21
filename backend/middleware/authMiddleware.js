import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: "failed", message: "Unauthorized: No token provided." });
        }

        const token = authHeader.split(" ")[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details from the database
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ status: "failed", message: "Unauthorized: User not found." });
        }

        
        req.user = user;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ status: "failed", message: "Unauthorized: Invalid or expired token." });
        }

        console.error("Authentication error:", error);
        res.status(500).json({ status: "failed", message: "Internal Server Error." });
    }
};

export default authenticateUser;
