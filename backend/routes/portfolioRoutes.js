import express from 'express';
import { getPortfolios, createPortfolio } from '../controllers/portfolioController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPortfolios)
  .post(protect, createPortfolio);

export default router;
