import express from 'express';
import AnalyticsController from '../controllers/AnalyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:linkId', protect, AnalyticsController.getStatsByLink);

export default router;
