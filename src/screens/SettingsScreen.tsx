import React, { useState } from 'react';
import {
  Settings,
  User,
  Sparkles,
  Shield,
  Palette,
  Key,
  CheckCircle2,
  Save,
  Cpu,
  Database,
} from 'lucide-react';
import { ScreenType, UserProfile } from '../types';

interface SettingsScreenProps {
  user: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  onSaveProfile,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'security' | 'appearance'>('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [company, setCompany] = useState(user.company);

  // AI settings
  const [geminiModel, setGeminiModel] = useState('models/gemini-3.6-flash');
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [creativity, setCreativity] = useState(0.4);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...user,
      name,
      email,
      role,
      company,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-[#161820] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Platform & Account Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure profile, Gemini AI parameters, security and preferences.</p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-[#161820] p-1.5 rounded-2xl border border-white/10 gap-2">
        {[
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'ai', label: 'AI Model & Intelligence', icon: Sparkles },
          { id: 'security', label: 'Security & API Keys', icon: Shield },
          { id: 'appearance', label: 'Appearance', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-[#161820] border border-white/10 rounded-3xl p-6 shadow-xl">
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-4">Profile Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organization / Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white">Gemini AI Model Configuration</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Selected Primary Model</label>
                <select
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  className="w-full bg-[#111318] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="models/gemini-3.6-flash" className="bg-[#181B22]">
                    models/gemini-3.6-flash (Ultra-Fast Dataset Intelligence)
                  </option>
                  <option value="models/gemini-3.6-pro" className="bg-[#181B22]">
                    models/gemini-3.6-pro (Deep Complex Statistical Reasoning)
                  </option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-[#111318] border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Auto-Run AI Analysis on Dataset Upload</p>
                  <p className="text-[11px] text-slate-400">Automatically compute summary, trends, and anomalies when a file is added.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoAnalysis}
                  onChange={(e) => setAutoAnalysis(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-white/10"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>AI Temperature / Analytical Precision</span>
                  <span className="font-mono text-cyan-400 font-bold">{creativity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={creativity}
                  onChange={(e) => setCreativity(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>0.0 (Strictly Deterministic)</span>
                  <span>1.0 (Creative Insights)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white">API Keys & Security</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#111318] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-cyan-400" /> GEMINI_API_KEY
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Active Environment Key
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  •••••••••••••••••••••••••••••••• (Managed securely via server environment)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111318] border border-white/10 space-y-1">
                <p className="text-xs font-bold text-white">Data Encryption at Rest</p>
                <p className="text-[11px] text-slate-400">All uploaded dataset records and generated reports are encrypted using AES-256.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Theme & UI Density</h3>
            <p className="text-xs text-slate-400">DataPilot AI is styled with modern dark luxury aesthetic optimized for long analytical sessions.</p>
            <div className="p-4 rounded-xl bg-[#111318] border border-cyan-500/30 text-xs font-mono text-cyan-300">
              Active Palette: Cyber Dark Slate & Neon Cyan Accent
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
