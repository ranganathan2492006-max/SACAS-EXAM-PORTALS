import React, { useState, useEffect } from 'react';
import Card from './UI/Card';
import Button from './UI/Button';
import { Clock, AlertCircle, Save, CheckCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';

export default function AssessmentPane({ assessment, answers, onSaveAnswer, onSubmitTest, onReportIncident }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [localAnswer, setLocalAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(assessment.durationMinutes * 60);

  const questions = assessment.questions || [];
  const currentQuestion = questions[currentQIndex];

  // Timer Countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmitTest();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Load saved answer for current question
  useEffect(() => {
    if (currentQuestion) {
      setLocalAnswer(answers[currentQuestion.id] || '');
    }
  }, [currentQIndex, currentQuestion, answers]);

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function handleSave() {
    onSaveAnswer(currentQuestion.id, localAnswer);
  }

  const isLowTime = timeLeft < 5 * 60; // Less than 5 minutes

  if (!currentQuestion) {
    return <div className="text-slate-400 p-8 text-center">No questions found for this assessment.</div>;
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Test Status Header */}
      <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 px-6 border-b border-white/5 bg-slate-950/20">
        <div>
          <h2 className="text-base font-bold text-white mb-0.5">{assessment.title}</h2>
          <p className="text-[10px] text-slate-400 font-medium">STUDENT ASSESSMENT MODE &bull; DO NOT REFRESH</p>
        </div>

        {/* Timer and Action panel */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-mono font-semibold ${
            isLowTime 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' 
              : 'bg-violet-950/20 text-violet-300 border-violet-500/20'
          }`}>
            <Clock size={16} />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>

          <Button 
            variant="danger" 
            onClick={onReportIncident}
            className="!px-3 !py-1.5 !rounded-xl text-xs flex items-center gap-1.5 border border-red-500/30 hover:shadow-red-950/10"
          >
            <AlertCircle size={14} />
            <span>Report Glitch</span>
          </Button>
        </div>
      </Card>

      {/* Main Question Display & Answer Box */}
      <Card className="flex-1 flex flex-col gap-5 min-h-[400px]">
        {/* Question Selector Matrix */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentQIndex;
            const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQIndex(idx)}
                className={`h-9 w-9 rounded-lg font-mono text-sm font-semibold transition-all cursor-pointer flex items-center justify-center border ${
                  isCurrent 
                    ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-900/30 scale-105' 
                    : isAnswered
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Title & Description */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider bg-slate-800 text-slate-300 rounded-md border border-slate-700 uppercase">
              Question {currentQIndex + 1} of {questions.length}
            </span>
            <span className="text-xs text-slate-400">({currentQuestion.points} points)</span>
          </div>
          
          <h3 className="text-lg font-bold text-white leading-snug">{currentQuestion.title}</h3>
          
          <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-4 rounded-xl border border-white/5 whitespace-pre-line">
            {currentQuestion.text}
          </div>

          {/* Answer Input Area */}
          <div className="flex flex-col gap-2 mt-4 flex-1">
            <label className="text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Write your response:</span>
              {answers[currentQuestion.id] && (
                <span className="text-emerald-400 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                  <CheckCircle size={10} /> Saved
                </span>
              )}
            </label>
            
            {currentQuestion.type === 'coding' ? (
              <textarea
                value={localAnswer}
                onChange={e => setLocalAnswer(e.target.value)}
                placeholder="// Type your code here..."
                rows="8"
                className="w-full p-4 rounded-xl text-slate-100 placeholder-slate-650 text-sm font-mono bg-slate-950 border border-slate-850/80 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 resize-y"
              />
            ) : currentQuestion.type === 'choice' ? (
              <div className="flex flex-col gap-2.5">
                {currentQuestion.options.map(opt => {
                  const isChecked = localAnswer === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLocalAnswer(opt)}
                      className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer flex items-center gap-3 ${
                        isChecked 
                          ? 'border-violet-500 bg-violet-650/10 text-white' 
                          : 'border-slate-800 bg-slate-900/30 text-slate-350 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                        isChecked ? 'border-violet-500 bg-violet-600' : 'border-slate-700 bg-transparent'
                      }`}>
                        {isChecked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={localAnswer}
                onChange={e => setLocalAnswer(e.target.value)}
                placeholder="Type your explanation here..."
                rows="6"
                className="w-full p-4 rounded-xl text-slate-100 placeholder-slate-500 text-sm bg-slate-950 border border-slate-850/80 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/20 resize-y"
              />
            )}
          </div>
        </div>

        {/* Footer Navigation within Card */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto gap-4">
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="!px-3.5 !py-2"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Prev</span>
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQIndex === questions.length - 1}
              className="!px-3.5 !py-2"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={localAnswer === (answers[currentQuestion.id] || '')}
              className="border border-violet-500/30 text-violet-300 hover:bg-violet-650/10"
            >
              <Save size={16} />
              <span>Save Progress</span>
            </Button>

            <Button
              variant="primary"
              onClick={onSubmitTest}
              className="shadow-emerald-900/10 hover:shadow-emerald-900/20 border border-emerald-500/20"
            >
              <Send size={16} />
              <span>Finish Test</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
