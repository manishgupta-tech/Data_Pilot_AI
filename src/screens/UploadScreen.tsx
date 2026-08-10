import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  X,
  Database,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { ScreenType, Dataset } from '../types';

interface UploadScreenProps {
  onDatasetUploaded: (newDataset: Dataset) => void;
  onNavigate: (screen: ScreenType) => void;
  recentDatasets: Dataset[];
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onDatasetUploaded,
  onNavigate,
  recentDatasets,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setUploadProgress(0);
  };

  const parseAndUploadFile = () => {
    if (!selectedFile) return;
    setIsUploading(true);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);

        // Read text content if CSV
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          let parsedRowsCount = 12500;
          let columnsNames = ['Customer_ID', 'Category', 'Revenue', 'Quantity', 'Date', 'Status'];
          let parsedSample: Record<string, any>[] = [];

          if (text && selectedFile.name.endsWith('.csv')) {
            const lines = text.split('\n').filter((l) => l.trim().length > 0);
            if (lines.length > 1) {
              columnsNames = lines[0].split(',').map((c) => c.replace(/"/g, '').trim());
              parsedRowsCount = lines.length - 1;

              for (let i = 1; i < Math.min(lines.length, 10); i++) {
                const vals = lines[i].split(',').map((v) => v.replace(/"/g, '').trim());
                const rowObj: Record<string, any> = {};
                columnsNames.forEach((col, idx) => {
                  rowObj[col] = vals[idx] || '';
                });
                parsedSample.push(rowObj);
              }
            }
          }

          const fileType: 'CSV' | 'Excel' | 'JSON' = selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') ? 'Excel' : 'CSV';

          const newDs: Dataset = {
            id: `ds-${Date.now()}`,
            name: selectedFile.name,
            type: fileType,
            rows: parsedRowsCount,
            cols: columnsNames.length,
            fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
            quality: 95,
            lastAnalyzed: 'Just now',
            status: 'Analyzed',
            missingRows: Math.floor(parsedRowsCount * 0.02),
            duplicateRows: 4,
            invalidValues: 2,
            outliers: 12,
            columns: columnsNames.map((name) => ({
              name,
              dataType: name.toLowerCase().includes('date')
                ? 'date'
                : name.toLowerCase().includes('id') || name.toLowerCase().includes('name')
                ? 'string'
                : 'number',
              missingCount: Math.floor(Math.random() * 5),
              uniqueCount: Math.floor(parsedRowsCount * 0.4),
            })),
            dataSample: parsedSample.length > 0 ? parsedSample : [
              { Order_ID: 'ORD-901', Product: 'Laptop Pro', Category: 'Electronics', Revenue: 1450, Date: '2026-05-18' },
              { Order_ID: 'ORD-902', Product: 'Wireless Mouse', Category: 'Electronics', Revenue: 45, Date: '2026-05-18' },
            ],
          };

          onDatasetUploaded(newDs);
          onNavigate('preview');
        };

        if (selectedFile.name.endsWith('.csv')) {
          reader.readAsText(selectedFile);
        } else {
          // Fallback simulation for xlsx
          const newDs: Dataset = {
            id: `ds-${Date.now()}`,
            name: selectedFile.name,
            type: 'Excel',
            rows: 15200,
            cols: 16,
            fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
            quality: 94,
            lastAnalyzed: 'Just now',
            status: 'Analyzed',
            missingRows: 140,
            duplicateRows: 8,
            invalidValues: 4,
            outliers: 15,
            columns: [
              { name: 'Customer_ID', dataType: 'string', missingCount: 0, uniqueCount: 8200 },
              { name: 'Revenue', dataType: 'number', missingCount: 0, uniqueCount: 4200 },
              { name: 'Order_Date', dataType: 'date', missingCount: 0, uniqueCount: 365 },
            ],
            dataSample: [
              { Customer_ID: 'CUST-301', Revenue: 850, Order_Date: '2026-05-18' },
            ],
          };
          onDatasetUploaded(newDs);
          onNavigate('preview');
        }
      }
    }, 200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Upload your dataset</h1>
        <p className="text-xs text-slate-400 mt-1">Upload CSV or Excel files and let DataPilot AI analyze them automatically.</p>
      </div>

      {/* Main Drag and Drop Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
          }
        }}
        className={`bg-[#161820] border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all ${
          dragActive ? 'border-cyan-400 bg-cyan-500/5 scale-[1.01]' : 'border-white/15 hover:border-cyan-500/40'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
          <UploadCloud className="w-8 h-8 animate-bounce" />
        </div>

        <h3 className="text-base font-bold text-white mb-1">Drag & Drop your dataset file here</h3>
        <p className="text-xs text-slate-400 mb-4">or click to browse from your device</p>

        <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all">
          <span>Browse Files</span>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          />
        </label>

        <p className="text-[11px] text-slate-500 font-mono mt-4">Supported formats: CSV, XLSX, XLS (Maximum file size: 50MB)</p>
      </div>

      {/* Selected File & Upload Progress Bar */}
      {selectedFile && (
        <div className="bg-[#181B22] border border-cyan-500/40 rounded-2xl p-5 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Dataset File'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedFile(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs text-slate-300 font-mono">
                <span>Uploading & Parsing Dataset...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={parseAndUploadFile}
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isUploading ? 'Analyzing Dataset...' : 'Analyze Dataset Now'}</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Automation Features Checklist */}
      <div className="bg-[#161820] border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          DataPilot AI will automatically:
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'Detect columns & attributes',
            'Identify data types (String, Num, Date)',
            'Find missing values & Nulls',
            'Find duplicate records',
            'Calculate summary statistics',
            'Detect statistical anomalies',
            'Generate interactive visualizations',
            'Generate business AI recommendations',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-slate-200 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="bg-[#161820] border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4">Recent Workspace Datasets</h3>

        <div className="space-y-3">
          {recentDatasets.slice(0, 3).map((ds) => (
            <div key={ds.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#111318] border border-white/5 hover:border-white/15 transition-all">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-white">{ds.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {ds.rows.toLocaleString()} rows • {ds.cols} columns • {ds.fileSize}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-400 font-mono">{ds.quality}% Quality</span>
                <button
                  onClick={() => onNavigate('preview')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-cyan-300"
                >
                  Preview Data →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
