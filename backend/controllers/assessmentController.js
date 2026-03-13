import Assessment from '../models/Assessment.js';

// @desc    Get all assessments for the logged in user
// @route   GET /api/assessments
// @access  Private
const getAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id });
    res.json(assessments);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an assessment
// @route   POST /api/assessments
// @access  Private
const submitAssessment = async (req, res, next) => {
  try {
    const { title, score, isCompleted } = req.body;

    const assessment = new Assessment({
      user: req.user._id,
      title,
      score,
      isCompleted,
      completedAt: isCompleted ? Date.now() : null,
    });

    const createdAssessment = await assessment.save();
    res.status(201).json(createdAssessment);
  } catch (error) {
    next(error);
  }
};

export { getAssessments, submitAssessment };
