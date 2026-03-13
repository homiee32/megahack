import mongoose from 'mongoose';

const portfolioSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  projectName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: [
    {
      type: String,
    }
  ],
  projectUrl: {
    type: String,
  },
  githubUrl: {
    type: String,
  }
}, {
  timestamps: true,
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
