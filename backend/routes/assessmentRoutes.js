import express from 'express';
import { getAssessments, submitAssessment } from '../controllers/assessmentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAssessments)
  .post(protect, submitAssessment);

export default router;
