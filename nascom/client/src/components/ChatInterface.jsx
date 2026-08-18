import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Card from './UI/Card';
import Button from './UI/Button';
import { Send, Bot, User, Sparkles, HelpCircle, Terminal, HelpCircle as HelpIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ChatInterface({ assessment }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'init-msg',
      sender: 'ai',
      text: `Hello! I am your **SACAS Support Assistant** for the **${assessment.title}** assessment. 

I am here to help you with:
- 🛠️ **Technical Issues**: System lags, freezing, browser checks.
- 📜 **Exam Instructions**: Clarifying guidelines or question phrasing.
- 💡 **Conceptual Guidance**: Hints or topics (I cannot give direct answers!).

How can I support you today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [raisingTicket, setRaisingTicket] = useState(false);

  // Suggested prompt chips for assessments (NASSCOM query guidelines)
  const suggestedPrompts = assessment?.id === 'general-help'
    ? [
        "Login Issues",
        "Exam Rules",
        "Camera Problem",
        "Forgot Password",
        "Contact Support",
        "Results"
      ]
    : [
        "Give me a hint",
        "Camera Problem",
        "Internet disconnected",
        "Can I change my answers?"
      ];

  // Scroll to bottom whenever messages change or loading state toggles
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSendMessage(textToSend) {
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || '';
      
      // Make request to Express server
      const response = await axios.post(`${serverUrl}/api/chat`, {
        message: textToSend,
        history: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        studentEmail: currentUser?.email || 'guest@test.com',
        assessmentContext: {
          title: assessment.title,
          description: assessment.description,
          rules: assessment.rules || [],
          questions: assessment.questions ? assessment.questions.map(q => ({
            id: q.id,
            title: q.title,
            text: q.text,
            type: q.type
          })) : []
        }
      });

      const aiText = response.data.reply;
      
      const aiMessage = {
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      
      // Fallback response for offline demonstration
      let fallbackText = "I apologize, but I am having trouble connecting to my AI server right now. ";
      if (textToSend.toLowerCase().includes("hint") || textToSend.toLowerCase().includes("answer")) {
        fallbackText += "To protect exam integrity, remember that I cannot supply direct solutions. If you need a hint, try explaining what steps you have already taken!";
      } else if (textToSend.toLowerCase().includes("freeze") || textToSend.toLowerCase().includes("lag") || textToSend.toLowerCase().includes("technical")) {
        fallbackText += "For browser freeze issues, please try logging an incident using the 'Report Glitch' button on the left so your proctor is notified, then refresh your window.";
      } else {
        fallbackText += "Please check your network connection and make sure the server API is running locally.";
      }

      const errorMsg = {
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  const handleRaiseTicket = async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;
    setRaisingTicket(true);
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || '';
      const response = await axios.post(`${serverUrl}/api/tickets`, {
        studentEmail: currentUser?.email || 'guest@test.com',
        subject: ticketSubject,
        description: ticketDescription
      });

      const systemReply = `🎟️ **Support Ticket Created Successfully!**\n\nYour issue has been sent directly to the Proctor Administration board.\n- **Ticket ID**: \`${response.data.id}\`\n- **Subject**: *${response.data.subject}*\n\nAn administrator will review your logs and respond shortly. You can check status on the portal.`;

      const systemMessage = {
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        sender: 'ai',
        text: systemReply,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, systemMessage]);
      setIsTicketFormOpen(false);
      setTicketSubject('');
      setTicketDescription('');
    } catch (error) {
      console.error("Failed to raise ticket:", error);
      alert("Failed to submit support ticket. Please try again.");
    } finally {
      setRaisingTicket(false);
    }
  };

  function handleFormSubmit(e) {
    e.preventDefault();
    handleSendMessage(inputText);
  }

  if (isTicketFormOpen) {
    return (
      <Card className="flex flex-col h-full !p-0 overflow-hidden border border-slate-800 bg-slate-900/95 max-h-[calc(100vh-180px)] shadow-xl animate-fade-in relative z-50">
        {/* Form Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-blue-400" />
            <h3 className="text-sm font-bold text-white leading-none">Raise Support Ticket</h3>
          </div>
          <button 
            type="button"
            onClick={() => {
              setIsTicketFormOpen(false);
              setTicketSubject('');
              setTicketDescription('');
            }}
            className="text-xs text-slate-400 hover:text-white bg-transparent border-0 cursor-pointer"
          >
            Cancel
          </button>
        </div>
        
        {/* Form Fields */}
        <div className="flex-grow p-4 flex flex-col gap-3.5 bg-slate-950/20 overflow-y-auto">
          <p className="text-[10px] text-slate-400 leading-normal m-0 select-none">
            If the AI Support Assistant was unable to resolve your problem, please submit a ticket directly to the NASSCOM proctor board.
          </p>
          
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none">Subject / Issue Title</label>
            <input
              type="text"
              value={ticketSubject}
              onChange={e => setTicketSubject(e.target.value)}
              placeholder="e.g. Webcam permission blocked, exam page frozen"
              className="px-3 py-2 rounded-lg text-slate-100 placeholder-slate-600 text-xs bg-slate-950 border border-slate-800 focus:border-blue-500/50 focus:outline-none"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider select-none">Detailed Description</label>
            <textarea
              value={ticketDescription}
              onChange={e => setTicketDescription(e.target.value)}
              placeholder="Provide context, error messages, or details about the issue..."
              rows={4}
              className="px-3 py-2 rounded-lg text-slate-100 placeholder-slate-600 text-xs bg-slate-950 border border-slate-800 focus:border-blue-500/50 focus:outline-none resize-none font-sans"
            />
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 justify-end">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              setIsTicketFormOpen(false);
              setTicketSubject('');
              setTicketDescription('');
            }}
            disabled={raisingTicket}
            className="border-slate-800 text-slate-400 bg-slate-950/50 text-[10px] px-3.5 py-1.5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleRaiseTicket}
            disabled={!ticketSubject.trim() || !ticketDescription.trim() || raisingTicket}
            className="font-bold text-[10px] px-3.5 py-1.5 hover:shadow-blue-500/15"
          >
            {raisingTicket ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full !p-0 overflow-hidden border border-slate-800 bg-slate-900/90 max-h-[calc(100vh-180px)] shadow-xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="bg-blue-955/40 text-blue-400 p-1.5 rounded-lg border border-blue-500/20">
              <Bot size={18} className="animate-pulse" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none">Support Assistant</h3>
            <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">Support Agent &bull; Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-blue-400 bg-blue-950/30 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-bold uppercase">
          <HelpCircle size={10} />
          <span>Help Desk</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-[250px] bg-slate-950/20">
        {messages.map(msg => {
          const isAI = msg.sender === 'ai';
          return (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border select-none ${
                isAI 
                  ? 'bg-blue-950/40 border-blue-500/20 text-blue-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                {isAI ? <Bot size={16} /> : <User size={16} />}
              </div>

              {/* Message Bubble */}
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                isAI 
                  ? 'bg-slate-950 border border-slate-800 text-slate-100 rounded-tl-sm shadow-sm' 
                  : 'bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-tr-sm border border-blue-500/10 shadow-sm shadow-blue-500/5'
              }`}>
                {/* Custom Markdown Renderer for message text */}
                <div className={`prose max-w-none text-xs break-words prose-p:m-0 ${
                  isAI ? 'text-slate-200' : 'text-white prose-headings:text-white'
                }`}>
                  <ReactMarkdown 
                    components={{
                      pre: ({node, ...props}) => <pre className={`overflow-x-auto my-2 p-2.5 rounded font-mono text-[10px] border ${
                        isAI ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-blue-900/40 border border-blue-500/20 text-blue-100'
                      }`} {...props} />,
                      code: ({node, ...props}) => <code className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                        isAI ? 'bg-slate-900 border border-slate-800 text-pink-400' : 'bg-blue-900/40 border-blue-500/20 text-white'
                      }`} {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
                <span className="block text-[8px] opacity-50 mt-1.5 text-right font-mono uppercase">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading typing indicator */}
        {loading && (
          <div className="flex gap-3 self-start animate-pulse">
            <div className="h-8 w-8 rounded-lg bg-blue-955/40 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-955 border border-slate-800 rounded-tl-sm flex items-center gap-1.5 shadow-sm">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Chips */}
      {messages.length === 1 && !loading && (
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/50">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1 select-none">
            <HelpIcon size={10} /> Suggested Questions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-[10px] px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 hover:border-blue-500/30 hover:bg-blue-955/20 text-slate-400 hover:text-blue-400 transition-all cursor-pointer text-left shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help / Ticket Link */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/50 text-center flex justify-between items-center select-none">
        <span className="text-[10px] text-slate-500">Issue not resolved?</span>
        <button
          type="button"
          onClick={() => setIsTicketFormOpen(true)}
          className="text-[10px] text-blue-400 hover:text-blue-300 font-bold border-0 bg-transparent cursor-pointer flex items-center gap-1 hover:underline"
        >
          🎟️ Raise Support Ticket
        </button>
      </div>

      {/* Chat Input form */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask a question about instructions or report bugs..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl text-slate-100 placeholder-slate-500 text-xs bg-slate-900 border border-slate-800 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/10"
        />
        <Button 
          type="submit" 
          disabled={!inputText.trim() || loading}
          className="!p-2.5 rounded-xl hover:shadow-blue-500/15 active:scale-[0.95]"
        >
          <Send size={14} />
        </Button>
      </form>
    </Card>
  );
}
