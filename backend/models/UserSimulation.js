import mongoose from 'mongoose';

const dailyMarkSchema = mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  p1: { type: Number, default: 0 },
  p2: { type: Number, default: 0 },
  p3: { type: Number, default: 0 },
  p4: { type: Number, default: 0 },
}, { _id: false });

const userSimulationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  role: {
    type: String,
    required: true,
  },
  dailyMarks: [dailyMarkSchema],
  isCompleted: {
    type: Boolean,
    default: false,
  },
  predictedSalary: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

// Ensure unique combination of user and role
userSimulationSchema.index({ user: 1, role: 1 }, { unique: true });

const UserSimulation = mongoose.model('UserSimulation', userSimulationSchema);

export default UserSimulation;
