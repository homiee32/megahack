import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import UserSimulation from '../models/UserSimulation.js';
import User from '../models/User.js';

// @desc    Evaluate assessment submission
// @route   POST /api/analysis/evaluate
// @access  Private
const evaluateSubmission = async (req, res, next) => {
  try {
    const { role, task, answer_text, image_path, day } = req.body;

    if (!role || !task || !answer_text || day === undefined) {
      res.status(400);
      throw new Error('Please provide role, task, answer text, and day');
    }

    // Call the Flask microservice
    const flaskUrl = 'http://localhost:5001/evaluate';
    
    try {
      const response = await fetch(flaskUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          task,
          answer_text,
          image_path: image_path || ""
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      // Save marks to database
      if (data.scores) {
        let simulation = await UserSimulation.findOne({ user: req.user._id, role });
        
        if (!simulation) {
          simulation = new UserSimulation({
            user: req.user._id,
            role,
            dailyMarks: []
          });
        }

        // Update or add day marks
        const existingDayIndex = simulation.dailyMarks.findIndex(m => m.day === day);
        if (existingDayIndex !== -1) {
          simulation.dailyMarks[existingDayIndex] = { day, ...data.scores };
        } else {
          simulation.dailyMarks.push({ day, ...data.scores });
        }

        await simulation.save();
      }

      res.json(data);
    } catch (fetchError) {
      console.error(`Failed to connect to Flask server: ${fetchError.message}`);
      res.status(503).json({ 
        error: 'Evaluation service temporarily unavailable', 
        details: 'Could not connect to the ML microservice on port 5001' 
      });
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Complete simulation and predict salary
// @route   POST /api/analysis/complete
// @access  Private
const completeSimulation = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role) {
      res.status(400);
      throw new Error('Please provide role');
    }

    const simulation = await UserSimulation.findOne({ user: req.user._id, role });

    if (!simulation || simulation.dailyMarks.length === 0) {
      res.status(404);
      throw new Error('No simulation data found for this role');
    }

    // Calculate averages of p1, p2, p3, p4 across all available days
    const sums = { p1: 0, p2: 0, p3: 0, p4: 0 };
    const count = simulation.dailyMarks.length;

    simulation.dailyMarks.forEach(mark => {
      sums.p1 += mark.p1;
      sums.p2 += mark.p2;
      sums.p3 += mark.p3;
      sums.p4 += mark.p4;
    });

    const averages = {
      p1: Math.round(sums.p1 / count),
      p2: Math.round(sums.p2 / count),
      p3: Math.round(sums.p3 / count),
      p4: Math.round(sums.p4 / count)
    };

    // Call Flask microservice for salary prediction
    const flaskUrl = 'http://localhost:5001/predict';
    let predictedSalary = 0;

    try {
      const response = await fetch(flaskUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          scores: averages
        }),
      });

      const data = await response.json();
      if (response.ok) {
        predictedSalary = data.predicted_salary;
      }
    } catch (predictError) {
      console.error(`Salary prediction failed: ${predictError.message}`);
    }

    // Update simulation record
    simulation.isCompleted = true;
    simulation.predictedSalary = predictedSalary;
    await simulation.save();

    // Update user profile with new salary estimates
    const user = await User.findById(req.user._id);
    if (user) {
      // Logic for market value update based on predicted salary (e.g., +/- 10%)
      user.marketValueMin = Math.round(predictedSalary * 0.9);
      user.marketValueMax = Math.round(predictedSalary * 1.1);
      
      // Calculate overall skill score (avg of averages)
      const avgScore = (averages.p1 + averages.p2 + averages.p3 + averages.p4) / 4;
      user.skillScore = Math.round(avgScore * 10);
      user.industryReadiness = Math.min(100, user.skillScore + 5);
      
      await user.save();
    }

    res.json({
      role,
      averages,
      predictedSalary,
      message: 'Simulation completed successfully'
    });

  } catch (error) {
    next(error);
  }
};

export { evaluateSubmission, completeSimulation };

