import Simulation from '../models/Simulation.js';

// @desc    Get all simulations
// @route   GET /api/simulations
// @access  Private
const getSimulations = async (req, res, next) => {
  try {
    const simulations = await Simulation.find({});
    res.json(simulations);
  } catch (error) {
    next(error);
  }
};

export { getSimulations };
