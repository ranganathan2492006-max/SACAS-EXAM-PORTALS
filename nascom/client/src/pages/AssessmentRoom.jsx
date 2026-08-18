import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AssessmentPane from '../components/AssessmentPane';
import ChatInterface from '../components/ChatInterface';
import IncidentLogger from '../components/IncidentLogger';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { AlertCircle, Terminal, HelpCircle, MessageSquare, ShieldCheck, X } from 'lucide-react';
import axios from 'axios';

export default function AssessmentRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(true); // Default open on desktop

  // Load answers from localStorage on mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`answers_${id}`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, [id]);

  // Fetch Assessment details
  useEffect(() => {
    async function fetchAssessmentDetails() {
      try {
        const serverUrl = import.meta.env.VITE_SERVER_URL || '';
        const response = await axios.get(`${serverUrl}/api/assessments`);
        const found = response.data.find(a => a.id === id);
        if (found) {
          setAssessment(found);
        } else {
          throw new Error("Assessment not found");
        }
      } catch (error) {
        console.error("Failed to load assessment details, using local mock data:", error);
        
        // Mock fallback data matching the ID
        const mockAssessments = {
          'portal-quiz-202': {
            id: 'portal-quiz-202',
            title: 'SACAS Portal Rules & Specifications',
            description: 'A 10-question multiple-choice quiz designed to test your knowledge of browser compatibility, proctor parameters, security rates, and student support features.',
            durationMinutes: 10,
            questionsCount: 10,
            points: 100,
            rules: [
              'Each question is worth 10 points.',
              'No external browser tabs may be opened.',
              'AI Assistant is available for conceptual guidance.'
            ],
            questions: [
              {
                id: 'pq-q1',
                title: 'Browser Compatibility',
                text: 'Which of the following web browsers is NOT officially supported for active assessments on the SACAS EXAM PORTAL?',
                type: 'choice',
                options: [
                  'Google Chrome (v90+)',
                  'Microsoft Edge (v90+)',
                  'Opera Mini (Mobile/Lightweight)',
                  'Mozilla Firefox (v88+)'
                ],
                points: 10
              },
              {
                id: 'pq-q2',
                title: 'Webcam Permissions',
                text: "If a student's webcam feed fails to load, what is the first recommended step to resolve permissions?",
                type: 'choice',
                options: [
                  'Restart the entire computer system.',
                  'Click the Lock Icon (🔒) in the browser\'s address URL bar and change Camera to \'Allow\'.',
                  'Contact technical support immediately to schedule a manual review.',
                  'Disable all security shields and firewalls.'
                ],
                points: 10
              },
              {
                id: 'pq-q3',
                title: 'Tab Focus Violations',
                text: 'What happens on the proctor\'s console when a student navigates to an external browser tab during an active test?',
                type: 'choice',
                options: [
                  'The exam is immediately terminated and marked as failed.',
                  'A focus loss warning event is automatically logged to the Proctor Telemetry stream.',
                  'The client computer triggers a loud siren.',
                  'The student is logged out of their account.'
                ],
                points: 10
              },
              {
                id: 'pq-q4',
                title: 'AI Sandbox Guidelines',
                text: 'Under what boundary conditions does the Gemini AI Support Assistant operate in the chat interface?',
                type: 'choice',
                options: [
                  'It writes functional code solutions for any question.',
                  'It can supply direct answers to multiple-choice questions if the student is struggling.',
                  'It only explains general concept definitions and troubleshooting tips, blocking direct solution code.',
                  'It is allowed to search the internet for answers.'
                ],
                points: 10
              },
              {
                id: 'pq-q5',
                title: 'Submission Glitches',
                text: 'If a student experiences a submission error or the \'Finish Test\' button freezes, what should they do?',
                type: 'choice',
                options: [
                  'Close the browser tab and log in tomorrow.',
                  'Clear the browser cache to start the exam from the beginning.',
                  'Click the "Report Glitch" button to notify the proctor, refresh the page, and try submitting again.',
                  'Re-type all code from scratch in a different text file.'
                ],
                points: 10
              },
              {
                id: 'pq-q6',
                title: 'Auth Providers',
                text: 'Which authentication providers are supported out-of-the-box by the SACAS Auth Context?',
                type: 'choice',
                options: [
                  'Github and LinkedIn SSO',
                  'Email/Password + Google Account SSO',
                  'Mobile OTP Verification only',
                  'Microsoft Azure Active Directory'
                ],
                points: 10
              },
              {
                id: 'pq-q7',
                title: 'Dev Server Ports',
                text: 'In the development environment, on which port does the client (Vite) and backend (Express) run, respectively?',
                type: 'choice',
                options: [
                  'Client: Port 5000 | Server: Port 5173',
                  'Client: Port 3000 | Server: Port 5000',
                  'Client: Port 5173 | Server: Port 5000',
                  'Client: Port 8080 | Server: Port 3000'
                ],
                points: 10
              },
              {
                id: 'pq-q8',
                title: 'Security Rate Limiting',
                text: 'What is the rate limit constraint configured on the `/api/` endpoints to protect the system from DDoS or API key misuse?',
                type: 'choice',
                options: [
                  '10 requests per hour',
                  '150 requests per 15 minutes',
                  '1000 requests per minute',
                  'Unlimited requests'
                ],
                points: 10
              },
              {
                id: 'pq-q9',
                title: 'Performance Optimization',
                text: 'How is initial page load performance optimized inside the React client router?',
                type: 'choice',
                options: [
                  'By compressing images into WebP formats.',
                  'Using React Lazy and Suspense code-splitting, which loads page modules only when navigated.',
                  'By running client rendering inside a web worker thread.',
                  'Disabling routing transitions entirely.'
                ],
                points: 10
              },
              {
                id: 'pq-q10',
                title: 'Docker Start Command',
                text: 'In the provided production Docker container setup, what is the unified server command defined to start the portal?',
                type: 'choice',
                options: [
                  'vite preview',
                  'npm run dev',
                  'node server.js (running inside the /app/server working directory)',
                  'docker run'
                ],
                points: 10
              }
            ]
          }
        };
        setAssessment(mockAssessments[id] || null);
      } finally {
        setLoading(false);
      }
    }
    fetchAssessmentDetails();
  }, [id]);

  function handleSaveAnswer(questionId, value) {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    localStorage.setItem(`answers_${id}`, JSON.stringify(updated));
  }

  function handleFinishClick() {
    setShowSubmitConfirm(true);
  }

  function handleConfirmSubmit() {
    // Save completion state
    const savedCompletions = localStorage.getItem('completed_exams');
    const completions = savedCompletions ? JSON.parse(savedCompletions) : {};
    completions[id] = {
      submittedAt: new Date().toISOString(),
      answersCount: Object.keys(answers).length
    };
    localStorage.setItem('completed_exams', JSON.stringify(completions));
    
    // Clear in-progress cached answers
    localStorage.removeItem(`answers_${id}`);
    
    // Go home
    navigate('/');
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm animate-pulse">Entering SACAS Secure Exam Environment...</p>
        </div>
      </Layout>
    );
  }

  if (!assessment) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-3">
          <AlertCircle size={40} className="text-rose-505" />
          <h2 className="text-xl font-bold text-white">Assessment Room Error</h2>
          <p className="text-slate-400 text-sm max-w-sm">The assessment you are trying to access does not exist or has expired.</p>
          <Button variant="secondary" onClick={() => navigate('/')} className="mt-2 bg-slate-800 border-slate-700 text-slate-205">
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const unansweredCount = assessment.questions.filter(q => !answers[q.id]).length;

  return (
    <Layout>
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 relative items-stretch h-full">
        {/* Left 2 Columns: Question View Area */}
        <div className={`flex flex-col h-full transition-all duration-300 ${
          showChatDrawer ? 'lg:col-span-2' : 'lg:col-span-3'
        }`}>
          <AssessmentPane
            assessment={assessment}
            answers={answers}
            onSaveAnswer={handleSaveAnswer}
            onSubmitTest={handleFinishClick}
            onReportIncident={() => setShowIncidentModal(true)}
          />
        </div>

        {/* Right 1 Column: Chatbot sidebar */}
        {showChatDrawer ? (
          <div className="lg:col-span-1 h-full flex flex-col relative animate-slide-in">
            {/* Close drawer button for mobile overlay / toggle view */}
            <button
              onClick={() => setShowChatDrawer(false)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-40 bg-slate-900 border border-slate-805 p-1 rounded-full text-slate-400 hover:text-white cursor-pointer hidden lg:flex hover:border-blue-500/40"
              title="Hide Chat Assistant"
            >
              <X size={14} />
            </button>
            <ChatInterface assessment={assessment} />
          </div>
        ) : (
          /* Floating toggle when chat is hidden */
          <button
            onClick={() => setShowChatDrawer(true)}
            className="fixed right-6 bottom-20 z-40 bg-gradient-to-tr from-blue-600 to-sky-600 border border-blue-500/20 p-4 rounded-full text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
            title="Open Chat Assistant"
          >
            <MessageSquare size={24} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-xs font-bold transition-all uppercase tracking-wider leading-none">AI Support</span>
          </button>
        )}
      </div>

      {/* Incident Logger Modal */}
      {showIncidentModal && (
        <IncidentLogger
          assessmentId={id}
          onClose={() => setShowIncidentModal(false)}
          onLogged={(inc) => console.log("Incident Logged:", inc)}
        />
      )}

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md border border-slate-800 bg-slate-900/90 flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-slate-805 pb-3">
              <div className="bg-blue-955/40 text-blue-400 p-2 rounded-lg border border-blue-500/20">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-white">Submit Assessment?</h3>
            </div>
            
            <div className="text-sm text-slate-300 leading-normal flex flex-col gap-2.5">
              <p>Are you sure you want to finish and submit your answers? This action is permanent and cannot be undone.</p>
              {unansweredCount > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-amber-400 font-semibold flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>You have {unansweredCount} unanswered questions!</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-2 border-t border-slate-800 pt-4">
              <Button variant="ghost" onClick={() => setShowSubmitConfirm(false)} className="text-slate-400 hover:text-white">
                Back to Test
              </Button>
              <Button variant="primary" onClick={handleConfirmSubmit} className="shadow-emerald-950/20 border border-emerald-900/10">
                Submit Test
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
}
