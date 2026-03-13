import mongoose from 'mongoose';

const simulationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['In Progress', 'Completed', 'Trending'],
  },
  instructor: {
    type: String,
    required: true,
  },
  timeLeft: {
    type: String,
  },
  masteryLevel: {
    type: Number,
    required: true,
    default: 0,
  },
  image: {
    type: String,
  },
  avatar: {
    type: String,
  }
}, {
  timestamps: true,
});

const Simulation = mongoose.model('Simulation', simulationSchema);

export default Simulation;
