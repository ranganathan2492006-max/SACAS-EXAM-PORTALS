import React from 'react';
import ChatInterface from '../components/ChatInterface';
import Card from '../components/UI/Card';
import { Sparkles, HelpCircle, ShieldCheck, Cpu } from 'lucide-react';

export default function AIChatbot() {
  // General context for study preparation
  const mockAssessmentContext = {
    title: 'General Exam Preparation',
    description: 'General workspace to prepare for upcoming tests and ask study queries.',
    rules: 'This is a practice workspace. Academic Integrity rules are relaxed to explain concepts in depth, but writing full code answers remains throttled.',
    questions: [
      {
        id: 'prep-1',
        title: 'React Components',
        text: 'How do React components manage state and handle events?',
        type: 'explanation'
      },
      {
        id: 'prep-2',
        title: 'Data Structures',
        text: 'What are the main differences between arrays and linked lists?',
        type: 'explanation'
      }
    ],
    durationMinutes: 60
  };

  return (
    <div className="flex flex-col gap-6 flex-grow py-4 animate-fade-in relative z-10">
      <div className="mesh-bg"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch h-full">
        {/* Left Column: Chat box */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <ChatInterface assessment={mockAssessmentContext} />
        </div>

        {/* Right Column: Platform Instructions */}
        <div className="flex flex-col gap-6">
          <Card className="border border-blue-500/15 bg-slate-900/50">
            <h3 className="text-sm font-bold text-blue-400 mb-2.5 flex items-center gap-1.5 leading-none">
              <Sparkles size={16} className="text-blue-550 animate-pulse" />
              <span>General Study Sandbox</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Welcome to the general preparation workspace. You can ask questions about web dev or DSA to review concepts before starting your exam.
            </p>
            <div className="flex flex-col gap-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <p><strong>Concept Deep-Dive:</strong> Ask the AI to explain closures, time complexities, or flex properties.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <p><strong>Mock Queries:</strong> Practice asking phrasing questions to get used to the chatbot's hint system.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <p><strong>Preparation Only:</strong> Remember, once you start an actual exam, direct answers are strictly blocked.</p>
              </div>
            </div>
          </Card>


        </div>
      </div>
    </div>
  );
}
