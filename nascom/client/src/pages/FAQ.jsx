import React, { useState } from 'react';
import Card from '../components/UI/Card';
import { HelpCircle, ChevronDown, ChevronUp, Lock, Calendar, Clock, Camera, Mic, Globe, Wifi, Send, Settings, BookOpen, User } from 'lucide-react';

export default function FAQ() {
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 'faq-password',
      icon: Lock,
      q: "I forgot my password.",
      a: "Click \"Forgot Password\" on the login page, enter your registered email address, and follow the instructions sent to your email to reset your password."
    },
    {
      id: 'faq-login',
      icon: User,
      q: "I can't log in.",
      a: "Please check your username and password. Ensure your internet connection is stable. If the problem continues, reset your password or contact support."
    },
    {
      id: 'faq-schedule',
      icon: Calendar,
      q: "When does my exam start?",
      a: "You can view your exam schedule on your dashboard under the \"Upcoming Exams\" section."
    },
    {
      id: 'faq-duration',
      icon: Clock,
      q: "How much time is available for the exam?",
      a: "The exam duration is displayed before you start the assessment and the timer will be visible throughout the exam."
    },
    {
      id: 'faq-camera',
      icon: Camera,
      q: "Camera is not working.",
      a: "Please allow camera permission in your browser settings and refresh the page. Ensure no other application is using your webcam."
    },
    {
      id: 'faq-mic',
      icon: Mic,
      q: "Microphone is not working.",
      a: "Allow microphone permission in your browser settings and reconnect your microphone if necessary."
    },
    {
      id: 'faq-browser',
      icon: Globe,
      q: "Which browser should I use?",
      a: "We recommend using the latest version of Google Chrome or Microsoft Edge for the best experience."
    },
    {
      id: 'faq-refresh',
      icon: Settings,
      q: "Can I refresh the exam page?",
      a: "Yes, you can refresh the page. Your answers will be automatically saved if the auto-save feature is enabled."
    },
    {
      id: 'faq-network',
      icon: Wifi,
      q: "My internet disconnected.",
      a: "Reconnect to the internet as soon as possible. Once connected, reopen the exam portal. Your saved answers will be restored automatically if supported."
    },
    {
      id: 'faq-submit-issue',
      icon: Send,
      q: "I cannot submit my exam.",
      a: "Ensure all required questions are completed and check your internet connection. If the issue continues, contact technical support immediately."
    },
    {
      id: 'faq-change-answers',
      icon: BookOpen,
      q: "Can I change my answers?",
      a: "Yes, you can modify your answers until you click the final Submit button."
    },
    {
      id: 'faq-submit-how',
      icon: Send,
      q: "How do I submit the exam?",
      a: "Click the \"Submit Exam\" button and confirm your submission. After submission, changes cannot be made."
    },
    {
      id: 'faq-results',
      icon: Settings,
      q: "When will results be published?",
      a: "Results will be available on your dashboard after the evaluation process is completed."
    },
    {
      id: 'faq-contact',
      icon: HelpCircle,
      q: "How do I contact support?",
      a: "Use the Contact Support page or email support@example.com for technical assistance."
    }
  ];

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id);
  }

  return (
    <div className="flex-grow flex flex-col justify-center py-6 animate-fade-in relative z-10">
      <div className="mesh-bg"></div>

      <div className="max-w-4xl mx-auto w-full px-4">
        {/* FAQ Page Header */}
        <div className="text-center mb-10 flex flex-col items-center gap-3">
          <div className="bg-blue-955/40 text-blue-400 p-2.5 rounded-xl border border-blue-500/20">
            <HelpCircle size={22} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white m-0">Explore Exam FAQs</h2>
          <p className="text-xs text-slate-400 max-w-md mt-0.5 leading-normal">
            Troubleshoot system setups, examine testing guidelines, and review portal rules.
          </p>
        </div>

        {/* Collapsible Accordion Grid */}
        <div className="flex flex-col gap-3">
          {faqs.map(faq => {
            const isExpanded = expandedId === faq.id;
            const CategoryIcon = faq.icon;
            return (
              <Card 
                key={faq.id}
                variant="default"
                className="!p-0 overflow-hidden border border-slate-800 shadow-md bg-slate-900/50"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/50 transition-colors border-0 bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-blue-400">
                      <CategoryIcon size={16} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-200">{faq.q}</span>
                  </div>
                  <div className="text-slate-400 flex-shrink-0">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-450 border-t border-slate-800 bg-slate-950/20 leading-relaxed whitespace-pre-line animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
