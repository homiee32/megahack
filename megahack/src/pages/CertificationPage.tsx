import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Award, Download, Lock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import teamVoughtLogo from '../assets/team_vought_logo.png';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface UserInfo {
  name?: string;
  email?: string;
  skillScore: number;
  marketValueMin: number;
  marketValueMax: number;
  industryReadiness: number;
  token?: string;
}

export const CertificationPage = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('jobsim_user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      // Small delay to ensure any animations are settled
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true, // Enable for user debugging if they check console
        backgroundColor: '#f8fafc',
        windowWidth: 1200, // Fixed width for consistent capture
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const fileName = `Certificate_${user?.name?.replace(/\s+/g, '_') || 'Industry_Readiness'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Download failed:', error);
      alert(`Failed to generate PDF: ${message}. Please ensure your browser supports canvas capture.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const hasScore = (user?.skillScore ?? 0) > 0;
  const grade = hasScore ? ((user?.skillScore ?? 0) / 10).toFixed(1) : "0.0";
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Official Certifications</h2>
            <p className="text-slate-500 font-bold">Industry-recognized validation of your technical proficiency</p>
          </div>
        </div>

        {!showCertificate ? (
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 rounded-[3rem] border-slate-100 shadow-2xl shadow-slate-200/50 text-center space-y-8 bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />

              <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                <Award className="w-12 h-12 text-indigo-600" />
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Industry Readiness Certificate</h3>
                <p className="text-slate-500 font-bold max-w-lg mx-auto leading-relaxed">
                  This certificate is awarded to candidates who have successfully completed the 7-day intensive industry simulation and demonstrated professional-grade competence.
                </p>
              </div>

              <div className="pt-8 border-t border-slate-50 flex flex-col items-center gap-6">
                {hasScore ? (
                  <>
                    <div className="flex items-center gap-8 justify-center">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
                        <p className="text-2xl font-black text-indigo-600">{user?.skillScore ?? 0}/100</p>
                      </div>
                      <div className="w-px h-10 bg-slate-100" />
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Grade</p>
                        <p className="text-2xl font-black text-emerald-500">{grade}/10.0</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowCertificate(true)}
                      className="px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 bg-indigo-600 text-white"
                    >
                      Generate My Certificate
                    </Button>
                  </>
                ) : (
                  <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 max-w-md">
                    <Lock className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold mb-4">You haven't earned any marks yet.</p>
                    <p className="text-sm text-slate-400 font-medium mb-6">Complete your 7-day assessment to unlock your professional certification.</p>
                    <Button 
                      variant="outline" 
                      className="w-full py-4 rounded-xl border-2 border-slate-200 font-bold text-slate-400 hover:text-slate-900 hover:border-slate-300" 
                      onClick={() => navigate('/assessment')}
                    >
                      Go to Assessment
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Actions Bar */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="px-6 py-3 rounded-xl font-bold border-2 border-slate-200 flex items-center gap-2 hover:bg-slate-50" onClick={() => setShowCertificate(false)}>
                Back
              </Button>
              <Button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 bg-indigo-600 disabled:opacity-50"
              >
                {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 text-white" />} 
                {isDownloading ? <span className="text-white">Generating...</span> : <span className="text-white">Download PDF</span>}
              </Button>
            </div>

            {/* The Certificate Template */}
            <div className="max-w-5xl mx-auto bg-white p-2 shadow-2xl rounded-sm border border-slate-200 relative overflow-hidden">
              {/* Certificate Content Wrapper */}
              <div 
                ref={certificateRef} 
                className="relative p-16 min-h-[700px] flex flex-col items-center justify-between overflow-hidden"
                style={{ 
                  border: '16px solid #1e1b4b',
                  backgroundColor: '#f8fafc'
                }}
              >
                
                {/* Subtle Background Elements (Watercolor feel) */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div 
                    className="absolute top-[-10%] left-[-10%] w-full h-full rounded-full blur-[120px]" 
                    style={{ background: 'radial-gradient(circle, #a5b4fc 0%, transparent 70%)' }}
                  />
                  <div 
                    className="absolute bottom-[-10%] right-[-10%] w-full h-full rounded-full blur-[120px]" 
                    style={{ background: 'radial-gradient(circle, #bae6fd 0%, transparent 70%)' }}
                  />
                </div>

                {/* Top Accents - Fixed for compatibility */}
                <div 
                  className="absolute top-0 right-0 w-0 h-0" 
                  style={{ borderTop: '150px solid #1e1b4b', borderLeft: '150px solid transparent' }}
                />
                <div 
                  className="absolute top-0 left-0 w-0 h-0" 
                  style={{ borderTop: '100px solid #4338ca', borderRight: '100px solid transparent' }}
                />

                {/* Body Content */}
                <div className="relative z-10 text-center w-full flex flex-col items-center">
                  
                  {/* Team Vought Logo */}
                  <div className="mb-10">
                    <img src={teamVoughtLogo} alt="Team Vought" className="h-20 object-contain" />
                  </div>

                  <h1 
                    className="text-6xl italic mb-12" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      color: '#1e1b4b'
                    }}
                  >
                    Certificate of Completion
                  </h1>

                  <p 
                    className="text-xl font-medium mb-12 tracking-wide uppercase"
                    style={{ color: '#64748b' }}
                  >
                    This is to certify that
                  </p>

                  <h2 
                    className="text-5xl font-black mb-12 tracking-tight uppercase border-b-4 pb-4 px-12 inline-block"
                    style={{ 
                      color: '#0f172a',
                      borderColor: '#1e1b4b'
                    }}
                  >
                    {user?.name || "JOHNNY DOE"}
                  </h2>

                  <div className="max-w-2xl text-center space-y-6 mb-16">
                    <p 
                      className="text-lg leading-relaxed italic"
                      style={{ color: '#475569' }}
                    >
                      Has demonstrated exceptional technical proficiency and industry readiness throughout the intensive 7-day simulation program. This award recognizes their mastery of career-critical skills and commitment to professional excellence.
                    </p>
                    <div className="pt-4">
                      <span 
                        className="text-sm uppercase font-black tracking-widest block mb-1"
                        style={{ color: '#94a3b8' }}
                      >
                        Earned Grade
                      </span>
                      <span 
                        className="text-4xl font-black"
                        style={{ color: '#1e1b4b' }}
                      >
                        {grade} <span style={{ color: '#cbd5e1' }}>/ 10.0</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Hooks (Signature/Date) */}
                <div 
                  className="relative z-10 w-full flex justify-around items-end pt-12 border-t"
                  style={{ borderColor: '#f1f5f9' }}
                >
                  <div className="text-center">
                    <div 
                      className="w-48 border-b-2 mb-2" 
                      style={{ borderColor: '#0f172a' }}
                    />
                    <p 
                      className="text-xs font-black uppercase tracking-widest"
                      style={{ color: '#94a3b8' }}
                    >
                      Date issued
                    </p>
                    <p 
                      className="text-sm font-bold mt-1"
                      style={{ color: '#0f172a' }}
                    >
                      {today}
                    </p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-48 h-12 flex items-center justify-center italic text-2xl" 
                      style={{ 
                        fontFamily: "'Playfair Display', serif",
                        color: '#1e1b4b' 
                      }}
                    >
                      Team Vought
                    </div>
                    <div 
                      className="w-48 border-b-2 mb-2" 
                      style={{ borderColor: '#0f172a' }}
                    />
                    <p 
                      className="text-xs font-black uppercase tracking-widest"
                      style={{ color: '#94a3b8' }}
                    >
                      Authorized Signature
                    </p>
                  </div>
                </div>

                {/* Bottom Accents - Fixed for compatibility */}
                <div 
                  className="absolute bottom-0 left-0 w-0 h-0" 
                  style={{ borderBottom: '150px solid #1e1b4b', borderRight: '150px solid transparent' }}
                />
                <div 
                  className="absolute bottom-0 right-0 w-0 h-0" 
                  style={{ borderBottom: '100px solid #4338ca', borderLeft: '100px solid transparent' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
