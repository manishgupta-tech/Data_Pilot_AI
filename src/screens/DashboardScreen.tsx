import React from 'react';
import {
  UploadCloud,
  Database,
  Layers,
  Sparkles,
  FileSpreadsheet,
  BarChart3,
  MessageSquareCode,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Zap,
} from 'lucide-react';
import { ScreenType, Dataset, AIAnalysis } from '../types';
import { MetricCard } from '../components/MetricCard';
import { ChartCard } from '../components/ChartCard';
import { CHART_DATA_TRENDS, CHART_DATA_CATEGORY } from '../data/mockData';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenType) => void;
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  onSelectDataset: (ds: Dataset) => void;
  analysis: AIAnalysis;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  datasets,
  selectedDataset,
  onSelectDataset,
  analysis,
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#161922] via-[#1A1D28] to-[#161922] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Welcome back, Manish! <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Here's what's happening with your datasets today.</p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>+ Upload Dataset</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Datasets"
          value={datasets.length || 12}
          change="+2 this month"
          isPositive={true}
          subtext="Active in platform"
          icon={Database}
          accentColor="cyan"
        />
        <MetricCard
          title="Rows Analyzed"
          value="25,430"
          change="+12%"
          isPositive={true}
          subtext="across 14 features"
          icon={Layers}
          accentColor="emerald"
        />
        <MetricCard
          title="AI Insights"
          value="10"
          change="+4 this week"
          isPositive={true}
          subtext="Automated findings"
          icon={Sparkles}
          accentColor="purple"
        />
        <MetricCard
          title="Reports Generated"
          value="18"
          change="+3 this month"
          isPositive={true}
          subtext="Executive exports"
          icon={FileSpreadsheet}
          accentColor="amber"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Dataset Overview & Activity"
            subtitle="Record processing activity over the last 6 months"
            type="area"
            data={CHART_DATA_TRENDS}
            dataKeys={[
              { key: 'Sales', color: '#0099FF', label: 'Total Records' },
              { key: 'CleanRecords', color: '#10B981', label: 'Clean Records' },
            ]}
            height={260}
            onExpand={() => onNavigate('visualizations')}
          />
        </div>

        <div>
          <ChartCard
            title="Dataset Types Breakdown"
            subtitle="File format distribution across workspace"
            type="pie"
            data={CHART_DATA_CATEGORY}
            height={260}
            onExpand={() => onNavigate('visualizations')}
          />
        </div>
      </div>

      {/* Data Quality Gauge & Quick AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Quality Card */}
        <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Average Data Quality</h3>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                94% Overall Health
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Quality calculation based on null counts, duplicates, data type integrity, and outlier density.
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Clean Data Cell Density</span>
                  <span className="font-mono font-bold text-emerald-400">96.4%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '96.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Duplicates Impact</span>
                  <span className="font-mono font-bold text-cyan-400">0.05%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '2%' }} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('preview')}
            className="mt-6 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors text-center"
          >
            Inspect Data Quality Panel →
          </button>
        </div>

        {/* AI Insights Highlight Cards */}
        <div className="lg:col-span-2 bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Latest AI Dataset Insights</h3>
              </div>
              <button onClick={() => onNavigate('analysis')} className="text-xs font-semibold text-cyan-400 hover:underline">
                View All Analysis →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#1D202B] border border-white/10 hover:border-purple-500/30 transition-all">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Revenue Trend</div>
                <p className="text-xs font-medium text-slate-200 leading-snug">
                  "Sales increased by 23% in the last quarter across primary channels."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1D202B] border border-white/10 hover:border-amber-500/30 transition-all">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Data Hygiene</div>
                <p className="text-xs font-medium text-slate-200 leading-snug">
                  "12% of customer records contain missing rating and location values."
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1D202B] border border-white/10 hover:border-cyan-500/30 transition-all">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Top Performer</div>
                <p className="text-xs font-medium text-slate-200 leading-snug">
                  "Product A is your highest-performing category generating 34% revenue."
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>AI Model: Gemini 3.6 Flash</span>
            <span className="text-purple-400 font-semibold">10 Insights Generated</span>
          </div>
        </div>
      </div>

      {/* Recent Datasets Table */}
      <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Datasets</h3>
            <p className="text-xs text-slate-400">Managed datasets and processing status</p>
          </div>
          <button onClick={() => onNavigate('datasets')} className="text-xs font-semibold text-cyan-400 hover:underline">
            View All Datasets →
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111318]">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#1B1E28] text-slate-300 font-semibold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="px-3.5 py-3">Dataset Name</th>
                <th className="px-3.5 py-3">Type</th>
                <th className="px-3.5 py-3">Rows</th>
                <th className="px-3.5 py-3">Columns</th>
                <th className="px-3.5 py-3">Quality</th>
                <th className="px-3.5 py-3">Last Analyzed</th>
                <th className="px-3.5 py-3">Status</th>
                <th className="px-3.5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {datasets.map((ds) => (
                <tr key={ds.id} className="hover:bg-white/5 transition-colors font-mono">
                  <td className="px-3.5 py-3 font-semibold text-white flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate max-w-[160px]">{ds.name}</span>
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold">
                      {ds.type}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">{ds.rows.toLocaleString()}</td>
                  <td className="px-3.5 py-3">{ds.cols}</td>
                  <td className="px-3.5 py-3">
                    <span className="text-emerald-400 font-bold">{ds.quality}%</span>
                  </td>
                  <td className="px-3.5 py-3 text-slate-400">{ds.lastAnalyzed}</td>
                  <td className="px-3.5 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> {ds.status}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    <button
                      onClick={() => {
                        onSelectDataset(ds);
                        onNavigate('analysis');
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 transition-colors"
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Upload Dataset', icon: UploadCloud, action: () => onNavigate('upload') },
            { label: 'Run AI Analysis', icon: Sparkles, action: () => onNavigate('analysis') },
            { label: 'Create Visualization', icon: BarChart3, action: () => onNavigate('visualizations') },
            { label: 'Generate Report', icon: FileSpreadsheet, action: () => onNavigate('reports') },
            { label: 'Ask AI Chatbot', icon: MessageSquareCode, action: () => onNavigate('chat') },
          ].map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.action}
                className="p-3 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all text-center flex flex-col items-center gap-2 group"
              >
                <Icon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-200">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
