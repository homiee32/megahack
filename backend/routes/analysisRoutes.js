import express from 'express';
import { evaluateSubmission, completeSimulation } from '../controllers/analysisController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/evaluate', protect, evaluateSubmission);
router.post('/complete', protect, completeSimulation);

export default router;
