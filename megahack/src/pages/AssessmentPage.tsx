import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { Clock, Zap, ChevronRight, ChevronLeft, CheckCircle2, Target as TargetIcon, Database, BarChart3, Layout, Settings, Rocket, Award, Lock, Search, Map, Palette, Smartphone, Play } from 'lucide-react';

interface AssessmentItem {
  day: number;
  category: string;
  title: string;
  description: string;
  dataset?: string;
  scenario?: string;
  task?: string;
  submission?: string;
  icon?: React.ReactNode;
}

const defaultAssessmentContent: AssessmentItem[] = [
  {
    day: 1,
    category: "Product & UX",
    title: "User Experience Analysis",
    description: "Analyze the current onboarding flow of our platform. Describe three specific improvements you would make to reduce cognitive load for first-time users."
  },
  {
    day: 2,
    category: "Software Engineering",
    title: "System Design Challenge",
    description: "Design a scalable notification system that handles millions of messages across email, SMS, and push notifications. Explain your choice of message broker and database."
  },
  {
    day: 3,
    category: "Data Analysis",
    title: "Metrics & KPIs",
    description: "A recently launched feature saw a 20% drop in user retention after week 1. Identify five metrics you would investigate to find the root cause and propose a hypothesis."
  },
  {
    day: 4,
    category: "Industry Strategy",
    title: "Market Positioning",
    description: "Assess the competitive landscape for JobSim. How would you differentiate our platform from traditional career boards to appeal to Gen Z job seekers?"
  },
  {
    day: 5,
    category: "Frontend Dev",
    title: "Performance Optimization",
    description: "Our main dashboard is taking 6 seconds to load interactive elements. List five optimization techniques (e.g., code splitting, memoization) you would implement and why."
  },
  {
    day: 6,
    category: "Interpersonal Skills",
    title: "Conflict Resolution",
    description: "You're in a sprint planning meeting where the lead developer and the product owner disagree on priority. Draft a communication plan to reach a consensus."
  },
  {
    day: 7,
    category: "Final Review",
    title: "Career Readiness Pitch",
    description: "Synthesize your learnings from the past six days into a 2-minute pitch for why your identified career path is the right fit for your current skill set."
  }
];

const dataScientistContent: AssessmentItem[] = [
  {
    day: 1,
    category: "Data Analysis",
    title: "Day 1: The Data Detective",
    dataset: "Airline Passenger Satisfaction (Kaggle)",
    scenario: "Imagine you joined SkyHigh Airlines. The management is worried about falling ratings.",
    task: "Download the dataset and analyze the relationship between 'Inflight Entertainment' and 'Overall Satisfaction'.",
    submission: "List the top 3 features that correlate most with a 'Satisfied' customer. Explain your logic in 4-5 sentences.",
    description: "Identify key satisfaction drivers for an airline through correlation analysis.",
    icon: <TargetIcon className="w-6 h-6 text-indigo-600" />
  },
  {
    day: 2,
    category: "Data Cleaning",
    title: "Day 2: Cleaning the Mess",
    dataset: "Medical Cost Personal Datasets (Kaggle)",
    scenario: "HealthGuard Insurance has a messy database. Some BMI values are missing, and smokers' data is inconsistent.",
    task: "Explain how you will handle missing values in the 'bmi' column. Will you use Mean, Median, or Mode?",
    submission: "Provide the Python logic/strategy to detect and remove outliers from the 'charges' column so the company doesn't lose money on skewed data.",
    description: "Handle missing data and outliers in health insurance records.",
    icon: <Settings className="w-6 h-6 text-emerald-600" />
  },
  {
    day: 3,
    category: "Data Visualization",
    title: "Day 3: The Visual Storyteller",
    dataset: "Superstore Sales Dataset (Kaggle)",
    scenario: "The CEO of RetailPulse wants a visual report of the 'South Region' performance.",
    task: "Decide which plot is best to show the sales trend of the 'Technology' category over the last 2 years.",
    submission: "Describe the X-axis, Y-axis, and the type of chart (Line/Bar/Scatter) you would use. Explain why this chart is the best choice for a non-technical CEO.",
    description: "Create impactful visualizations for executive decision making.",
    icon: <BarChart3 className="w-6 h-6 text-rose-600" />
  },
  {
    day: 4,
    category: "Feature Engineering",
    title: "Day 4: Feature Architect",
    dataset: "NYC Taxi Trip Duration (Kaggle)",
    scenario: "CityCab AI needs better predictions. The raw 'pickup_datetime' isn't enough to predict traffic.",
    task: "Create 3 new features from the timestamp that could impact trip duration.",
    submission: "Explain the logic for these 3 features (e.g., peak hours, weekend vs weekday). Describe how these features help a machine learning model understand traffic patterns.",
    description: "Engineer new temporal features to improve taxi trip duration predictions.",
    icon: <Layout className="w-6 h-6 text-amber-600" />
  },
  {
    day: 5,
    category: "Machine Learning",
    title: "Day 5: The Model Builder",
    dataset: "Loan Prediction Dataset (Kaggle)",
    scenario: "EasyLoan Bank wants to automate loan approvals.",
    task: "This is a classification problem. Choose between Logistic Regression and Random Forest.",
    submission: "Justify your choice of algorithm. Explain what 'Train-Test Split' ratio you would use (e.g., 80/20) and why it's important to keep some data hidden from the model during training.",
    description: "Build and justify a classification model for financial risk assessment.",
    icon: <Database className="w-6 h-6 text-blue-600" />
  },
  {
    day: 6,
    category: "Model Tuning",
    title: "Day 6: Tuning the Engine",
    dataset: "House Prices - Advanced Regression (Kaggle)",
    scenario: "RealEstate Pro's current model is underperforming. They need high accuracy for high-stakes property deals.",
    task: "Use 'Hyperparameter Tuning' to improve the model.",
    submission: "Explain the concept of 'GridSearchCV'. Pick 3 parameters of your chosen model and describe how you would find their optimal values to boost accuracy.",
    description: "Optimize regression models for high-stakes real estate valuation.",
    icon: <Rocket className="w-6 h-6 text-purple-600" />
  },
  {
    day: 7,
    category: "Capstone",
    title: "Day 7: The CEO Presentation",
    scenario: "Combine your learnings from the past 6 days.",
    task: "You need to present a complete Data Science Pipeline to the Board of Directors.",
    description: "Present a comprehensive data science project lifecycle to stakeholders.",
    icon: <Award className="w-6 h-6 text-indigo-600" />
  }
];

const webDeveloperContent: AssessmentItem[] = [
  {
    day: 1,
    category: "Layout Mastery",
    title: "Day 1: Layout Mastery",
    scenario: "FitTrack Gym needs a professional landing page. The first impression is the most important.",
    task: "Design a navigation bar and a Hero Section. Everything must be perfectly centered on the screen.",
    submission: "Explain which CSS properties you would use to center a div both horizontally and vertically. Provide the logic for Flexbox vs. CSS Grid.",
    description: "Design a centered navigation bar and hero section for FitTrack Gym.",
    icon: <Layout className="w-6 h-6 text-indigo-600" />
  },
  {
    day: 2,
    category: "Mobile-First",
    title: "Day 2: The Mobile-First Challenge",
    scenario: "90% of FoodieExpress users order from mobile phones, but the current menu card layout is breaking on small screens.",
    task: "Make the menu card layout responsive without breaking the design.",
    submission: "Explain the concept of 'Media Queries'. How do you change a 3-column layout to a 1-column layout for screens smaller than 768px?",
    description: "Create a responsive menu card layout for FoodieExpress.",
    icon: <Settings className="w-6 h-6 text-emerald-600" />
  },
  {
    day: 3,
    category: "Interactions",
    title: "Day 3: Dynamic Interactions",
    scenario: "Users want a 'Dark Mode' feature for better productivity at night.",
    task: "Implement a toggle button that changes the entire website's background and text color when clicked.",
    submission: "How do you use JavaScript's addEventListener to manipulate the DOM? Explain how you would store the user's theme preference.",
    description: "Implement a dark mode toggle and theme persistence.",
    icon: <Zap className="w-6 h-6 text-rose-600" />
  },
  {
    day: 4,
    category: "API Integration",
    title: "Day 4: API Integration",
    scenario: "CryptoTracker needs to show live Bitcoin prices to users using a third-party public API.",
    task: "Fetch real-time data from an API and display it on a clean dashboard.",
    submission: "Describe how fetch(), async, and await work together. How do you handle cases where the API fails to return data (Error Handling)?",
    description: "Fetch and display real-time crypto data.",
    icon: <Database className="w-6 h-6 text-amber-600" />
  },
  {
    day: 5,
    category: "Validation",
    title: "Day 5: Secure Data Entry",
    scenario: "SecureBank is facing issues with users entering invalid email addresses and weak passwords.",
    task: "Create a robust form validation system for the login page.",
    submission: "Explain the use of 'Regex' (Regular Expressions) for email validation. List two security checks you must perform before allowing the form to submit.",
    description: "Build a form validation system with security checks.",
    icon: <Lock className="w-6 h-6 text-blue-600" />
  },
  {
    day: 6,
    category: "Components",
    title: "Day 6: Scalable Components",
    scenario: "ShopZilla is expanding. They have 100+ products and need a way to display them without writing repetitive code.",
    task: "Design a reusable 'Product Card' component using a modern framework like React.",
    submission: "Explain the difference between 'Props' and 'State'. How do you pass data dynamically to a single component to render different products?",
    description: "Design a reusable product card component in React.",
    icon: <Layout className="w-6 h-6 text-purple-600" />
  },
  {
    day: 7,
    category: "Performance",
    title: "Day 7: Performance & Launch",
    scenario: "It is launch day! You need to optimize the website so it loads in under 2 seconds.",
    task: "Optimize images, minify code, and prepare the site for production deployment.",
    submission: "List three strategies to improve website loading speed. Which platform (Vercel/Netlify/GitHub Pages) will you choose for deployment and why?",
    description: "Optimize and prepare a website for production launch.",
    icon: <Rocket className="w-6 h-6 text-indigo-600" />
  }
];

const uiuxDesignerContent: AssessmentItem[] = [
  {
    day: 1,
    category: "User Research",
    title: "Day 1: Empathy & Problem Research",
    scenario: "PetAdopt is an app for pet adoption. Users are complaining that the onboarding process is too long, confusing, and they are giving up halfway.",
    task: "Create a plan to understand this problem using 'User Research'.",
    submission: "List 3 specific questions you would ask users during an interview. Explain why creating a 'User Persona' is essential for this project.",
    description: "Plan user research to identify friction in PetAdopt's onboarding.",
    icon: <Search className="w-6 h-6 text-indigo-600" />
  },
  {
    day: 2,
    category: "User Flow",
    title: "Day 2: Mapping the Journey",
    scenario: "QuickCart wants its users to complete the checkout process within 3 clicks after adding items to the cart.",
    task: "Design the step-by-step user journey from login to 'Order Success'.",
    submission: "Describe the 'User Flow Diagram' steps. Explain how identifying 'Pain Points' in this journey helps improve the final design.",
    description: "Design a 3-click checkout journey for QuickCart.",
    icon: <Map className="w-6 h-6 text-emerald-600" />
  },
  {
    day: 3,
    category: "Wireframing",
    title: "Day 3: Skeleton of Design",
    scenario: "StudyBuddy is a student portal. They need a dashboard layout that helps students track their courses and progress.",
    task: "Create a structure (Wireframe) for the dashboard, focusing only on layout without colors or images.",
    submission: "Explain the benefits of 'Low-Fidelity Wireframes'. List 4 essential elements (e.g., Profile, Progress Bar) that must be on the dashboard and justify their placement.",
    description: "Create a low-fidelity wireframe for the StudyBuddy dashboard.",
    icon: <Layout className="w-6 h-6 text-rose-600" />
  },
  {
    day: 4,
    category: "Visual Identity",
    title: "Day 4: Visual Hierarchy & Colors",
    scenario: "LuxeStay is a premium hotel booking app, but their current design feels 'cheap' and dated.",
    task: "Decide on visual design elements that reflect a 'Premium' brand identity.",
    submission: "What 'Color Palette' and 'Typography' (font style) will you choose? Explain how you will use 'Negative Space' to create a clean, high-end feel.",
    description: "Define a premium visual identity for LuxeStay.",
    icon: <Palette className="w-6 h-6 text-amber-600" />
  },
  {
    day: 5,
    category: "UI Design",
    title: "Day 5: High-Fidelity UI",
    scenario: "CryptoWallet app needs a 'Send Money' screen that builds trust and is easy for first-time users.",
    task: "Design the logic and final look (mockup) of this screen.",
    submission: "How will you use 'Visual Hierarchy' to highlight the 'Confirm Transaction' button? What role do icons and shadows play in your design to guide the user?",
    description: "Design a high-fidelity 'Send Money' screen for CryptoWallet.",
    icon: <Smartphone className="w-6 h-6 text-blue-600" />
  },
  {
    day: 6,
    category: "Prototyping",
    title: "Day 6: Interactive Prototypes",
    scenario: "FoodMood delivery wants their app to feel 'Real' and responsive before going into development.",
    task: "Plan the screen transitions and animations (Micro-interactions) for the checkout flow.",
    submission: "Describe how you would use 'Smart Animate' or 'Transitions' (in tools like Figma) to make the user experience smooth. List 2 specific micro-interactions that would enhance the user experience (UX).",
    description: "Design interative transitions and micro-interactions for FoodMood.",
    icon: <Play className="w-6 h-6 text-purple-600" />
  },
  {
    day: 7,
    category: "Case Study",
    title: "Day 7: The Final Case Study",
    scenario: "It is time to present your work. You need to convert your 6 days of effort into a convincing professional portfolio piece.",
    task: "Explain the entire journey from the initial problem statement to the final design solution.",
    submission: "List 5 main headings for a professional UX Case Study. How would you incorporate user feedback from 'Usability Testing' into your final presentation?",
    description: "Consolidate your UX work into a professional portfolio case study.",
    icon: <Award className="w-6 h-6 text-indigo-600" />
  }
];

export const AssessmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  
  const assessmentContent = 
    role === 'data-scientist' ? dataScientistContent : 
    role === 'web-developer' ? webDeveloperContent : 
    role === 'ui-ux-designer' ? uiuxDesignerContent : 
    defaultAssessmentContent;
  
  const [currentDay, setCurrentDay] = useState(() => {
    const saved = localStorage.getItem('assessment_current_day');
    return saved ? parseInt(saved) : 1;
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    scores?: Record<string, number>;
    strength?: string;
    suggestion?: string;
    error?: string;
  } | null>(null);
  const [dailyScores, setDailyScores] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('assessment_daily_scores');
    return saved ? JSON.parse(saved) : {};
  });
  const [predictedSalary, setPredictedSalary] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [response, setResponse] = useState('');

  // Persist day and scores
  useEffect(() => {
    localStorage.setItem('assessment_current_day', currentDay.toString());
  }, [currentDay]);

  useEffect(() => {
    localStorage.setItem('assessment_daily_scores', JSON.stringify(dailyScores));
  }, [dailyScores]);
  
  const currentAssessment = assessmentContent[currentDay - 1];

  const handleEvaluate = async () => {
    if (!response.trim()) {
      alert("Please provide a response before submitting.");
      return;
    }

    setIsAnalyzing(true);
    setIsAnalysisModalOpen(true);
    setAnalysisResult(null);

    try {
      const userInfo = localStorage.getItem('jobsim_user');
      const token = userInfo ? JSON.parse(userInfo).token : '';

      const res = await fetch('/api/analysis/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: role || 'general',
          task: currentAssessment.task || currentAssessment.description,
          answer_text: response,
          image_path: "", // Placeholder for now
          day: currentDay
        }),
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Error during evaluation:', error);
      setAnalysisResult({ error: "Failed to connect to the evaluation service." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextExercise = () => {
    // Calculate average score for the day
    if (analysisResult?.scores) {
      const scores: number[] = Object.values(analysisResult.scores);
      const dayAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
      setDailyScores(prev => ({ ...prev, [currentDay]: dayAvg }));
    } else {
      setDailyScores(prev => ({ ...prev, [currentDay]: 0 })); // Fallback if no score
    }

    setIsAnalysisModalOpen(false);
    if (currentDay < 7) {
      setCurrentDay(currentDay + 1);
      setShowToast(true);
      setResponse('');
      setAnalysisResult(null);
    } else {
      handleCompleteSimulation();
    }
  };

  const handleCompleteSimulation = async () => {
    setIsAnalyzing(true);
    try {
      const userInfo = localStorage.getItem('jobsim_user');
      const token = userInfo ? JSON.parse(userInfo).token : '';

      const res = await fetch('/api/analysis/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: role || 'general'
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPredictedSalary(data.predictedSalary);
        setIsSuccessModalOpen(true);
      } else {
        alert(data.error || "Failed to complete simulation");
      }
    } catch (error) {
      console.error('Error completing simulation:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      setResponse('');
      setAnalysisResult(null);
    }
  };

  const calculateFinalAverage = () => {
    const scoreValues = Object.values(dailyScores);
    if (scoreValues.length === 0) return "0.0";
    const sum = scoreValues.reduce((a, b) => a + b, 0);
    return (sum / scoreValues.length).toFixed(1);
  };

  const getFeedbackMessage = (avg: number) => {
    const rounded = Math.round(avg);
    const mapping: Record<number, string> = {
      1: "Very poor response.",
      2: "Mostly incorrect.",
      3: "Weak understanding.",
      4: "Needs improvement.",
      5: "Average answer.",
      6: "Fair attempt.",
      7: "Good response.",
      8: "Very good answer.",
      9: "Excellent work.",
      10: "Perfect response.",
    };
    return mapping[rounded] || "Needs improvement.";
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-slate-900 leading-none">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <Clock className="w-5 h-5 text-indigo-600" />
               <span className="text-sm font-black text-slate-400 uppercase tracking-widest">7 Dedicated Days</span>
               <Zap className="w-5 h-5 text-amber-500 ml-4" />
               <span className="text-sm font-black text-slate-400 uppercase tracking-widest text-[#f59e0b]">Industry Simulation</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight capitalize">
              {role ? role.replace('-', ' ') : 'Skill'} Assessment
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Exercise {currentDay} of 7</span>
            <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                style={{ width: `${(currentDay / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Assessment Card */}
        <Card className="p-16 rounded-[2.5rem] border-slate-100 shadow-2xl shadow-indigo-100">
          <div className="flex justify-between items-center mb-12">
            <span className="px-6 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest border border-indigo-100">
              {currentAssessment.category}
            </span>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                disabled={currentDay === 1}
                className="p-2 rounded-full hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-slate-400" />
              </button>
              <span className="text-xl font-black text-slate-400">Day {currentDay}</span>
              <button 
                onClick={() => {
                  if (currentDay < 7) {
                    setCurrentDay(currentDay + 1);
                    setResponse('');
                  }
                }}
                disabled={currentDay === 7}
                className="p-2 rounded-full hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-6 h-6 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="max-w-4xl mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">{currentAssessment.title}</h2>
            
            {/* Roadmap Specific Details - Shown for roles like Data Scientist, Web Dev, and UI/UX */}
            {(role === 'data-scientist' || role === 'web-developer' || role === 'ui-ux-designer') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  {currentAssessment.dataset && (
                    <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Target Dataset</h4>
                      <p className="text-slate-900 font-bold">{currentAssessment.dataset}</p>
                    </div>
                  )}
                  {currentAssessment.scenario && (
                    <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100">
                      <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Company Scenario</h4>
                      <p className="text-slate-700 font-medium leading-relaxed">{currentAssessment.scenario}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  {currentAssessment.task && (
                    <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Your Task</h4>
                      <p className="text-slate-700 font-medium leading-relaxed">{currentAssessment.task}</p>
                    </div>
                  )}
                  {currentAssessment.submission && (
                    <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm">
                      <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Submission Requirement</h4>
                      <p className="text-slate-900 font-bold leading-relaxed">{currentAssessment.submission}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!role && (
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {currentAssessment.description}
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Your Detailed Response</label>
              <span className="text-xs font-bold text-slate-400 italic">Be as detailed as possible to showcase your industry readiness.</span>
            </div>
            <textarea 
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full min-h-[300px] p-10 rounded-[2rem] bg-slate-100/50 border-2 border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none text-lg font-medium text-slate-700 leading-relaxed placeholder:text-slate-300"
            />
          </div>

          <div className="mt-12 flex justify-end gap-4">
             <Button variant="ghost" className="px-10 py-5 rounded-2xl text-lg font-black text-slate-400 hover:text-slate-900">
               Save Draft
             </Button>
             <Button 
                onClick={handleEvaluate}
                className="px-12 py-5 rounded-2xl text-lg font-black shadow-xl shadow-indigo-200 transition-all active:scale-95 bg-indigo-600"
              >
               Submit for Evaluation
             </Button>
          </div>
        </Card>

        {/* Success Modal */}
        <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)}>
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Assessment Submitted!</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 max-w-sm mx-auto">
              Your 7-day skill assessment has been successfully recorded. Our industry experts will review your responses and update your profile shortly.
            </p>
            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 rounded-2xl text-lg font-black shadow-xl shadow-indigo-200 transition-all active:scale-95 bg-indigo-600"
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setIsSummaryModalOpen(true);
                }}
                className="w-full py-4 rounded-2xl text-lg font-black text-slate-400 hover:text-slate-900 transition-all"
              >
                View Summary
              </Button>
            </div>
          </div>
        </Modal>

        {/* Final Summary Modal */}
        <Modal isOpen={isSummaryModalOpen} onClose={() => setIsSummaryModalOpen(false)}>
          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight uppercase">Simulation Complete</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">7-Day Performance Analytics</p>
            
            <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 mb-10">
              <div className="flex flex-col items-center mb-8">
                <div className="text-6xl font-black text-indigo-600 mb-2">{calculateFinalAverage()}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Industry Score</div>
              </div>

              {predictedSalary !== null && (
                <div className="p-8 rounded-2xl bg-indigo-600 text-white mb-8 shadow-xl shadow-indigo-100">
                  <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-80">Predicted Annual Salary</p>
                  <p className="text-4xl font-black">₹{predictedSalary.toLocaleString()}</p>
                </div>
              )}
              
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Expert Feedback</p>
                <p className="text-xl font-bold text-slate-900">{getFeedbackMessage(Number(calculateFinalAverage()))}</p>
              </div>
            </div>

            <Button 
              onClick={async () => {
                // The profile is now updated by the backend /complete endpoint automatically
                localStorage.removeItem('assessment_current_day');
                localStorage.removeItem('assessment_daily_scores');
                navigate('/dashboard');
              }}
              className="w-full py-5 rounded-2xl text-lg font-black shadow-xl shadow-indigo-200 transition-all active:scale-95 bg-indigo-600"
            >
              Finish & Return to Dashboard
            </Button>
          </div>
        </Modal>

        
        {/* Analysis Modal */}
        <Modal isOpen={isAnalysisModalOpen} onClose={() => setIsAnalysisModalOpen(false)}>
          <div className="p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
                {isAnalyzing ? (
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Zap className="w-8 h-8 text-indigo-600" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Evaluation</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Day {currentDay} Performance</p>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="py-20 text-center">
                <p className="text-xl font-black text-slate-900 mb-2">Analyzing your response...</p>
                <p className="text-slate-400 font-medium">Comparing your logic with industry standards.</p>
              </div>
            ) : analysisResult?.error ? (
              <div className="p-8 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600">
                <p className="font-bold mb-2">Evaluation Error</p>
                <p className="text-sm">{analysisResult.error}</p>
                <Button 
                   onClick={handleEvaluate}
                   className="mt-4 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Retry Evaluation
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Scores Grid */}
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(analysisResult?.scores || {}).map(([key, val]) => (
                    <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                      <div className="text-3xl font-black text-indigo-600 mb-1">{val}/10</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key.toUpperCase()}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Strengths
                    </h4>
                    <p className="text-slate-600 font-medium leading-relaxed">{analysisResult?.strength}</p>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100">
                    <h4 className="text-sm font-black uppercase tracking-widest mb-4 opacity-80">Industry Suggestion</h4>
                    <p className="text-lg font-bold leading-relaxed">{analysisResult?.suggestion}</p>
                  </div>
                </div>

                <Button 
                  onClick={handleNextExercise}
                  className="w-full py-5 rounded-2xl text-lg font-black shadow-xl shadow-indigo-200 transition-all active:scale-95 bg-indigo-600"
                >
                  {currentDay === 7 ? "Complete Simulation" : "Continue to Day " + (currentDay + 1)}
                </Button>
              </div>
            )}
          </div>
        </Modal>


        <Toast 
          message="Successfully submitted exercise!" 
          isVisible={showToast} 
          onClose={() => setShowToast(false)} 
        />
      </div>
    </DashboardLayout>
  );
};
