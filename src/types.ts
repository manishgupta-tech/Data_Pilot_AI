export type ScreenType =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'upload'
  | 'preview'
  | 'analysis'
  | 'visualizations'
  | 'chat'
  | 'reports'
  | 'datasets'
  | 'settings'
  | 'dsa';

export interface ColumnInfo {
  name: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  missingCount: number;
  uniqueCount: number;
}

export interface Dataset {
  id: string;
  name: string;
  type: 'CSV' | 'Excel' | 'JSON';
  rows: number;
  cols: number;
  fileSize: string;
  quality: number; // 0 - 100
  lastAnalyzed: string;
  status: 'Analyzed' | 'Processing' | 'Clean' | 'Pending';
  columns: ColumnInfo[];
  dataSample: Record<string, any>[];
  missingRows: number;
  duplicateRows: number;
  invalidValues: number;
  outliers: number;
}

export interface KeyFinding {
  finding: string;
  explanation: string;
  metric: string;
  importance: 'High' | 'Medium' | 'Low';
}

export interface TrendItem {
  title: string;
  description: string;
  growth: string;
}

export interface AnomalyItem {
  issue: string;
  column: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface RecommendationItem {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  supportingMetric: string;
}

export interface AIAnalysis {
  executiveSummary: string;
  dataQualityScore: number;
  keyFindings: KeyFinding[];
  trends: TrendItem[];
  anomalies: AnomalyItem[];
  businessInsights: string[];
  recommendations: RecommendationItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  chartSuggestion?: {
    type: 'bar' | 'line' | 'pie';
    title: string;
    data: { name: string; value: number }[];
  };
}

export interface ReportMetric {
  label: string;
  value: string;
  change: string;
}

export interface ReportSection {
  title: string;
  content: string;
}

export interface Report {
  id: string;
  title: string;
  datasetName: string;
  type?: 'Sales Analysis' | 'Customer Insights' | 'Data Quality' | 'AI Executive Decision';
  createdAt: string;
  status?: 'Ready' | 'Generating';
  fileSize?: string;
  executiveSummary?: string;
  summary?: string;
  format?: 'PDF' | 'Excel' | 'CSV';
  metrics?: ReportMetric[];
  recommendationsCount?: number;
  sections?: ReportSection[];
  downloadUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  company: string;
  plan: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
