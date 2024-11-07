import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js';
import { getCurrentUser, register, login, forgotPassword, resetPassword} from '../controllers/authController.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/current', authenticateUser, getCurrentUser);

export default router;
