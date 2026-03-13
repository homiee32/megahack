import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Evaluate assessment submission
// @route   POST /api/analysis/evaluate
// @access  Private
const evaluateSubmission = async (req, res, next) => {
  try {
    const { role, task, answer_text, image_path } = req.body;

    if (!role || !task || !answer_text) {
      res.status(400);
      throw new Error('Please provide role, task, and answer text');
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

export { evaluateSubmission };

