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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.skillScore = req.body.skillScore !== undefined ? req.body.skillScore : user.skillScore;
      user.marketValueMin = req.body.marketValueMin !== undefined ? req.body.marketValueMin : user.marketValueMin;
      user.marketValueMax = req.body.marketValueMax !== undefined ? req.body.marketValueMax : user.marketValueMax;
      user.industryReadiness = req.body.industryReadiness !== undefined ? req.body.industryReadiness : user.industryReadiness;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        skillScore: updatedUser.skillScore,
        marketValueMin: updatedUser.marketValueMin,
        marketValueMax: updatedUser.marketValueMax,
        industryReadiness: updatedUser.industryReadiness,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getUserProfile, updateUserProfile };
