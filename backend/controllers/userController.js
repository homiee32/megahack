import User from '../models/User.js';

// @desc    Get user profile/dashboard data
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        skillScore: user.skillScore,
        marketValueMin: user.marketValueMin,
        marketValueMax: user.marketValueMax,
        industryReadiness: user.industryReadiness,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getUserProfile };
