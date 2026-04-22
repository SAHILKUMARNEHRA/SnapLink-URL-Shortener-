import express from 'express';
import AdminController from '../controllers/AdminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, AdminController.getDashboardStats);
router.get('/users', protect, admin, AdminController.getAllUsers);
router.get('/links', protect, admin, AdminController.getAllLinks);

export default router;
