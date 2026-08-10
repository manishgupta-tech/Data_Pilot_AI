import React, { useState } from 'react';
import {
  Sparkles,
  FileSpreadsheet,
  BarChart3,
  MessageSquareCode,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  Lightbulb,
  Layers,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';
import { ScreenType, Dataset, AIAnalysis } from '../types';
import { KeyFindingCard, AnomalyCard, RecommendationCard } from '../components/InsightCard';
import { ChartCard } from '../components/ChartCard';
import { CHART_DATA_TRENDS, CHART_DATA_ANOMALIES } from '../data/mockData';

interface AnalysisScreenProps {
  dataset: Dataset | null;
  analysis: AIAnalysis;
  onNavigate: (screen: ScreenType) => void;
  onRefreshAnalysis: () => void;
  isReanalyzing: boolean;
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  dataset,
  analysis,
  onNavigate,
  onRefreshAnalysis,
  isReanalyzing,
}) => {
  const datasetName = dataset ? dataset.name : 'sales_data.csv';

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-[#161820] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase font-mono">
              AI Analysis Ready
            </span>
            <span className="text-xs text-slate-400 font-mono">Model: Gemini 3.6 Flash</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Analysis Workspace — {datasetName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshAnalysis}
            disabled={isReanalyzing}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isReanalyzing ? 'animate-spin' : ''}`} />
            <span>{isReanalyzing ? 'Re-analyzing...' : 'Re-run AI Analysis'}</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Generate Executive Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. EXECUTIVE SUMMARY */}
      <div className="bg-gradient-to-r from-[#181B24] via-[#1E1B2A] to-[#181B24] border border-purple-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" /> Executive AI Summary
          </div>

          <p className="text-sm md:text-base font-medium text-slate-100 leading-relaxed font-sans">
            "{analysis.executiveSummary}"
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
            <span>Overall Data Health: <strong className="text-emerald-400">{analysis.dataQualityScore}%</strong></span>
            <span>Total Rows: <strong className="text-white">{dataset?.rows.toLocaleString() || '25,430'}</strong></span>
            <span>Columns Analyzed: <strong className="text-white">{dataset?.cols || 14}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. KEY FINDINGS GRID */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" /> Key Dataset Findings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.keyFindings.map((finding, idx) => (
            <KeyFindingCard key={idx} finding={finding} />
          ))}
        </div>
      </div>

      {/* 3. TRENDS & ANOMALIES ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Trend Chart */}
        <ChartCard
          title="Revenue & Performance Trajectory"
          subtitle="Monthly record volume and growth benchmark"
          type="area"
          data={CHART_DATA_TRENDS}
          dataKeys={[
            { key: 'Sales', color: '#0099FF', label: 'Actual Revenue' },
            { key: 'Target', color: '#A855F7', label: 'Target Benchmark' },
          ]}
          height={260}
          onExpand={() => onNavigate('visualizations')}
        />

        {/* Detected Anomalies */}
        <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" /> Detected Anomalies
              </h3>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                {analysis.anomalies.length} Scanned Issues
              </span>
            </div>

            <div className="space-y-3">
              {analysis.anomalies.map((anomaly, idx) => (
                <AnomalyCard key={idx} anomaly={anomaly} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. BUSINESS INSIGHTS & RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Business Insights Bullet List */}
        <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" /> AI Business Insights
          </h3>

          <ul className="space-y-3">
            {analysis.businessInsights.map((insight, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-[#111318] border border-white/5 text-xs text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Recommendations (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Actionable Recommendations
          </h3>

          <div className="space-y-3">
            {analysis.recommendations.map((rec, idx) => (
              <RecommendationCard
                key={idx}
                recommendation={rec}
                onApplyAction={() => onNavigate('chat')}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
