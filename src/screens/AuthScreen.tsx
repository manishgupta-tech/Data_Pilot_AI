import React, { useState } from 'react';
import { Cpu, Mail, Lock, User, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { ScreenType, UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('manish.gupta@datapilot.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Manish Gupta');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: name || 'Manish Gupta',
      email: email || 'manish.gupta@datapilot.ai',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      role: 'Head of Analytics',
      company: 'Global Retail Operations',
      plan: 'Enterprise Pro',
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0F14] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 to-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#141720] border border-white/15 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-3 cursor-pointer group mb-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30">
              <div className="w-full h-full bg-[#141720] rounded-[14px] flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">DataPilot AI</span>
          </div>

          <h2 className="text-lg font-bold text-white">
            {mode === 'login' ? 'Welcome back to DataPilot' : 'Create your account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' ? 'Enter credentials to access your dataset workspace' : 'Start analyzing datasets in under 2 minutes'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/10">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'login' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'signup' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Manish Gupta"
                  className="w-full bg-[#0D0F14] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manish.gupta@datapilot.ai"
                className="w-full bg-[#0D0F14] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              {mode === 'login' && (
                <a href="#forgot" className="text-[11px] text-cyan-400 hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0D0F14] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all mt-6"
          >
            <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create DataPilot Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Bypass */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-cyan-400 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Instant Demo Login (Enterprise Pro)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
