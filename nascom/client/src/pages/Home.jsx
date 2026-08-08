import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight } from 'lucide-react';
import Button from '../components/UI/Button';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  function handleCTA() {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }

  return (
    <div className="flex-grow flex flex-col justify-center py-6 animate-fade-in relative z-10">
      <div className="mesh-bg"></div>

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto py-12 md:py-16 px-4 flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-95/40 text-blue-400 border border-blue-500/20 shadow-sm animate-pulse-slow">
          <GraduationCap size={14} />
          <span>SACAS EXAM PORTAL v2.0</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] m-0">
          <span className="bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">SACAS EXAM PORTAL</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed m-0">
          A state-of-the-art secure online assessment environment combining AI help desks, proactive incident reporting, and premium proctor dashboards.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <Button 
            onClick={handleCTA}
            className="font-bold py-3.5 px-8 text-base shadow-lg shadow-blue-500/10 group hover:translate-y-[-1px] active:translate-y-0"
          >
            <span>Launch Exam Portal</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button 
            variant="secondary"
            onClick={() => navigate('/faq')}
            className="font-semibold py-3.5 px-8 text-base border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
          >
            <span>Explore FAQs</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
