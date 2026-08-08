import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, GraduationCap, User, Activity, Menu, X, HelpCircle, Mail, Bot, Home, BookOpen, AlertTriangle } from 'lucide-react';
import Button from './UI/Button';
import ChatInterface from './ChatInterface';

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const defaultAssessment = {
    id: 'general-help',
    title: 'SACAS Portal',
    description: 'General support inquiries and portal navigation guides.',
    durationMinutes: 0,
    questionsCount: 0,
    points: 0
  };

  // Strictly assign user role based on authorized email credentials
  const role = currentUser?.email === 'admin@sacas.com' ? 'admin' : 'student';

  const isActive = (path) => location.pathname === path;

  // Compile active routes depending on login state & role
  const navLinks = [];

  // Public Links (always available)
  navLinks.push({ path: '/', label: 'Home', icon: Home });

  if (currentUser) {
    if (role === 'admin') {
      navLinks.push({ path: '/admin', label: 'Admin Logs', icon: AlertTriangle });
    } else {
      navLinks.push({ path: '/dashboard', label: 'Portal Room', icon: BookOpen });
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Dynamic Background Mesh */}
      <div className="mesh-bg"></div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-4 md:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="bg-gradient-to-tr from-blue-600 to-sky-650 p-2 rounded-xl shadow-md shadow-blue-500/10 border border-blue-400/20 flex items-center justify-center cursor-pointer decoration-none">
              <GraduationCap className="text-white" size={22} />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white m-0 leading-none">
                SACAS <span className="text-blue-500 font-black">EXAM PORTAL</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase mt-0.5 leading-none">Secure Portal Suite</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const LinkIcon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'bg-blue-955/40 text-blue-400 border border-blue-500/20 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <LinkIcon size={14} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* Profile Dropdown info */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
                  <div className="bg-slate-800 p-1 rounded-lg">
                    <User size={13} className="text-slate-400" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-[10px] font-black text-white leading-tight">
                      {currentUser.displayName || currentUser.email.split('@')[0]}
                    </p>
                    <p className="text-[9px] text-slate-400 leading-none">{role.toUpperCase()}</p>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="!p-2.5 rounded-xl text-slate-400 hover:text-rose-455 hover:bg-rose-955/20 border border-transparent hover:border-rose-900/30 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                className="!py-1.5 !px-4 !rounded-lg text-xs font-bold shadow-md shadow-blue-500/10 border border-blue-500/10"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-405 hover:bg-slate-800 border border-transparent hover:border-slate-700 cursor-pointer flex items-center justify-center"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 right-0 w-64 h-full bg-slate-955 border-l border-slate-800 shadow-2xl p-6 flex flex-col gap-6 animate-slide-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-450">SACAS Navigation</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Links List */}
            <nav className="flex flex-col gap-2">
              {navLinks.map(link => {
                const LinkIcon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      active
                        ? 'bg-blue-955/40 border-blue-500/20 text-blue-400'
                        : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <LinkIcon size={16} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col">
        {children}
      </main>

      {/* Floating Action Chatbot Button & Widget Drawer */}
      {role !== 'admin' && !location.pathname.startsWith('/assessment/') && (
        <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3 select-none">
          {/* Chat Window Box */}
          {isChatOpen && (
            <div className="w-[340px] sm:w-[380px] h-[480px] bg-slate-955/95 border border-slate-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-fade-in relative z-50">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                    <Bot size={14} className="text-blue-400" />
                    SACAS Support Assistant
                  </span>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-805/50 transition-all cursor-pointer border-0 bg-transparent"
                  title="Close Chat"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden relative bg-slate-950/40">
                <ChatInterface assessment={defaultAssessment} />
              </div>
            </div>
          )}

          {/* Floating Action Button (FAB) */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`h-14 w-14 rounded-full flex items-center justify-center text-white border transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer ${
              isChatOpen
                ? 'bg-rose-600 hover:bg-rose-700 border-rose-500/20 rotate-90'
                : 'bg-gradient-to-tr from-blue-600 to-sky-505 hover:from-blue-500 hover:to-sky-500 border-blue-400/25 shadow-blue-500/10'
            }`}
            title="Sacas Support Assistant"
          >
            {isChatOpen ? <X size={24} /> : <Bot size={24} />}
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-4.5 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3.5 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center gap-3.5 text-slate-400">
          <p>&copy; 2026 SACAS EXAM PORTAL.</p>
          <div className="flex items-center gap-3">
            <Link to="/faq" className="text-slate-400 hover:text-white transition-colors decoration-none font-medium">FAQ</Link>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-wider text-slate-400 bg-slate-900/60 py-1 px-3 rounded-full border border-slate-800">
          <Activity size={12} className="text-blue-505 animate-pulse" />
          <span>Secure Proctor Network Active</span>
        </div>
      </footer>
    </div>
  );
}
