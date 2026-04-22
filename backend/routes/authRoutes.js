import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/google', AuthController.googleLogin);
router.get('/profile', protect, AuthController.getProfile);

export default router;
