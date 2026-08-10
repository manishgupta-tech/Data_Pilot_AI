import React from 'react';
import {
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileSpreadsheet,
  ArrowRight,
  PieChart,
  Hash,
  Type,
  Calendar,
} from 'lucide-react';
import { ScreenType, Dataset } from '../types';
import { DatasetTable } from '../components/DatasetTable';

interface PreviewScreenProps {
  dataset: Dataset | null;
  onNavigate: (screen: ScreenType) => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({ dataset, onNavigate }) => {
  if (!dataset) {
    return (
      <div className="p-12 text-center bg-[#161820] rounded-2xl border border-white/10">
        <p className="text-slate-400 text-sm">No dataset selected for preview.</p>
        <button
          onClick={() => onNavigate('upload')}
          className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
        >
          Upload Dataset First
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#161820] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-mono">
              {dataset.type}
            </span>
            <span className="text-xs text-slate-400 font-mono">{dataset.fileSize}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            {dataset.name}
          </h1>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-slate-400 block text-[10px]">Total Rows</span>
            <strong className="text-white font-mono">{dataset.rows.toLocaleString()}</strong>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-slate-400 block text-[10px]">Columns</span>
            <strong className="text-white font-mono">{dataset.cols}</strong>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-slate-400 block text-[10px]">Quality Score</span>
            <strong className="text-emerald-400 font-mono font-bold">{dataset.quality}% Clean</strong>
          </div>

          <button
            onClick={() => onNavigate('analysis')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all ml-auto md:ml-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run AI Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Grid: Table + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table View (3 Cols) */}
        <div className="lg:col-span-3">
          <DatasetTable columns={dataset.columns} data={dataset.dataSample} pageSize={8} />
        </div>

        {/* Data Quality Side Panel (1 Col) */}
        <div className="space-y-4">
          <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Data Quality Audit
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#111318] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block">Missing Values</span>
                  <span className="text-[10px] text-slate-500 font-mono">Null / empty cells</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">{dataset.missingRows}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#111318] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block">Duplicate Rows</span>
                  <span className="text-[10px] text-slate-500 font-mono">Exact line matches</span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400">{dataset.duplicateRows}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#111318] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block">Invalid Values</span>
                  <span className="text-[10px] text-slate-500 font-mono">Unformatted strings</span>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400">{dataset.invalidValues}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#111318] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-300 block">Outliers Detected</span>
                  <span className="text-[10px] text-slate-500 font-mono">&gt; 3 std deviations</span>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400">{dataset.outliers}</span>
              </div>
            </div>
          </div>

          {/* Data Types Summary */}
          <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3">Detected Data Types</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><Type className="w-3.5 h-3.5 text-slate-400" /> Strings / Text</span>
                <span className="font-mono text-white font-bold">
                  {dataset.columns.filter((c) => c.dataType === 'string').length}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5 text-cyan-400" /> Numeric Numbers</span>
                <span className="font-mono text-white font-bold">
                  {dataset.columns.filter((c) => c.dataType === 'number').length}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald-400" /> Dates / Time</span>
                <span className="font-mono text-white font-bold">
                  {dataset.columns.filter((c) => c.dataType === 'date').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
