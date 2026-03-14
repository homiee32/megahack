import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { 
  Layers, 
  ChevronRight, 
  CheckCircle2,
  Circle,
  Code2,
  Globe,
  Search,
  BookOpen,
  Lightbulb,
  Smartphone,
  ShieldCheck,
  Terminal,
  Activity
} from 'lucide-react';

interface RoadmapStep {
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'locked';
}

interface RoleRoadmap {
  title: string;
  match: number;
  roadmap: RoadmapStep[];
  topics: string[];
  proTip: string;
}

const roleRoadmaps: Record<string, RoleRoadmap> = {
  'Frontend Developer': {
    title: 'Frontend Developer Profile',
    match: 85,
    roadmap: [
      { title: 'HTML & CSS Mastery', description: 'Advanced layouts and responsive design.', status: 'completed' },
      { title: 'JavaScript Fundamentals', description: 'ES6+, Async/Await, and DOM manipulation.', status: 'completed' },
      { title: 'React ecosystem', description: 'React Router, Redux/Toolkit, and Framer Motion.', status: 'in-progress' },
      { title: 'Unit Testing', description: 'Jest and React Testing Library.', status: 'locked' },
      { title: 'Next.js & SSR', description: 'Server-side rendering and static site generation.', status: 'locked' }
    ],
    topics: ['React Hooks', 'State Management', 'Performance', 'Accessibility'],
    proTip: 'Deep diving into React Hooks and State Management will boost your match score by an estimated 12% by next month.'
  },
  'Full Stack Engineer': {
    title: 'Full Stack Engineer Profile',
    match: 72,
    roadmap: [
      { title: 'Frontend Core', description: 'HTML, CSS, and modern JavaScript framework.', status: 'completed' },
      { title: 'Node.js & Express', description: 'Building RESTful APIs and middleware.', status: 'completed' },
      { title: 'Database Management', description: 'PostgreSQL, MongoDB, and ORMs (Prisma).', status: 'in-progress' },
      { title: 'External APIs', description: 'Integration with 3rd party services like Stripe/Twilio.', status: 'locked' },
      { title: 'Deployment & CI/CD', description: 'Docker, GitHub Actions, and AWS deployment.', status: 'locked' }
    ],
    topics: ['API Architecture', 'Security', 'Database Tuning', 'GraphQL'],
    proTip: 'Focusing on Backend Security and PostgreSQL optimization will make you a highly sought-after Full Stack candidate.'
  },
  'UI/UX Designer': {
    title: 'UI/UX Designer Profile',
    match: 65,
    roadmap: [
      { title: 'Design Principles', description: 'Visual hierarchy, typography, and color theory.', status: 'completed' },
      { title: 'Figma Mastery', description: 'Auto-layout, components, and design systems.', status: 'in-progress' },
      { title: 'User Research', description: 'Personas, user flows, and wireframing.', status: 'locked' },
      { title: 'Prototyping', description: 'High-fidelity interactive prototypes.', status: 'locked' },
      { title: 'Usability Testing', description: 'Gathering feedback and iterative design.', status: 'locked' }
    ],
    topics: ['Design Systems', 'User Research', 'Typography', 'Autolayout'],
    proTip: 'Building a strong portfolio with at least 3 high-fidelity case studies will significantly improve your industry match.'
  },
  'DevOps Engineer': {
    title: 'DevOps Engineer Profile',
    match: 58,
    roadmap: [
      { title: 'Linux & Scripting', description: 'Bash shell scripting and system administration.', status: 'completed' },
      { title: 'Cloud Platforms', description: 'AWS, Azure, or GCP infrastructure services.', status: 'in-progress' },
      { title: 'Containers', description: 'Docker containerization and orchestration (K8s).', status: 'locked' },
      { title: 'CI/CD Pipelines', description: 'Jenkins, GitLab CI, or GitHub Actions.', status: 'locked' },
      { title: 'Infrastructure as Code', description: 'Terraform and CloudFormation.', status: 'locked' }
    ],
    topics: ['AWS Lambda', 'Terraform', 'Kubernetes', 'Monitoring'],
    proTip: 'Getting certified in AWS Solution Architect or Kubernetes Administrator will immediately boost your profile visibility.'
  },
  'Data Scientist': {
    title: 'Data Scientist Profile',
    match: 42,
    roadmap: [
      { title: 'Python for Data Science', description: 'Pandas, NumPy, and Matplotlib mastery.', status: 'completed' },
      { title: 'Statistics & Probability', description: 'Descriptive and inferential statistics.', status: 'in-progress' },
      { title: 'Machine Learning', description: 'Supervised and unsupervised learning models.', status: 'locked' },
      { title: 'Deep Learning', description: 'Neural networks with TensorFlow or PyTorch.', status: 'locked' },
      { title: 'Big Data Tools', description: 'Apache Spark and Hadoop ecosystem.', status: 'locked' }
    ],
    topics: ['Regression', 'Classification', 'NLP', 'Data Visualization'],
    proTip: 'Contributing to open-source ML libraries or participating in Kaggle competitions can validate your skills to employers.'
  },
  'Mobile App Developer': {
    title: 'Mobile App Developer Profile',
    match: 38,
    roadmap: [
      { title: 'Native Development', description: 'Swift for iOS or Kotlin for Android.', status: 'completed' },
      { title: 'Cross-Platform Core', description: 'React Native or Flutter fundamentals.', status: 'in-progress' },
      { title: 'Mobile UI/UX', description: 'Adaptive layouts and mobile animations.', status: 'locked' },
      { title: 'State Management', description: 'Redux, MobX, or Provider patterns.', status: 'locked' },
      { title: 'App Store Guidelines', description: 'Deployment and submission processes.', status: 'locked' }
    ],
    topics: ['React Native', 'Flutter', 'Animation', 'Persistence'],
    proTip: 'Building and publishing a functional app to the App Store/Play Store is the best way to prove your expertise.'
  },
  'Web Developer': {
    title: 'Web Developer Profile',
    match: 82,
    roadmap: [
      { title: 'Layout & Responsive Design', description: 'Mastering modern CSS, Flexbox, and Grid.', status: 'completed' },
      { title: 'JavaScript & Interactivity', description: 'DOM manipulation and event-driven logic.', status: 'completed' },
      { title: 'Frontend Frameworks', description: 'Building scalable apps with React or Next.js.', status: 'in-progress' },
      { title: 'API & State Management', description: 'Fetching data and managing application state.', status: 'locked' },
      { title: 'Deployment & Performance', description: 'Optimizing and launching production websites.', status: 'locked' }
    ],
    topics: ['CSS Architecture', 'React Ecosystem', 'REST APIs', 'Performance'],
    proTip: 'Mastering responsive design and modern CSS layouts will make you a highly efficient Web Developer.'
  },
  'QA Engineer': {
    title: 'QA Engineer Profile',
    match: 25,
    roadmap: [
      { title: 'Testing Fundamentals', description: 'Manual testing, bug reporting, and test plans.', status: 'completed' },
      { title: 'Automation Basics', description: 'Mastering Selenium, Cypress, or Playwright.', status: 'in-progress' },
      { title: 'API Testing', description: 'Validation with Postman and automated API tests.', status: 'locked' },
      { title: 'Performance Testing', description: 'Load testing with JMeter or Locust.', status: 'locked' },
      { title: 'Mobile & Cloud Testing', description: 'Testing on real devices and cloud labs.', status: 'locked' }
    ],
    topics: ['Automation', 'API Testing', 'Bug Tracking', 'Test Strategy'],
    proTip: 'Learning to write clean, maintainable automation scripts is the key to advancing into a Senior QA role.'
  },
  'Product Manager': {
    title: 'Product Manager Profile',
    match: 30,
    roadmap: [
      { title: 'Product Vision', description: 'Defining goals and roadmap strategy.', status: 'completed' },
      { title: 'Market Research', description: 'Competitor analysis and user personas.', status: 'in-progress' },
      { title: 'Agile & Scrum', description: 'Managing sprints and backlog grooming.', status: 'locked' },
      { title: 'Data Analytics', description: 'Tracking KPIs and user behavior metrics.', status: 'locked' },
      { title: 'Stakeholder Management', description: 'Coordinating between design and engineering.', status: 'locked' }
    ],
    topics: ['User Stories', 'Agile', 'Market Analysis', 'Roadmapping'],
    proTip: 'Developing a customer-centric mindset will help you build features that users actually love and use.'
  }
};

const roles = [
  {
    title: 'Frontend Developer',
    description: 'Specializes in building high-performance, accessible user interfaces using React.',
    match: 85,
    icon: <Globe className="w-6 h-6 text-indigo-600" />
  },
  {
    title: 'Full Stack Engineer',
    description: 'Handles both frontend and backend development with Node.js and PostgreSQL.',
    match: 72,
    icon: <Layers className="w-6 h-6 text-emerald-600" />
  },
  {
    title: 'UI/UX Designer',
    description: 'Focuses on creating intuitive and visually appealing designs with Figma.',
    match: 65,
    icon: <Search className="w-6 h-6 text-amber-600" />
  },
  {
    title: 'DevOps Engineer',
    description: 'Manages cloud infrastructure and CI/CD pipelines using AWS and Docker.',
    match: 58,
    icon: <ShieldCheck className="w-6 h-6 text-rose-600" />
  },
  {
    title: 'Web Developer',
    description: 'Specializes in building modern, responsive websites and web applications.',
    match: 82,
    icon: <Globe className="w-6 h-6 text-emerald-600" />
  },
  {
    title: 'Data Scientist',
    description: 'Analyzes complex datasets to extract actionable insights using Python and ML.',
    match: 42,
    icon: <Activity className="w-6 h-6 text-violet-600" />
  },
  {
    title: 'Mobile App Developer',
    description: 'Builds cross-platform mobile applications using React Native and Flutter.',
    match: 38,
    icon: <Smartphone className="w-6 h-6 text-pink-600" />
  },
  {
    title: 'QA Engineer',
    description: 'Ensures software quality through automated and manual testing processes.',
    match: 25,
    icon: <Terminal className="w-6 h-6 text-cyan-600" />
  },
  {
    title: 'Product Manager',
    description: 'Oversees development lifecycle and coordinates between teams.',
    match: 30,
    icon: <Layers className="w-6 h-6 text-yellow-600" />
  }
];

export const CareerPage = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const currentRoadmap = selectedRole ? roleRoadmaps[selectedRole] : null;

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        {/* Header */}
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Career Paths</h2>
          <p className="text-slate-500 font-bold">Discover your best-fit roles and personalized learning roadmaps.</p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="p-8 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {role.icon}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                    {role.match}% Match
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{role.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{role.description}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedRole(role.title)}
                className="w-full py-4 rounded-xl font-black border-2 flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group/btn"
              >
                View Role Profile <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Role Profile Modal */}
        <Modal isOpen={!!selectedRole} onClose={() => setSelectedRole(null)}>
          {currentRoadmap && (
            <div className="p-10 max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-200">
                    <Code2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">{currentRoadmap.title}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Top Recommendation for your skill set</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-emerald-500">{currentRoadmap.match}%</div>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Match Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Roadmap Timeline */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-10">
                    <Layers className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Career Roadmap</h3>
                  </div>

                  <div className="space-y-12 relative pl-4">
                    <div className="absolute left-10 top-6 bottom-6 w-0.5 bg-slate-100" />
                    
                    {currentRoadmap.roadmap.map((step, idx) => (
                      <div key={idx} className="flex gap-8 relative z-10 items-start">
                        <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg transition-all ${
                          step.status === 'completed' ? 'bg-emerald-500 text-white' :
                          step.status === 'in-progress' ? 'bg-indigo-600 text-white animate-pulse' :
                          'bg-white text-slate-300 border-2 border-slate-100'
                        }`}>
                          {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                           step.status === 'in-progress' ? <Activity className="w-6 h-6" /> :
                           <Circle className="w-6 h-6" />}
                        </div>
                        <div className="pt-2">
                          <h4 className={`text-xl font-black mb-1 tracking-tight ${step.status === 'locked' ? 'text-slate-300' : 'text-slate-900'}`}>
                            {step.title}
                          </h4>
                          <p className="text-slate-500 font-medium leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-10">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Learning Topics</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {currentRoadmap.topics.map((topic, idx) => (
                        <div key={idx} className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 group hover:bg-white hover:shadow-xl transition-all cursor-default">
                          <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-600 transition-all" />
                          <span className="text-sm font-black text-slate-600">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 shadow-xl shadow-indigo-100/20 relative overflow-hidden group">
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest">Pro Tip</h4>
                      </div>
                      <p className="text-slate-600 font-bold leading-relaxed italic">
                        "{currentRoadmap.proTip}"
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setSelectedRole(null)}
                    className="w-full py-5 rounded-[1.5rem] bg-indigo-600 font-black shadow-2xl shadow-indigo-200 transition-all active:scale-95"
                  >
                    Close Profile
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};
