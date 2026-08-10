import React from 'react';
import { Sparkles, AlertOctagon, Lightbulb, ArrowUpRight, CheckCircle, Flame } from 'lucide-react';
import { KeyFinding, AnomalyItem, RecommendationItem } from '../types';

interface KeyFindingCardProps {
  finding: KeyFinding;
}

export const KeyFindingCard: React.FC<KeyFindingCardProps> = ({ finding }) => {
  const getImportanceBadge = (imp: 'High' | 'Medium' | 'Low') => {
    switch (imp) {
      case 'High':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    }
  };

  return (
    <div className="bg-[#181B22] border border-white/10 rounded-2xl p-4 hover:border-cyan-500/30 transition-all shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getImportanceBadge(finding.importance)}`}>
            {finding.importance} Priority
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">{finding.metric}</span>
        </div>
        <h4 className="text-xs font-bold text-white mb-1">{finding.finding}</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">{finding.explanation}</p>
      </div>
    </div>
  );
};

interface AnomalyCardProps {
  anomaly: AnomalyItem;
}

export const AnomalyCard: React.FC<AnomalyCardProps> = ({ anomaly }) => {
  const getSeverityBadge = (sev: 'High' | 'Medium' | 'Low') => {
    switch (sev) {
      case 'High':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="bg-[#181B22] border border-white/10 rounded-2xl p-4 flex items-start gap-3 hover:border-rose-500/30 transition-all">
      <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
        <AlertOctagon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h5 className="text-xs font-bold text-white truncate">{anomaly.issue}</h5>
          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${getSeverityBadge(anomaly.severity)} shrink-0`}>
            {anomaly.severity} Severity
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-1.5">{anomaly.description}</p>
        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded inline-block">
          Column: {anomaly.column}
        </div>
      </div>
    </div>
  );
};

interface RecommendationCardProps {
  recommendation: RecommendationItem;
  onApplyAction?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onApplyAction }) => {
  return (
    <div className="bg-gradient-to-r from-[#181B22] to-[#1E222D] border border-cyan-500/30 rounded-2xl p-4 shadow-xl hover:border-cyan-400 transition-all">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
          <Lightbulb className="w-4 h-4 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-xs font-bold text-white truncate">{recommendation.title}</h4>
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 rounded-full shrink-0">
              {recommendation.priority} Priority
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">{recommendation.reason}</p>
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
            <span className="text-slate-400 font-mono">
              Impact Metric: <strong className="text-emerald-400 font-semibold">{recommendation.supportingMetric}</strong>
            </span>
            {onApplyAction && (
              <button
                onClick={onApplyAction}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 hover:underline text-[11px]"
              >
                Apply Recommendation <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
