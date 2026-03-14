# JobSim - Professional Industry Simulation Platform

JobSim is a modern, full-stack application designed to help candidates bridge the gap between education and industry readiness. It features a 7-day intensive role-playing simulation, AI-powered evaluation, and dynamic certification.

## 🚀 Key Features

- **7-Day Role Simulation**: Specialized roadmaps for Data Scientists, Web Developers, and UI/UX Designers.
- **AI Evaluation**: Real-time feedback and scoring using a Flask-based LLM integration.
- **Dynamic Certification**: Automatic generation of personalized, high-quality certificates upon completion.
- **Performance Analytics**: Tracks industry-readiness scores and market value based on assessment performance.
- **Premium UI/UX**: Built with React, Tailwind CSS 4, and Framer Motion for a state-of-the-art experience.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript, Lucide React, HTML2Canvas, JSPDF.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth.
- **ML Service**: Python, Flask, Gemini API (for LLM evaluation).

---

## 💻 Installation & Setup

### 1. Root Setup
Clone the repository and install the helper dependencies:
```bash
npm install
```

### 2. Backend Setup
Navigate to the `backend` folder and configure your environment:
1. Create a `.env` file based on `.env.example`.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

### 3. Frontend Setup
Navigate to the `megahack` folder and install dependencies:
```bash
cd megahack
npm install
```

### 4. ML Service Setup
Navigate to the `backend/ml` folder:
1. Create a virtual environment and install requirements.
2. Set your `GOOGLE_API_KEY` for the Gemini integration.

---

## 🏃 Running the Application

You can now run the **entire project stack** (Frontend, Backend, and ML Service) with a single command from the **root directory**:

```bash
npm start
```

**Individual Services:**
- **Frontend**: `npm run dev` (in `/megahack`)
- **Backend**: `npm start` (in `/backend`)
- **ML Service**: `python app.py` (in `/backend/ml`)

---

## 📂 Project Structure

- `/megahack`: React frontend application.
- `/backend`: Express API server.
- `/backend/ml`: Python Flask service for AI evaluation.
- `/backend/models`: MongoDB schemas.

---

## 📋 Git Guidelines

- **Protected Files**: `.env` files and `node_modules` are excluded via the root `.gitignore`.
- **Type Safety**: The project follows strict TypeScript standards; ensure `npm run lint` passes before pushing.
- **Branching**: It is recommended to work on feature branches before merging into `main`.

---

© 2024 Team Vought - Industry Readiness Simulation.