import express from 'express';
import LinkController from '../controllers/LinkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, LinkController.createShortUrl)
  .get(protect, LinkController.getLinksByUser);

router.route('/:id')
  .delete(protect, LinkController.deleteLink);

export default router;
