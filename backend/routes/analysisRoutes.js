import express from 'express';
import { evaluateSubmission } from '../controllers/analysisController.js';

const router = express.Router();

router.post('/evaluate', evaluateSubmission);

export default router;
