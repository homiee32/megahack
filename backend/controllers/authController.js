import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log('Registration request received:', { name, email });

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('User already exists:', email);
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      console.log('User created successfully in DB:', user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        skillScore: user.skillScore,
        marketValueMin: user.marketValueMin,
        marketValueMax: user.marketValueMax,
        industryReadiness: user.industryReadiness,
        token: generateToken(user._id),
      });
    } else {
      console.error('Failed to create user object');
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    console.error('Error during registration:', error.message);
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        skillScore: user.skillScore,
        marketValueMin: user.marketValueMin,
        marketValueMax: user.marketValueMax,
        industryReadiness: user.industryReadiness,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser };
