import Portfolio from '../models/Portfolio.js';

// @desc    Get user portfolios
// @route   GET /api/portfolios
// @access  Private
const getPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id });
    res.json(portfolios);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new portfolio item
// @route   POST /api/portfolios
// @access  Private
const createPortfolio = async (req, res, next) => {
  try {
    const { projectName, description, technologies, projectUrl, githubUrl } = req.body;

    const portfolio = new Portfolio({
      user: req.user._id,
      projectName,
      description,
      technologies,
      projectUrl,
      githubUrl,
    });

    const createdPortfolio = await portfolio.save();
    res.status(201).json(createdPortfolio);
  } catch (error) {
    next(error);
  }
};

export { getPortfolios, createPortfolio };
