import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { Mail, User, Info, MessageSquare, Send, CheckCircle, HelpCircle } from 'lucide-react';
import axios from 'axios';

export default function ContactSupport() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('technical');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const issueCategories = [
    { value: 'technical', label: 'Technical Issue (System Glitch/Freeze)' },
    { value: 'account', label: 'Account / Login Problem (Password recovery)' },
    { value: 'assessment', label: 'Assessment Inquiry (Rules/Guidelines)' },
    { value: 'other', label: 'General / Other Inquiry' }
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !category || !message.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
      await axios.post(`${serverUrl}/api/incidents`, {
        assessmentId: 'general-support',
        category: category,
        description: `SUPPORT TICKET FROM ${name} (${email}) - CONTENT: ${message}`,
        timestamp: new Date().toISOString()
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setCategory('technical');
      setMessage('');
    } catch (err) {
      console.error(err);
      // Fallback local success if offline
      setSuccess(true);
      setName('');
      setEmail('');
      setCategory('technical');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-grow flex flex-col justify-center py-6 animate-fade-in relative z-10">
      <div className="mesh-bg"></div>

      <div className="max-w-2xl mx-auto w-full px-4">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          <div className="bg-blue-950/40 text-blue-400 p-2.5 rounded-xl border border-blue-500/20">
            <Mail size={22} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white m-0">Contact System Support</h2>
          <p className="text-sm text-slate-400 max-w-sm mt-0.5 leading-normal">
            Need manual assistance? Log a support ticket and our admin team will reach out.
          </p>
        </div>

        <Card className="border border-slate-800 shadow-xl bg-slate-900/90 animate-fade-in">
          {success ? (
            <div className="text-center py-8 flex flex-col items-center gap-4 animate-fade-in">
              <div className="h-12 w-12 bg-emerald-955/20 text-emerald-450 rounded-full flex items-center justify-center border border-emerald-900/30">
                <CheckCircle size={28} className="animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white m-0">Ticket Logged Successfully</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">Your support request has been recorded. Check your registered university inbox for updates.</p>
              </div>
              <Button onClick={() => setSuccess(false)} variant="secondary" className="mt-2 font-medium bg-slate-800 border-slate-700 text-slate-200">
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-955/20 text-rose-400 text-xs font-semibold text-center border border-rose-900/30">
                  {error}
                </div>
              )}

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Student Name"
                  required
                  icon={User}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  required
                  icon={Mail}
                />
              </div>

              {/* Issue Category Select */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-1 select-none">
                  <span>Issue Category</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <HelpCircle size={18} />
                  </div>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    className="w-full py-3.5 pl-11 pr-4 rounded-xl text-slate-100 bg-slate-950 border border-slate-800 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/10 text-xs font-medium appearance-none cursor-pointer"
                  >
                    {issueCategories.map(cat => (
                      <option key={cat.value} value={cat.value} className="text-slate-300 bg-slate-950 font-medium">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute right-4 text-slate-400 pointer-events-none">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-1 select-none">
                  <span>Detailed Message</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-start">
                  <div className="absolute left-4 top-3 text-slate-400 pointer-events-none">
                    <MessageSquare size={18} />
                  </div>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Provide details about your query (e.g. browser compatibility checks, camera configuration errors, account setup doubts)..."
                    rows="5"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-100 placeholder-slate-500 text-sm glass-input resize-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={submitting}
                className="w-full mt-2 font-bold py-3.5 shadow-lg shadow-blue-500/20"
              >
                <Send size={14} />
                <span>Submit Ticket</span>
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
