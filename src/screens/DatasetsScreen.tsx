import React, { useState } from 'react';
import {
  Database,
  Search,
  UploadCloud,
  Sparkles,
  Trash2,
  CheckCircle2,
  BarChart3,
  MessageSquareCode,
  FileSpreadsheet,
  Layers,
  MoreVertical,
  Plus,
} from 'lucide-react';
import { ScreenType, Dataset } from '../types';
import { Modal } from '../components/Modal';

interface DatasetsScreenProps {
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  onSelectDataset: (ds: Dataset) => void;
  onDeleteDataset: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const DatasetsScreen: React.FC<DatasetsScreenProps> = ({
  datasets,
  selectedDataset,
  onSelectDataset,
  onDeleteDataset,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredDatasets = datasets.filter((ds) =>
    ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ds.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteDataset(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-[#161820] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-mono">
              Workspace Repository
            </span>
            <span className="text-xs text-slate-400 font-mono">{datasets.length} Datasets Managed</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            My Datasets
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter datasets..."
              className="w-full bg-[#111318] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Dataset</span>
          </button>
        </div>
      </div>

      {/* Datasets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map((ds) => {
          const isSelected = selectedDataset?.id === ds.id;
          return (
            <div
              key={ds.id}
              className={`bg-[#161820] border rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between group ${
                isSelected ? 'border-cyan-500 ring-1 ring-cyan-500/50 bg-[#191C26]' : 'border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    {ds.type} • {ds.fileSize}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {ds.quality}% Clean
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors truncate">
                  {ds.name}
                </h3>

                <div className="grid grid-cols-2 gap-2 my-4 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#111318] border border-white/5">
                    <span className="text-slate-400 text-[10px] block">Rows</span>
                    <strong className="text-white">{ds.rows.toLocaleString()}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#111318] border border-white/5">
                    <span className="text-slate-400 text-[10px] block">Columns</span>
                    <strong className="text-white">{ds.cols}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-1">
                <button
                  onClick={() => {
                    onSelectDataset(ds);
                    onNavigate('preview');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                >
                  Preview Data
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectDataset(ds);
                      onNavigate('analysis');
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-purple-300 border border-white/10 transition-colors"
                    title="Run AI Analysis"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectDataset(ds);
                      onNavigate('chat');
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-300 border border-white/10 transition-colors"
                    title="Ask AI Chat"
                  >
                    <MessageSquareCode className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(ds.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                    title="Delete Dataset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Dataset"
        subtitle="Are you sure you want to remove this dataset from workspace?"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            This action will permanently delete the dataset records, cached analysis models, and reports.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
