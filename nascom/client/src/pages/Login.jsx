import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldAlert, Sparkles, Send, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  // Password Reset State
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle, resetPassword, isMockAuth } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Route dynamically depending on credentials
      if (email === 'admin@sacas.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes('auth/invalid-email')) {
        setError('Invalid email address format.');
      } else if (err.message.includes('auth/user-not-found') || err.message.includes('auth/wrong-password') || err.message.includes('auth/invalid-credential')) {
        setError('Incorrect email or password.');
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Google Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (err) {
      console.error(err);
      if (err.message.includes('auth/invalid-email')) {
        setError('Invalid email format.');
      } else {
        setError('Password reset request failed. Please check your email.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleToggleMode() {
    setIsAdminLogin(!isAdminLogin);
    setError('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-10 px-4 relative z-10">
      <div className="mesh-bg"></div>

      <Card className={`w-full max-w-md border shadow-2xl bg-slate-900/90 relative animate-fade-in transition-all duration-300 ${
        isAdminLogin ? 'border-red-900/40 shadow-red-950/20' : 'border-slate-800 shadow-slate-950/20'
      }`}>
        {/* Toggle between standard Login and Forgot Password */}
        {!isResetting ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                {isAdminLogin ? (
                  <>
                    <ShieldCheck className="text-red-500" size={24} />
                    <span>Secure Admin Login</span>
                  </>
                ) : (
                  <>
                    <span>Welcome Back</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isAdminLogin ? 'SACAS Secure Proctor Console Entrance' : 'Sign in to your SACAS student assessment portal'}
              </p>
            </div>

            {isMockAuth && (
              <div className={`mb-5 p-3 rounded-xl text-[11px] leading-normal flex items-start gap-2.5 border transition-colors ${
                isAdminLogin 
                  ? 'bg-red-955/20 text-red-400 border-red-900/30' 
                  : 'bg-amber-955/20 text-amber-400 border-amber-900/30'
              }`}>
                <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold">Credential Helper (Mock Mode):</span>
                  {isAdminLogin ? (
                    <div className="mt-1">
                      Use the temporary Admin credentials:<br/>
                      Email: <code className="bg-red-950/40 px-1 py-0.5 rounded border border-red-900/20 font-bold select-all">admin@sacas.com</code><br/>
                      Password: <code className="bg-red-950/40 px-1 py-0.5 rounded border border-red-900/20 font-bold select-all">admin12345</code>
                    </div>
                  ) : (
                    <div className="mt-1">
                      Use any Email & password of 6+ characters (e.g. <code className="bg-amber-950/40 px-1 py-0.5 rounded border border-amber-900/20 select-all">student@test.com</code> / <code className="bg-amber-950/40 px-1 py-0.5 rounded border border-amber-900/20 select-all">password123</code>).
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-955/20 border border-rose-900/30 text-xs text-rose-400 font-semibold text-center animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isAdminLogin ? "proctor@sacas.com" : "name@university.edu"}
                required
                icon={Mail}
              />

              <div className="flex flex-col gap-1.5 relative">
                <div className="flex justify-between items-center select-none">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  {!isAdminLogin && (
                    <button
                      type="button"
                      onClick={() => { setIsResetting(true); setError(''); }}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full py-3 pl-11 pr-4 rounded-xl text-slate-100 placeholder-slate-500 text-sm glass-input"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                loading={loading}
                variant={isAdminLogin ? 'danger' : 'primary'}
                className="w-full mt-2 font-bold py-3.5 shadow-lg"
              >
                <LogIn size={16} />
                <span>{isAdminLogin ? 'Authenticate Proctor' : 'Sign In'}</span>
              </Button>
            </form>

            {!isAdminLogin && (
              <>
                {/* Social Divider */}
                <div className="relative flex items-center justify-center my-5 select-none">
                  <div className="absolute w-full border-t border-slate-800"></div>
                  <span className="relative bg-slate-900 px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or continue with</span>
                </div>

                {/* Google Authentication Button */}
                <Button
                  onClick={handleGoogleLogin}
                  variant="secondary"
                  disabled={loading}
                  className="w-full font-bold py-3 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-200 shadow-sm flex items-center justify-center gap-2"
                >
                  <GoogleIcon />
                  <span>Google Account</span>
                </Button>
              </>
            )}

            {/* Portal Mode Switcher Toggle Link */}
            <div className="text-center mt-6 pt-5 border-t border-slate-800 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleToggleMode}
                className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border cursor-pointer transition-all duration-200 ${
                  isAdminLogin 
                    ? 'border-blue-500/20 bg-blue-955/30 text-blue-400 hover:bg-blue-950/40' 
                    : 'border-red-500/25 bg-red-955/20 text-red-400 hover:bg-red-950/30'
                }`}
              >
                {isAdminLogin ? (
                  <>
                    <User size={13} />
                    <span>Return to Student Sign In</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={13} />
                    <span>Proctor Console Sign In</span>
                  </>
                )}
              </button>

              {!isAdminLogin && (
                <div className="text-xs text-slate-500">
                  <span>Don't have an account? </span>
                  <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                    Register Here
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Password Reset UI Block */
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h2>
              <p className="text-xs text-slate-405 mt-1">We will send a password recovery link to your inbox</p>
            </div>

            {resetSuccess ? (
              <div className="text-center py-4 flex flex-col items-center gap-4">
                <div className="h-10 w-10 bg-emerald-955/20 text-emerald-450 rounded-full flex items-center justify-center border border-emerald-900/30">
                  <Send size={18} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white m-0">Verification Link Transmitted</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-normal">If that email exists on our registers, you will receive a reset link shortly.</p>
                </div>
                <Button 
                  onClick={() => { setIsResetting(false); setResetSuccess(false); setResetEmail(''); }}
                  variant="primary"
                  className="w-full mt-2 font-bold py-3"
                >
                  <ArrowLeft size={16} />
                  <span>Return to Sign In</span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-955/20 border border-rose-900/30 text-xs text-rose-400 font-semibold text-center">
                    {error}
                  </div>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                  placeholder="name@university.edu"
                  required
                  icon={Mail}
                />

                <Button 
                  type="submit" 
                  loading={loading}
                  className="w-full mt-2 font-bold py-3.5 shadow-lg"
                >
                  <Send size={15} />
                  <span>Send Reset Link</span>
                </Button>

                <button
                  type="button"
                  onClick={() => { setIsResetting(false); setError(''); }}
                  className="text-xs text-slate-400 hover:text-white transition-colors py-2 font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
