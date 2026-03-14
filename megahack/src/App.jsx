import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CareerPage } from './pages/CareerPage';
import { IndustryInsightsPage } from './pages/IndustryInsightsPage';
import { CertificationPage } from './pages/CertificationPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AssessmentPage } from './pages/AssessmentPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/insights" element={<IndustryInsightsPage />} />
        <Route path="/certifications" element={<CertificationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
