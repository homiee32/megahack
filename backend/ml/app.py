from flask import Flask, request, jsonify
from flask_cors import CORS
from llm_evaluator import evaluate_answer # Renamed for clean import
from salary_predictor import predict_salary
import os

app = Flask(__name__)
CORS(app) # Enable CORS for Node.js communication

@app.route('/health', methods=['get'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/evaluate', methods=['POST'])
def evaluate():
    try:
        data = request.json
        role = data.get('role')
        task = data.get('task')
        answer_text = data.get('answer_text')
        image_path = data.get('image_path')

        if not role or not task or not answer_text:
            return jsonify({"error": "Missing required fields (role, task, answer_text)"}), 400

        result = evaluate_answer(role, task, answer_text, image_path)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        role = data.get('role')
        scores = data.get('scores') # Expecting { "p1": x, "p2": y, "p3": z, "p4": w }

        if not role or not scores:
            return jsonify({"error": "Missing required fields (role, scores)"}), 400

        prediction = predict_salary(role, scores)
        return jsonify({"predicted_salary": prediction}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Running on port 5001 to avoid conflict with Node.js on 5000
    app.run(host='0.0.0.0', port=5001, debug=True)
