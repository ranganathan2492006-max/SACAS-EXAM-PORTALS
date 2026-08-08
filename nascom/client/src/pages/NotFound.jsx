import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col justify-center items-center py-12 animate-fade-in relative z-10">
      <div className="mesh-bg"></div>

      <Card className="max-w-md w-full text-center border border-slate-200/60 shadow-xl shadow-slate-100 flex flex-col items-center gap-5 p-8 bg-white/95">
        <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center border border-rose-100 animate-bounce">
          <AlertCircle size={36} />
        </div>

        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight m-0">404</h2>
          <p className="text-sm font-bold text-slate-700 mt-1 uppercase tracking-wider leading-none">Security Alert: Page Not Found</p>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            The page you are trying to access is not registered in the proctored workspace or has been restricted.
          </p>
        </div>

        <Button 
          onClick={() => navigate('/')} 
          className="w-full mt-2 font-bold py-3.5 shadow-lg shadow-blue-500/10"
        >
          <Home size={16} />
          <span>Return to Portal</span>
        </Button>
      </Card>
    </div>
  );
}
