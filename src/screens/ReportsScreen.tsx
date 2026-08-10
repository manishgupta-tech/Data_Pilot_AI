import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Plus,
  Eye,
  Trash2,
  Sparkles,
  CheckCircle2,
  BarChart2,
  Database,
  Calendar,
  Layers,
  FileText,
  Printer,
} from 'lucide-react';
import { ScreenType, Report, Dataset } from '../types';
import { Modal } from '../components/Modal';

interface ReportsScreenProps {
  reports: Report[];
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  onGenerateReport: (newReport: Report) => void;
  onDeleteReport: (id: string) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  reports,
  datasets,
  selectedDataset,
  onGenerateReport,
  onDeleteReport,
  onNavigate,
}) => {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  // Form State
  const [reportTitle, setReportTitle] = useState('Executive Data Summary Q2 2026');
  const [chosenDatasetId, setChosenDatasetId] = useState<string>(selectedDataset?.id || datasets[0]?.id || '');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'Excel' | 'CSV'>('PDF');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAnomalies, setIncludeAnomalies] = useState(true);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const ds = datasets.find((d) => d.id === chosenDatasetId) || selectedDataset || datasets[0];

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      title: reportTitle,
      datasetName: ds ? ds.name : 'sales_data.csv',
      createdAt: 'Just now',
      format: exportFormat,
      summary: `Automated dataset intelligence report for ${ds ? ds.name : 'dataset'}. Includes executive KPIs, quality audit, and revenue trends.`,
      sections: [
        {
          title: '1. Executive Summary',
          content: `DataPilot AI completed automated statistical analysis of ${ds?.rows.toLocaleString() || '25,430'} dataset rows across ${ds?.cols || 14} features. Data hygiene score is ${ds?.quality || 95}% clean.`,
        },
        {
          title: '2. Data Quality Audit',
          content: `Found ${ds?.missingRows || 45} missing cells, ${ds?.duplicateRows || 4} duplicate rows, and ${ds?.outliers || 12} statistical outliers. Integrity remains well within enterprise guidelines.`,
        },
        {
          title: '3. Strategic AI Recommendations',
          content: '1. Restock high-margin Electronics SKUs prior to peak period.\n2. Address missing customer location values in sales pipeline.',
        },
      ],
      downloadUrl: '#',
    };

    onGenerateReport(newReport);
    setIsGenerateModalOpen(false);
    setViewingReport(newReport);
  };

  const handleDownloadFile = (report: Report, format: string) => {
    const textContent = `${report.title}\nDataset: ${report.datasetName}\nGenerated: ${report.createdAt}\n\n${report.summary}\n\n` +
      report.sections.map((s) => `${s.title}\n${s.content}\n`).join('\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.toLowerCase().replace(/\s+/g, '_')}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-[#161820] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase font-mono">
              Report Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">PDF • Excel • CSV Exports</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            Executive Reports & Exports
          </h1>
        </div>

        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Generate New Report</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-[#161820] border border-white/10 hover:border-amber-500/30 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  {report.format} Format
                </span>
                <span className="text-[10px] font-mono text-slate-400">{report.createdAt}</span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                {report.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-3 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                {report.datasetName}
              </p>

              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                {report.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => setViewingReport(report)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Preview</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleDownloadFile(report, report.format)}
                  className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteReport(report.id)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                  title="Delete Report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Generate New Report */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Executive Intelligence Report"
        subtitle="Configure sections, dataset, and export formats"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateReport} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Report Title</label>
            <input
              type="text"
              required
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full bg-[#111318] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Dataset</label>
            <select
              value={chosenDatasetId}
              onChange={(e) => setChosenDatasetId(e.target.value)}
              className="w-full bg-[#111318] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {datasets.map((ds) => (
                <option key={ds.id} value={ds.id} className="bg-[#181B22]">
                  {ds.name} ({ds.rows.toLocaleString()} rows)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['PDF', 'Excel', 'CSV'] as const).map((fmt) => (
                <button
                  type="button"
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    exportFormat === fmt
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {fmt} Document
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
              />
              <span>Include Recharts Visualizations & Trends</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={includeAnomalies}
                onChange={(e) => setIncludeAnomalies(e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
              />
              <span>Include AI Anomaly & Data Quality Audit</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Report Now</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Full Executive Preview */}
      <Modal
        isOpen={!!viewingReport}
        onClose={() => setViewingReport(null)}
        title={viewingReport?.title || 'Report Preview'}
        subtitle={`Dataset: ${viewingReport?.datasetName}`}
        maxWidth="2xl"
      >
        {viewingReport && (
          <div className="space-y-6 p-2 text-slate-200">
            {/* Header Document Banner */}
            <div className="p-4 rounded-xl bg-[#111318] border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Confidential Executive Intelligence</span>
                <h2 className="text-base font-bold text-white mt-0.5">{viewingReport.title}</h2>
                <p className="text-xs text-slate-400">Generated on {viewingReport.createdAt}</p>
              </div>
              <button
                onClick={() => handleDownloadFile(viewingReport, viewingReport.format)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download {viewingReport.format}
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {viewingReport.sections.map((sec, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#181B22] border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">{sec.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{sec.content}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={() => setViewingReport(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
