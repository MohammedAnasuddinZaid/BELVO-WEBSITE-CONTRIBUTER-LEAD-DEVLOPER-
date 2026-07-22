import React, { useState } from 'react';
import { api } from '../lib/db';
import { Profile, UserRole } from '../types';
import { Shield, BookOpen, Mail, User, GraduationCap, ChevronRight } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (profile: Profile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address');
      return;
    }
    if (isSignUp && !name) {
      setError('Please provide your full name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.login(email, role);
      if (result.error) {
        setError(result.error);
      } else if (result.profile) {
        if (isSignUp && name) {
          const profiles = JSON.parse(localStorage.getItem('os_qbank_profiles') || '[]');
          const idx = profiles.findIndex((p: any) => p.id === result.profile?.id);
          if (idx !== -1) {
            profiles[idx].name = name;
            profiles[idx].role = role;
            localStorage.setItem('os_qbank_profiles', JSON.stringify(profiles));
            result.profile.name = name;
            result.profile.role = role;
            localStorage.setItem('os_qbank_session', JSON.stringify(result.profile));
          }
        }
        onLoginSuccess(result.profile);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (presetEmail: string, presetRole: UserRole) => {
    setEmail(presetEmail);
    setPassword('preset123');
    setRole(presetRole);
    setIsSignUp(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-center items-center px-4 py-8 transition-colors duration-200">
      <div className="w-full max-w-md bg-bg-card border border-border-app rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
        <div className="bg-brand p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,transparent)]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-3 border border-white/10 shadow-inner">
              <GraduationCap className="w-8 h-8 text-brand-light animate-bounce" />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">OS Question Bank</h1>
            <p className="text-xs text-brand-light mt-1 max-w-xs mx-auto">
              Master Process Scheduling, Synchronization, Memory Layouts, and more!
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-accent-rose/10 border border-accent-rose/30 rounded-lg text-xs text-accent-rose font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-4 py-2 text-xs bg-bg-panel border border-border-app rounded-xl focus:outline-none focus:border-brand text-text-app"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2 text-xs bg-bg-panel border border-border-app rounded-xl focus:outline-none focus:border-brand text-text-app"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">Password</label>
              <div className="relative">
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-9 pr-4 py-2 text-xs bg-bg-panel border border-border-app rounded-xl focus:outline-none focus:border-brand text-text-app"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Select System Role</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button type="button" onClick={() => setRole('student')}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${role === 'student' ? 'bg-brand/10 border-brand text-brand' : 'border-border-app text-text-muted'}`}>
                    Student Account
                  </button>
                  <button type="button" onClick={() => setRole('admin')}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition ${role === 'admin' ? 'bg-brand/10 border-brand text-brand' : 'border-border-app text-text-muted'}`}>
                    Professor/Admin
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 px-4 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-semibold transition shadow-md shadow-brand/10 flex items-center justify-center gap-2 cursor-pointer mt-2">
              {loading ? 'Authenticating...' : <>{isSignUp ? 'Create Account' : 'Sign In'} <ChevronRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="text-xs font-semibold text-brand hover:underline">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>

          <div className="mt-6 border-t border-border-app pt-5">
            <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 text-center">
              Quick Test Credentials (No configuration needed)
            </h4>
            <div className="space-y-2">
              <button onClick={() => handleQuickFill('student@osbank.com', 'student')}
                className="w-full p-2 bg-bg-panel hover:bg-brand/5 border border-border-app hover:border-brand rounded-xl flex items-center justify-between text-left transition group">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-bold text-text-app">Shailender Dubey (Student)</div>
                    <div className="text-[10px] text-text-muted">student@osbank.com</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-brand">Auto-fill </span>
              </button>

              <button onClick={() => handleQuickFill('admin@osbank.com', 'admin')}
                className="w-full p-2 bg-bg-panel hover:bg-accent-emerald/5 border border-border-app hover:border-accent-emerald rounded-xl flex items-center justify-between text-left transition group">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-emerald group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-xs font-bold text-text-app">Professor Admin (Administrator)</div>
                    <div className="text-[10px] text-text-muted">admin@osbank.com</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-accent-emerald">Auto-fill </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
