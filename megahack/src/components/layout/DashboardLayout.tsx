import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search, Mail, MapPin, Headphones, HelpCircle, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('jobsim_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const userName = user?.name || "Nihar Saw";
  const userEmail = user?.email || "nihar@example.com";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-12 sticky top-0 z-10">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources, simulations..." 
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-4 pl-6 border-l border-slate-100 cursor-pointer group"
            >
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{userName}</div>
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Active Candidate</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-indigo-100 p-0.5 overflow-hidden shadow-sm group-hover:border-indigo-300 transition-all">
                <div className="w-full h-full bg-indigo-600 rounded-[14px] flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Profile Sidebar Drawer */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">User Profile</h2>
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-xl shadow-indigo-100 mb-6">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">{userName}</h3>
                <p className="text-slate-400 font-medium text-sm">{userEmail}</p>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-bold text-slate-900">{userEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-slate-900">India, Global</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all group">
                    <div className="p-2 rounded-xl bg-white text-emerald-600 shadow-sm border border-emerald-100 group-hover:scale-110 transition-all">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest leading-none">Support</span>
                  </button>

                  <button className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all group">
                    <div className="p-2 rounded-xl bg-white text-indigo-600 shadow-sm border border-indigo-100 group-hover:scale-110 transition-all">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-indigo-700 uppercase tracking-widest leading-none">Help Hub</span>
                  </button>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <div className="p-6 rounded-3xl bg-slate-900 text-white">
                  <div className="text-center">
                    <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Account Status</div>
                    <div className="text-sm font-bold">Premium Industry Access</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
