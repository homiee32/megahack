import express from 'express';
import { getSimulations } from '../controllers/simulationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getSimulations);

export default router;
