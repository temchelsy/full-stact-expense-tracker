import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, 'ef0df02e62981bd3bffd9894c32a0000e3ec95073d334c099d2e5b0175211664'); 
        req.user = await User.findById(decoded.id); 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
