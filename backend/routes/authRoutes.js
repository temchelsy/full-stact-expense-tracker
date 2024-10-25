import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js';
import { getCurrentUser, register, login} from '../controllers/authController.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);


router.get('/current', authenticateUser, getCurrentUser);

export default router;
