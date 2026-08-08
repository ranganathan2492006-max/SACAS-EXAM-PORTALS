import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { 
  AlertCircle, CheckCircle, Clock, ShieldAlert, Filter, Search, 
  Mail, Bot, User, Trash2, Cpu, WifiOff, FileCode, CheckSquare, 
  Square, Calendar, ChevronRight, BarChart3, PieChart, MessageSquare, X 
} from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [chats, setChats] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'tickets' | 'contacts' | 'chats'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'resolved'
  
  // Selected chat modal log
  const [selectedChat, setSelectedChat] = useState(null);

  async function fetchData() {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
      const [incResponse, chatResponse, ticketResponse] = await Promise.all([
        axios.get(`${serverUrl}/api/incidents`),
        axios.get(`${serverUrl}/api/chats`),
        axios.get(`${serverUrl}/api/tickets`).catch(() => ({ data: [] }))
      ]);
      setIncidents(incResponse.data);
      setChats(chatResponse.data);
      setTickets(ticketResponse.data || []);
    } catch (error) {
      console.error("Failed to fetch admin data, loading local fallback:", error);
      
      // Fallback mock incidents
      setIncidents([
        {
          id: 'inc-923',
          assessmentId: 'web-dev-101',
          category: 'technical',
          description: "Student browser froze during basic counter functional component submission.",
          resolved: false,
          studentEmail: 'student.alpha@university.edu',
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString()
        },
        {
          id: 'inc-411',
          assessmentId: 'dsa-201',
          category: 'network',
          description: "Lag spike detected. Proctor telemetry logged packet loss exceeding 40%.",
          resolved: true,
          studentEmail: 'student.beta@university.edu',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: 'inc-502',
          assessmentId: 'general-support',
          category: 'account',
          description: "SUPPORT TICKET FROM Rahul Kumar (rahul.k@gmail.com) - CONTENT: Forgot password recover link not working on Chrome.",
          resolved: false,
          studentEmail: 'rahul.k@gmail.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
        },
        {
          id: 'inc-704',
          assessmentId: 'web-dev-101',
          category: 'clarification',
          description: "Question instructions are confusing regarding compiler restrictions for ES6 modules.",
          resolved: false,
          studentEmail: 'student.gamma@university.edu',
          timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString()
        },
        {
          id: 'inc-109',
          assessmentId: 'general-support',
          category: 'technical',
          description: "SUPPORT TICKET FROM Priya Roy (priya@gmail.com) - CONTENT: General inquiry about browser configurations for Safari.",
          resolved: true,
          studentEmail: 'priya@gmail.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString()
        }
      ]);

      // Fallback mock chats
      setChats([
        {
          id: 'chat-82',
          studentEmail: 'student.alpha@university.edu',
          assessmentId: 'Web Development Fundamentals',
          message: 'My screen is freezing, what should I do?',
          reply: 'If you are experiencing a technical issue or browser freeze:\n1. Click the **Report Glitch** button at the top-left to log the issue for your proctor.\n2. Refresh your browser page. **Your progress is cached locally in your browser** and will be restored immediately.\n3. Verify that you have a stable network connection.\n\nDon\'t worry, the exam system records your logs and your proctor will review any reported incidents!',
          timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString()
        },
        {
          id: 'chat-93',
          studentEmail: 'student.alpha@university.edu',
          assessmentId: 'Web Development Fundamentals',
          message: 'Give me the answer to Q1 counter component',
          reply: 'I cannot provide direct solutions or code implementations during an active assessment. \n\nHowever, here is a conceptual hint:\n- If you\'re working on the **Counter component** (Q1), think about using React\'s `useState` hook to initialize the count and create functions for incrementing/decrementing that you pass to your buttons\' `onClick` handlers.\n\nLet me know if you would like me to clarify how a specific concept works!',
          timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString()
        },
        {
          id: 'chat-11',
          studentEmail: 'student.gamma@university.edu',
          assessmentId: 'Web Development Fundamentals',
          message: 'What browser am I allowed to use?',
          reply: '🌐 **Browser Compatibility Specifications:**\n- SACAS EXAM PORTAL officially supports the following desktop web browsers:\n  - **Google Chrome** (v90+)\n  - **Mozilla Firefox** (v88+)\n  - **Microsoft Edge** (v90+)\n  - **Apple Safari** (v14+)\n- Mobile browsers are not supported.',
          timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString()
        }
      ]);

      setTickets([
        {
          id: 'tkt-mock-1',
          studentEmail: 'student.alpha@university.edu',
          subject: 'Locked out of exam due to tab switch',
          description: 'My browser lost focus accidentally because of a Windows update popup and now my assessment is locked.',
          status: 'Open',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: 'tkt-mock-2',
          studentEmail: 'student.gamma@university.edu',
          subject: 'Camera permission denied error',
          description: 'I allowed camera permission in chrome, but it still shows video streaming failed on page reload.',
          status: 'Resolved',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  async function toggleResolve(id, currentStatus) {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
      await axios.patch(`${serverUrl}/api/incidents/${id}`, {
        resolved: !currentStatus
      });
      setIncidents(prev => 
        prev.map(inc => inc.id === id ? { ...inc, resolved: !currentStatus } : inc)
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      setIncidents(prev => 
        prev.map(inc => inc.id === id ? { ...inc, resolved: !currentStatus } : inc)
      );
    }
  }

  async function toggleResolveTicket(id, currentStatus) {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
      const newStatus = currentStatus === 'Resolved' ? 'Open' : 'Resolved';
      const response = await axios.patch(`${serverUrl}/api/tickets/${id}`, {
        status: newStatus
      });
      setTickets(prev => 
        prev.map(t => t.id === id ? response.data : t)
      );
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      // Local state fallback
      const newStatus = currentStatus === 'Resolved' ? 'Open' : 'Resolved';
      setTickets(prev => 
        prev.map(t => t.id === id ? { ...t, status: newStatus } : t)
      );
    }
  }

  const categoryConfigs = {
    technical: { color: 'bg-amber-950/20 text-amber-400 border-amber-900/30', icon: Cpu, label: 'Technical' },
    network: { color: 'bg-rose-955/20 text-rose-400 border-rose-900/30', icon: WifiOff, label: 'Network' },
    clarification: { color: 'bg-blue-955/20 text-blue-400 border-blue-900/30', icon: FileCode, label: 'Clarification' },
    account: { color: 'bg-indigo-955/20 text-indigo-400 border-indigo-900/30', icon: User, label: 'Account' },
    other: { color: 'bg-slate-955/20 text-slate-400 border-slate-900/30', icon: AlertCircle, label: 'Other' }
  };

  // Segregate Incidents (exam glitches) vs Contact Forms
  const examIncidents = incidents.filter(inc => inc.assessmentId !== 'general-support');
  const contactForms = incidents.filter(inc => inc.assessmentId === 'general-support');

  // Apply search query and status filters
  const getFilteredItems = () => {
    let list = [];
    if (activeTab === 'incidents') {
      list = examIncidents;
    } else if (activeTab === 'contacts') {
      list = contactForms;
    } else if (activeTab === 'tickets') {
      list = tickets;
    } else {
      return chats.filter(chat => 
        chat.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.assessmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status (Resolved / Reviewing)
    if (filterStatus === 'pending') {
      list = list.filter(item => {
        if (item.status) return item.status === 'Open';
        return !item.resolved;
      });
    } else if (filterStatus === 'resolved') {
      list = list.filter(item => {
        if (item.status) return item.status === 'Resolved';
        return item.resolved;
      });
    }

    // Search query match (email, category, or description)
    if (searchQuery.trim()) {
      list = list.filter(item => 
        (item.studentEmail && item.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.subject && item.subject.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return list;
  };

  const filteredItems = getFilteredItems();

  // --- ANALYTICS CALCULATIONS (Pure CSS/SVG Responsive Charts) ---
  const totalIncidents = examIncidents.length;
  const resolvedIncidents = examIncidents.filter(i => i.resolved).length;
  const pendingIncidents = totalIncidents - resolvedIncidents;
  
  // Categorized counts for bar graph
  const categoryCounts = examIncidents.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, { technical: 0, network: 0, clarification: 0 });

  const maxVal = Math.max(...Object.values(categoryCounts), 1);

  // Resolution rate percentage
  const resRate = totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0;

  // Donut chart parameters
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (resRate / 100) * circumference;

  return (
    <div className="flex flex-col gap-6 flex-grow py-4 animate-fade-in relative z-10">
      <div className="mesh-bg"></div>

      {/* Admin Title Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-950/20 to-sky-955/10 p-6 rounded-2xl border border-blue-500/10">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-2">
            <ShieldAlert className="text-blue-500" size={24} />
            <span>SACAS Secure Admin Console</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Monitor real-time exam telemetry, read student-AI support logs, resolve glitches, and view metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/40 text-blue-400 border border-blue-500/20 text-xs font-semibold select-none">
          <span className="h-2 w-2 rounded-full bg-blue-550 animate-ping"></span>
          <span>Security Stream Active</span>
        </div>
      </div>

      {/* ANALYTICS SECTION (Vibrant SVG Charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Donut Chart: Resolution standing */}
        <Card className="bg-slate-900/50 border-slate-800 shadow-md flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5 justify-center md:justify-start">
              <PieChart size={14} className="text-blue-500" />
              <span>Resolution Efficiency</span>
            </h4>
            <h3 className="text-lg font-black text-white leading-tight mb-2">Exam Glitch Metrics</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-0">
              Shows the ratio of resolved hardware and system glitches versus issues currently pending proctor review.
            </p>
            <div className="flex gap-4 justify-center md:justify-start mt-4 text-[10px] uppercase font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 bg-blue-500 rounded-full"></span>
                <span>{resolvedIncidents} Resolved</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 bg-slate-800 rounded-full"></span>
                <span>{pendingIncidents} Pending</span>
              </span>
            </div>
          </div>

          <div className="relative h-32 w-32 flex-shrink-0 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r={radius} 
                className="stroke-slate-800 fill-transparent" 
                strokeWidth="10"
              />
              <circle 
                cx="50" cy="50" r={radius} 
                className="stroke-blue-500 fill-transparent transition-all duration-500" 
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white leading-none">{resRate}%</span>
              <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 mt-1">Resolved</span>
            </div>
          </div>
        </Card>

        {/* Bar Chart: Incidents by Category */}
        <Card className="bg-slate-900/50 border-slate-800 shadow-md p-6 flex flex-col gap-4">
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BarChart3 size={14} className="text-blue-505" />
              <span>Categorized Incidents</span>
            </h4>
            <h3 className="text-lg font-black text-white leading-tight">Glitch Volume Distribution</h3>
          </div>

          {/* Bar Chart Graphics */}
          <div className="flex flex-col gap-3.5">
            {Object.keys(categoryCounts).map(cat => {
              const count = categoryCounts[cat];
              const pct = Math.round((count / Math.max(totalIncidents, 1)) * 100);
              const barWidth = `${Math.max((count / maxVal) * 100, 4)}%`;
              return (
                <div key={cat} className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-300">
                    <span className="capitalize">{cat} Issues</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="h-4.5 w-full bg-slate-950 rounded-lg overflow-hidden flex border border-slate-800">
                    <div 
                      style={{ width: barWidth }}
                      className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-lg transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>

      {/* CORE WORKSPACE: Filters & Logs */}
      <div className="flex flex-col gap-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => { setActiveTab('incidents'); setSearchQuery(''); }}
            className={`px-5 py-3 text-xs font-extrabold tracking-wide uppercase cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'incidents' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle size={15} />
            <span>Student Glitch Requests ({examIncidents.length})</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('contacts'); setSearchQuery(''); }}
            className={`px-5 py-3 text-xs font-extrabold tracking-wide uppercase cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'contacts' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail size={15} />
            <span>Contact Support Forms ({contactForms.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('tickets'); setSearchQuery(''); }}
            className={`px-5 py-3 text-xs font-extrabold tracking-wide uppercase cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'tickets' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare size={15} />
            <span>Support Tickets ({tickets.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('chats'); setSearchQuery(''); }}
            className={`px-5 py-3 text-xs font-extrabold tracking-wide uppercase cursor-pointer border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'chats' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot size={15} />
            <span>AI Chatbot Histories ({chats.length})</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 shadow-sm items-stretch sm:items-center">
          {/* Search students / descriptions */}
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-3.5 text-slate-500 pointer-events-none">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'chats' ? "Search student email or topic..." : "Search by student email, details, category..."}
              className="w-full py-2 pl-10 pr-4 rounded-xl text-slate-100 placeholder-slate-500 text-xs bg-slate-950 border border-slate-800 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          {/* Status filters */}
          {activeTab !== 'chats' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'pending', 'resolved'].map(stat => (
                <button
                  key={stat}
                  onClick={() => setFilterStatus(stat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide cursor-pointer border transition-all ${
                    filterStatus === stat
                      ? 'bg-blue-955/50 border border-blue-500/20 text-blue-400 shadow-sm'
                      : 'bg-slate-955 border border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Logs */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium">Updating list rosters...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800 shadow-sm font-medium">
            No records matched your search parameters.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* RENDER TAB 1 & 2: INCIDENTS / CONTACT FORMS */}
            {activeTab === 'incidents' || activeTab === 'contacts' ? (
              filteredItems.map(item => {
                const cfg = categoryConfigs[item.category] || { color: 'bg-slate-955/20 text-slate-400 border-slate-900/30', icon: AlertCircle, label: 'General' };
                const Icon = cfg.icon;
                return (
                  <Card 
                    key={item.id} 
                    className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800 shadow-sm transition-all duration-200 hover:shadow-md ${
                      item.resolved ? 'opacity-65 bg-slate-950/40' : 'bg-slate-900/50'
                    }`}
                  >
                    <div className="flex-1 flex gap-3.5">
                      <div className={`h-10 w-10 rounded-xl border flex-shrink-0 flex items-center justify-center ${cfg.color}`}>
                        <Icon size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-black text-white">{item.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-bold uppercase tracking-wider border border-slate-800">
                            {item.assessmentId}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {/* Student Identity */}
                        <div className="text-[10px] text-blue-450 font-bold mb-1 select-all">{item.studentEmail || 'unknown@university.edu'}</div>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium break-words">"{item.description}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 w-full md:w-auto justify-end border-t border-slate-800 md:border-t-0 pt-3.5 md:pt-0">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                        item.resolved 
                          ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                          : 'bg-amber-950/20 text-amber-400 border border-amber-900/30'
                      }`}>
                        {item.resolved ? 'Resolved' : 'Pending Review'}
                      </span>

                      <Button
                        variant={item.resolved ? 'secondary' : 'primary'}
                        onClick={() => toggleResolve(item.id, item.resolved)}
                        className="!px-4 !py-2 !rounded-xl text-xs font-bold shadow-sm"
                      >
                        {item.resolved ? 'Reopen File' : 'Mark Resolved'}
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : activeTab === 'tickets' ? (
              /* RENDER TAB 4: SUPPORT TICKETS */
              filteredItems.map(ticket => {
                const isResolved = ticket.status === 'Resolved';
                return (
                  <Card 
                    key={ticket.id} 
                    className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800 shadow-sm transition-all duration-200 hover:shadow-md ${
                      isResolved ? 'opacity-65 bg-slate-955/40' : 'bg-slate-900/50'
                    }`}
                  >
                    <div className="flex-1 flex gap-3.5">
                      <div className={`h-10 w-10 rounded-xl border flex-shrink-0 flex items-center justify-center ${
                        isResolved ? 'bg-emerald-955/20 text-emerald-450 border-emerald-950/30' : 'bg-blue-955/20 text-blue-400 border-blue-900/30'
                      }`}>
                        <MessageSquare size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs font-black text-white">{ticket.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-305 font-bold uppercase tracking-wider border border-slate-800">
                            Ticket Registry
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {new Date(ticket.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[10px] text-blue-450 font-bold mb-1 select-all">{ticket.studentEmail}</div>
                        <h4 className="text-xs font-black text-slate-200 mb-1 m-0">Subject: {ticket.subject}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium break-words mt-0.5">"{ticket.description}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 w-full md:w-auto justify-end border-t border-slate-800 md:border-t-0 pt-3.5 md:pt-0">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                        isResolved 
                          ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' 
                          : 'bg-amber-950/20 text-amber-400 border border-amber-900/30'
                      }`}>
                        {ticket.status}
                      </span>

                      <Button
                        variant={isResolved ? 'secondary' : 'primary'}
                        onClick={() => toggleResolveTicket(ticket.id, ticket.status)}
                        className="!px-4 !py-2 !rounded-xl text-xs font-bold shadow-sm"
                      >
                        {isResolved ? 'Reopen Ticket' : 'Mark Resolved'}
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              /* RENDER TAB 3: CHATBOT HISTORY */
              filteredItems.map(chat => (
                <Card 
                  key={chat.id} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800 shadow-sm bg-slate-900/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1 flex gap-3.5 min-w-0">
                    <div className="h-10 w-10 rounded-xl border border-blue-500/20 bg-blue-955/40 text-blue-400 flex-shrink-0 flex items-center justify-center">
                      <Bot size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-black text-white select-all">{chat.studentEmail}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border border-slate-800">
                          {chat.assessmentId}
                        </span>
                        <span className="text-[9px] text-slate-450 font-mono">
                          {new Date(chat.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-305 font-bold truncate leading-normal">Prompt: "{chat.message}"</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-none">Reply: {chat.reply}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full sm:w-auto flex justify-end">
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedChat(chat)}
                      className="!px-3.5 !py-2 !rounded-xl text-xs border-slate-800 hover:bg-slate-800 text-slate-300 flex items-center gap-1.5"
                    >
                      <MessageSquare size={13} />
                      <span>Review Dialog Log</span>
                      <ChevronRight size={13} />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Chat Details Modal */}
      {selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-2xl border border-slate-800 bg-slate-900 flex flex-col gap-4 relative animate-fade-in shadow-2xl">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedChat(null)} 
              className="absolute top-4 right-4 text-slate-405 hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="bg-blue-955/40 text-blue-400 p-2.5 rounded-lg border border-blue-500/20">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white m-0">Gemini Dialog Review Log</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-none select-all">{selectedChat.studentEmail} &bull; {selectedChat.assessmentId}</p>
              </div>
            </div>

            {/* Conversation Content Box */}
            <div className="flex flex-col gap-4 bg-slate-950 p-4 rounded-2xl max-h-[350px] overflow-y-auto border border-slate-800">
              {/* Student Message */}
              <div className="flex gap-3 self-end max-w-[85%] flex-row-reverse">
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0">
                  <User size={15} />
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-600 text-white text-xs leading-relaxed rounded-tr-sm shadow-sm">
                  <p className="m-0 font-medium">"{selectedChat.message}"</p>
                </div>
              </div>

              {/* Bot Response */}
              <div className="flex gap-3 self-start max-w-[85%]">
                <div className="h-8 w-8 rounded-lg bg-blue-955/40 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Bot size={15} />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-xs leading-relaxed rounded-tl-sm shadow-sm whitespace-pre-line">
                  {selectedChat.reply}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-2 border-t border-slate-800 pt-3">
              <Button variant="primary" onClick={() => setSelectedChat(null)} className="font-bold">
                Close Review file
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
