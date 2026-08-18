import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, CheckCircle2, Clock, BookOpen, UserCheck, ShieldCheck, FileSpreadsheet, Bot, HelpCircle, User, LogOut, Mail, Calendar } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import axios from 'axios';

export default function Dashboard() {
  const { currentUser, logout, isMockAuth } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load completed exams from localStorage
  const [completedExams, setCompletedExams] = useState(() => {
    const saved = localStorage.getItem('completed_exams');
    return saved ? JSON.parse(saved) : {};
  });

  const handleRetakeExam = (examId) => {
    const updated = { ...completedExams };
    delete updated[examId];
    setCompletedExams(updated);
    localStorage.setItem('completed_exams', JSON.stringify(updated));
    navigate(`/assessment/${examId}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const serverUrl = import.meta.env.VITE_SERVER_URL || '';
        const [assessResponse, ticketResponse] = await Promise.all([
          axios.get(`${serverUrl}/api/assessments`),
          axios.get(`${serverUrl}/api/tickets`).catch(() => ({ data: [] }))
        ]);
        setAssessments(assessResponse.data);
        setMyTickets(ticketResponse.data.filter(t => t.studentEmail === currentUser?.email) || []);
      } catch (error) {
        console.error("Failed to load assessments or tickets, loading local fallback:", error);
        setAssessments([
          {
            id: 'web-dev-101',
            title: 'Web Development Fundamentals',
            description: 'Evaluate your knowledge of HTML, CSS, JavaScript, and modern tooling (Vite/React).',
            durationMinutes: 15,
            questionsCount: 3,
            points: 30
          },
          {
            id: 'dsa-201',
            title: 'Data Structures & Algorithms Practice',
            description: 'Test your knowledge on space/time complexities, recursive programming, and data structures.',
            durationMinutes: 30,
            questionsCount: 3,
            points: 50
          }
        ]);
        
        // Mock fallback tickets
        setMyTickets([
          {
            id: 'tkt-mock-1',
            studentEmail: currentUser?.email || 'student@test.com',
            subject: 'Locked out of exam due to tab switch',
            description: 'My browser lost focus accidentally because of a Windows update popup.',
            status: 'Open',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser]);

  const studentName = currentUser?.displayName || currentUser?.email.split('@')[0] || 'Student';

  return (
    <div className="flex flex-col gap-8 flex-grow py-4 animate-fade-in relative z-10">
      <div className="mesh-bg"></div>

      {/* Profile & Student Header Banner */}
      <Card variant="accent" className="border-blue-500/10 bg-gradient-to-r from-blue-950/20 to-sky-950/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-sky-500 rounded-full flex items-center justify-center text-white border-2 border-slate-800 shadow-md select-none">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt={studentName} className="h-full w-full rounded-full object-cover" />
            ) : (
              <User size={30} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white leading-tight m-0">{studentName}</h2>
              <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-blue-950/30 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">
                Student Profile Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 leading-none">
              <Mail size={12} className="text-slate-550" />
              <span>{currentUser?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/20 text-emerald-450 border border-emerald-900/30 text-xs font-semibold select-none">
            <ShieldCheck size={16} />
            <span>Proctor Standing: Excellent</span>
          </div>

          <Button 
            variant="danger" 
            onClick={logout}
            className="!px-4 !py-2 !rounded-xl text-xs font-bold"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </Button>
        </div>
      </Card>

      {/* Main Grid: Scheduled Exams & Status (Full Width) */}
      <div className="flex flex-col gap-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-0">
          <Calendar size={18} className="text-blue-500" />
          <span>Upcoming Exams & Assignments</span>
        </h3>

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium">Retrieving exam rosters...</div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-12 text-slate-550">No assessments scheduled.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {assessments.map(item => {
              const isCompleted = completedExams[item.id] !== undefined;
              return (
                <Card 
                  key={item.id} 
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800 shadow-sm transition-all duration-200 hover:shadow-md ${
                    isCompleted ? 'opacity-60 bg-slate-950/40' : 'bg-slate-900/50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-white leading-none">{item.title}</h4>
                      <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isCompleted 
                          ? 'bg-emerald-950/25 text-emerald-450 border border-emerald-900/30' 
                          : 'bg-blue-955/40 text-blue-400 border border-blue-500/20'
                      }`}>
                        {isCompleted ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl m-0">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={13} className="text-slate-500" /> {item.durationMinutes} Minutes
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <BookOpen size={13} className="text-slate-550" /> {item.questionsCount} Questions
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <UserCheck size={13} className="text-slate-550" /> {item.points} Points Max
                      </span>
                    </div>
                  </div>

                  <div className="sm:self-center flex-shrink-0 w-full sm:w-auto">
                    {isCompleted ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <span className="text-[10px] text-center font-bold tracking-wider uppercase px-3 py-2 bg-emerald-950/20 text-emerald-450 border border-emerald-900/30 rounded-xl select-none">
                          Completed
                        </span>
                        <Button 
                          variant="secondary" 
                          onClick={() => handleRetakeExam(item.id)}
                          className="w-full sm:w-auto border-blue-500/20 text-blue-400 bg-blue-955/20 hover:bg-blue-955/40"
                        >
                          Retake Test
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/assessment/${item.id}`)}
                        className="w-full sm:w-auto font-bold px-5 shadow-md shadow-blue-500/10"
                      >
                        <Play size={12} fill="currentColor" />
                        <span>Start Exam</span>
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Support Tickets Tracker Section */}
      <div className="flex flex-col gap-4 mt-6">
        <div>
          <h3 className="text-base font-black text-white m-0 flex items-center gap-2">
            🎟️ My Support Tickets Status
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Track status and proctor resolutions of your submitted technical help requests.
          </p>
        </div>

        {myTickets.length === 0 ? (
          <Card className="bg-slate-905/40 border-slate-800 text-center py-6 text-slate-400 text-xs font-semibold">
            No active support tickets raised. You can raise a ticket at any time using the AI Chatbot widget.
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {myTickets.map(ticket => {
              const isResolved = ticket.status === 'Resolved';
              return (
                <Card 
                  key={ticket.id} 
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800 shadow-sm ${
                    isResolved ? 'opacity-65 bg-slate-955/40' : 'bg-slate-905/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                      isResolved ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-450' : 'bg-blue-955/20 border-blue-900/30 text-blue-450'
                    }`}>
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-350 font-mono">{ticket.id}</span>
                        <span className="text-[8px] text-slate-455 font-mono">
                          {new Date(ticket.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-200 m-0 leading-snug">Subject: {ticket.subject}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal break-words">"{ticket.description}"</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 self-end sm:self-center">
                    <span className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                      isResolved 
                        ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                        : 'bg-amber-950/20 text-amber-400 border border-amber-900/30'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
