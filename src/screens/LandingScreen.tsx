import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart2,
  FileSpreadsheet,
  MessageSquareCode,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { ScreenType } from '../types';

interface LandingScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onExploreDemo: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate, onExploreDemo }) => {
  return (
    <div className="min-h-screen bg-[#0D0F14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Landing Header */}
      <header className="border-b border-white/10 bg-[#0D0F14]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-[#0D0F14] rounded-[10px] flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            DataPilot <span className="text-cyan-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">Platform Features</a>
          <a href="#preview" className="hover:text-cyan-400 transition-colors">Product Preview</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('auth')}
            className="text-xs font-semibold px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all"
          >
            Launch Platform
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Enterprise Dataset Intelligence</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl font-sans">
          Turn your data into <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">intelligent decisions.</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
          Upload your dataset, discover hidden patterns, visualize trends, and receive AI-powered business recommendations in minutes.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Start Analyzing Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Interactive Demo</span>
          </button>
        </div>

        {/* Hero Visual Preview Card */}
        <div className="mt-14 w-full max-w-5xl rounded-2xl bg-[#141720] border border-white/15 p-3 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="rounded-xl bg-[#0F1117] border border-white/10 p-5 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-xs text-slate-400">sales_data_q2_analysis.csv</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Data Quality 96%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-slate-400 font-medium">Analyzed Rows</span>
                <p className="text-2xl font-bold text-white mt-1">25,430</p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12% vs last batch
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-slate-400 font-medium">AI Insights Found</span>
                <p className="text-2xl font-bold text-cyan-400 mt-1">10 Insights</p>
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">Automated anomaly detection</span>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-slate-400 font-medium">Top Recommendation</span>
                <p className="text-xs font-semibold text-slate-200 mt-1">Restock Electronics SKUs to prevent $45k revenue deficit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How DataPilot AI Works */}
      <section id="how-it-works" className="py-16 px-6 bg-[#0B0D12] border-y border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">How DataPilot AI Works</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2">Four seamless steps from raw dataset to executive intelligence</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              { step: '01', title: 'Upload Dataset', desc: 'Drag & drop CSV or Excel files with instant structure detection.' },
              { step: '02', title: 'AI Analyzes Data', desc: 'Automated statistical profiling, data cleaning, and anomaly scanning.' },
              { step: '03', title: 'Discover Insights', desc: 'Interactive charts, correlation matrices, and automated trends.' },
              { step: '04', title: 'Make Better Decisions', desc: 'Receive prioritized business recommendations and export reports.' },
            ].map((s, idx) => (
              <div key={idx} className="bg-[#141720] border border-white/10 rounded-2xl p-6 text-left relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <span className="text-3xl font-extrabold text-cyan-500/20 font-mono block mb-2">{s.step}</span>
                <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Built for Modern Analytics Teams</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2">Comprehensive suite of tools tailored for analysts, researchers, and executives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: 'AI Data Analysis', desc: 'Instant key findings, trend explanations, and executive summaries.' },
            { icon: ShieldCheck, title: 'Automated Data Cleaning', desc: 'Detect missing values, duplicates, outliers, and corrupted data types.' },
            { icon: BarChart2, title: 'Interactive Visualizations', desc: 'Line, Bar, Pie, Area, Scatter, and Heatmap charts in one canvas.' },
            { icon: MessageSquareCode, title: 'AI Data Chatbot', desc: 'Ask natural language questions about your dataset with Gemini AI.' },
            { icon: Zap, title: 'Anomaly Detection', desc: 'Identify revenue spikes, data errors, and unexpected behavioral clusters.' },
            { icon: FileSpreadsheet, title: 'Report Generation', desc: 'Export executive PDF, Excel, and CSV reports ready for presentations.' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-[#141720] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product CTA */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-900/30 via-blue-900/20 to-purple-900/30 border border-cyan-500/30 p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Ready to understand your data?</h2>
            <p className="text-slate-300 text-xs md:text-sm mt-3">Join thousands of analysts turning datasets into decision intelligence with DataPilot AI.</p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="mt-8 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/30 transition-all inline-flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 DataPilot AI. Enterprise Dataset Intelligence & Decision Support Platform.</p>
      </footer>
    </div>
  );
};
