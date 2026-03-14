import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Award,
  TrendingUp,
  Target,
  ArrowUpRight
} from 'lucide-react';

const CAREER_PATHS = [
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
    active: true,
    description: 'Master data analysis, ML models, and statistical storytelling.'
  },
  {
    id: 'web-developer',
    title: 'Web Developer',
    icon: <Plus className="w-8 h-8 text-emerald-600" />,
    active: true,
    description: 'Build modern, scalable web applications using React and Node.js.'
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    icon: <Award className="w-8 h-8 text-rose-600" />,
    active: true,
    description: 'Create stunning user interfaces and seamless user experiences.'
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    icon: <Target className="w-8 h-8 text-slate-400" />,
    active: false,
    description: 'Design and deploy advanced AI systems and neural networks.'
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    icon: <ArrowUpRight className="w-8 h-8 text-slate-400" />,
    active: false,
    description: 'Automate deployments and manage cloud infrastructure.'
  },
  {
    id: 'security-analyst',
    title: 'Security Analyst',
    icon: <Plus className="w-8 h-8 text-slate-400" />,
    active: false,
    description: 'Protect systems and networks from cyber threats and breaches.'
  }
];

export const DashboardPage = () => {
  const [userStats, setUserStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userInfo = localStorage.getItem('jobsim_user');
        if (!userInfo) {
          navigate('/login');
          return;
        }

        const { token } = JSON.parse(userInfo);
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const userRes = await fetch('/api/users/profile', config);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserStats(userData);
        } else {
          localStorage.removeItem('jobsim_user');
          navigate('/login');
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Welcome Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Career Paths</h2>
            <p className="text-slate-500 font-bold">Choose your industry simulation and start growing</p>
          </div>
        </div>

        {/* Status Indicators */}
        {userStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatMiniCard
              title="Skill Score"
              value={`${userStats.skillScore}/100`}
              change="+12%"
              icon={<Award className="w-6 h-6 text-indigo-600" />}
              description="Avg. across all domains"
            />
            <StatMiniCard
              title="Market Value"
              value={`₹${(userStats.marketValueMin / 1000).toFixed(0)}k - ₹${(userStats.marketValueMax / 1000).toFixed(0)}k`}
              change="+$5k"
              icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
              description="Estimated annual salary"
            />
            <StatMiniCard
              title="Industry Readiness"
              value={`${userStats.industryReadiness}%`}
              change="+8%"
              icon={<Target className="w-6 h-6 text-amber-600" />}
              description="Match for target roles"
            />
          </div>
        ) : (
          <div className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
        )}

        {/* Career Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {CAREER_PATHS.map((path) => (
            <CareerPathCard
              key={path.id}
              {...path}
              onClick={() => {
                if (path.active) {
                  navigate(`/assessment?role=${path.id}`);
                }
              }}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

const CareerPathCard = ({ title, icon, active, description, onClick }: any) => (
  <Card
    onClick={onClick}
    className={`p-10 rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-100/50 transition-all relative overflow-hidden group flex flex-col h-full ${active
        ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-2'
        : 'opacity-60 cursor-not-allowed bg-slate-50/50'
      }`}
  >
    {!active && (
      <div className="absolute top-6 right-6 z-10">
        <span className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-300">
          Coming Soon
        </span>
      </div>
    )}

    <div className={`w-20 h-20 rounded-[2rem] ${active ? 'bg-white shadow-xl shadow-slate-200 border border-slate-50' : 'bg-slate-100'} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </div>

    <div className="flex-grow">
      <h3 className={`text-2xl font-black mb-4 tracking-tight ${active ? 'text-slate-900' : 'text-slate-500'}`}>
        {title}
      </h3>
      <p className="text-slate-400 font-bold leading-relaxed mb-8">
        {description}
      </p>
    </div>

    <div className="flex items-center gap-2 mt-auto">
      {active ? (
        <>
          <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">Start Simulation</span>
          <ArrowUpRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </>
      ) : (
        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Under Construction</span>
      )}
    </div>

    {/* Subtle background decoration */}
    <div className={`absolute -right-12 -bottom-12 w-40 h-40 rounded-full ${active ? 'bg-slate-50/50' : 'bg-slate-100/30'} blur-3xl`} />
  </Card>
);

const StatMiniCard = ({ title, value, change, icon, description }: any) => (
  <Card className="p-8 rounded-[2rem] border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl transition-all cursor-default group overflow-hidden relative">
    <div className="absolute -right-8 -top-8 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
    <div className="relative">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-slate-50 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex items-center gap-1 font-black text-emerald-500 text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <ArrowUpRight className="w-3 h-3" /> {change}
        </div>
      </div>
      <div className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-widest">{title}</div>
      <div className="text-3xl font-black text-slate-900 mb-2">{value}</div>
      <p className="text-xs font-bold text-slate-400">{description}</p>
    </div>
  </Card>
);
