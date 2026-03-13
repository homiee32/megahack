import mongoose from 'mongoose';

const assessmentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  completedAt: {
    type: Date,
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false,
  }
}, {
  timestamps: true,
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

export default Assessment;
