import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, UserPlus, ShieldAlert } from 'lucide-react';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, isMockAuth } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);

    try {
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.message.includes('auth/email-already-in-use')) {
        setError('Email address is already registered.');
      } else if (err.message.includes('auth/invalid-email')) {
        setError('Invalid email address format.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4">
      {/* Background decoration */}
      <div className="mesh-bg"></div>

      <Card className="w-full max-w-md border border-slate-800 bg-slate-900/90 relative z-10 animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Register for the SACAS assessment portal</p>
        </div>

        {isMockAuth && (
          <div className="mb-5 p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-[11px] text-amber-400 leading-normal flex items-start gap-2.5">
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold">Developer Notice:</span> Operating in **Mock Mode**. You can register with any mock email and password.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-955/20 border border-rose-900/30 text-xs text-rose-400 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@university.edu"
            required
            icon={Mail}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={Lock}
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={Lock}
          />

          <Button 
            type="submit" 
            loading={loading}
            className="w-full mt-2 font-bold py-3 hover:shadow-blue-500/10"
          >
            <UserPlus size={16} />
            <span>Create Account</span>
          </Button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-slate-800 text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
