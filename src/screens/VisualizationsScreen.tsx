import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  Maximize2,
  PieChart as PieChartIcon,
  TrendingUp,
  SlidersHorizontal,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ScreenType, Dataset } from '../types';
import { ChartCard } from '../components/ChartCard';
import { Modal } from '../components/Modal';
import { CHART_DATA_TRENDS, CHART_DATA_CATEGORY, CHART_DATA_ANOMALIES } from '../data/mockData';

interface VisualizationsScreenProps {
  dataset: Dataset | null;
  onNavigate: (screen: ScreenType) => void;
}

export const VisualizationsScreen: React.FC<VisualizationsScreenProps> = ({ dataset, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedChartTitle, setExpandedChartTitle] = useState<string | null>(null);

  const datasetName = dataset ? dataset.name : 'sales_data.csv';

  const scatterData = [
    { age: 22, spending: 120, rating: 4.2 },
    { age: 28, spending: 450, rating: 4.8 },
    { age: 34, spending: 890, rating: 4.9 },
    { age: 42, spending: 1250, rating: 4.5 },
    { age: 50, spending: 600, rating: 4.0 },
    { age: 58, spending: 310, rating: 3.8 },
  ];

  const heatmapMatrix = [
    { metric: 'Revenue', Revenue: 1.0, Quantity: 0.82, Discount: -0.34, Rating: 0.45 },
    { metric: 'Quantity', Revenue: 0.82, Quantity: 1.0, Discount: 0.12, Rating: 0.28 },
    { metric: 'Discount', Revenue: -0.34, Quantity: 0.12, Discount: 1.0, Rating: -0.15 },
    { metric: 'Rating', Revenue: 0.45, Quantity: 0.28, Discount: -0.15, Rating: 1.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="p-6 rounded-3xl bg-[#161820] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-mono">
              Dataset: {datasetName}
            </span>
            <span className="text-xs text-slate-400 font-mono">Interactive Visualizations Canvas</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Visualizations & Analytics Charts
          </h1>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#111318] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-bold"
            >
              <option value="All" className="bg-[#181B22]">All Categories</option>
              <option value="Electronics" className="bg-[#181B22]">Electronics</option>
              <option value="Apparel" className="bg-[#181B22]">Apparel</option>
              <option value="Home" className="bg-[#181B22]">Home & Kitchen</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate('analysis')}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Insights</span>
          </button>
        </div>
      </div>

      {/* Main Grid of Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue Line Trend */}
        <ChartCard
          title="Revenue & Performance Trend"
          subtitle="Monthly revenue growth vs clean data records"
          type="line"
          data={CHART_DATA_TRENDS}
          dataKeys={[
            { key: 'Sales', color: '#0099FF', label: 'Total Revenue ($)' },
            { key: 'CleanRecords', color: '#10B981', label: 'Clean Records' },
          ]}
          height={280}
          onExpand={() => setExpandedChartTitle('Revenue & Performance Trend')}
        />

        {/* Chart 2: Category Bar Distribution */}
        <ChartCard
          title="Category Revenue Distribution"
          subtitle="Revenue comparison across key product SKUs"
          type="bar"
          data={[
            { name: 'Electronics', revenue: 1235900 },
            { name: 'Apparel', revenue: 615400 },
            { name: 'Home & Kitchen', revenue: 382100 },
            { name: 'Footwear', revenue: 214800 },
            { name: 'Beauty', revenue: 98000 },
          ]}
          dataKeys={[{ key: 'revenue', color: '#A855F7', label: 'Revenue ($)' }]}
          height={280}
          onExpand={() => setExpandedChartTitle('Category Revenue Distribution')}
        />

        {/* Chart 3: Area Cumulative Growth */}
        <ChartCard
          title="Cumulative Growth Area"
          subtitle="Target benchmarks vs sales velocity"
          type="area"
          data={CHART_DATA_TRENDS}
          dataKeys={[
            { key: 'Sales', color: '#10B981', label: 'Sales Growth' },
            { key: 'Target', color: '#F59E0B', label: 'Target Target' },
          ]}
          height={280}
          onExpand={() => setExpandedChartTitle('Cumulative Growth Area')}
        />

        {/* Chart 4: Pie Market Share */}
        <ChartCard
          title="Customer Segment Breakdown"
          subtitle="Proportion of total dataset entries"
          type="pie"
          data={CHART_DATA_CATEGORY}
          height={280}
          onExpand={() => setExpandedChartTitle('Customer Segment Breakdown')}
        />
      </div>

      {/* Advanced Statistical Visualizations: Correlation Heatmap Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap Matrix Card */}
        <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Correlation Matrix Heatmap</h3>
              <p className="text-xs text-slate-400">Statistical relationships between numeric features</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Pearson R Coefficient
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#111318] p-3">
            <table className="w-full text-center text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="p-2 text-left">Feature</th>
                  <th className="p-2">Revenue</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Discount</th>
                  <th className="p-2">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {heatmapMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2 text-left font-bold text-white">{row.metric}</td>
                    {['Revenue', 'Quantity', 'Discount', 'Rating'].map((colKey) => {
                      const val = (row as any)[colKey];
                      const bg =
                        val === 1.0
                          ? 'bg-cyan-500/40 text-cyan-200 font-bold'
                          : val > 0.5
                          ? 'bg-emerald-500/30 text-emerald-300'
                          : val < 0
                          ? 'bg-rose-500/25 text-rose-300'
                          : 'bg-white/5 text-slate-300';
                      return (
                        <td key={colKey} className="p-2">
                          <span className={`inline-block px-2 py-1 rounded w-14 text-center ${bg}`}>
                            {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scatter Distribution Card */}
        <div className="bg-[#161820] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Age vs Spending Dispersion</h3>
                <p className="text-xs text-slate-400">Scatter distribution analysis for customer demographics</p>
              </div>
            </div>

            <div className="space-y-3">
              {scatterData.map((pt, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#111318] border border-white/5 text-xs font-mono">
                  <span className="text-slate-300">Age Cohort: <strong>{pt.age} yrs</strong></span>
                  <span className="text-cyan-400 font-bold">Spending: ${pt.spending}</span>
                  <span className="text-emerald-400">Rating: {pt.rating}★</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      <Modal
        isOpen={!!expandedChartTitle}
        onClose={() => setExpandedChartTitle(null)}
        title={expandedChartTitle || 'Expanded Chart View'}
        subtitle="Full resolution interactive visualization canvas"
        maxWidth="4xl"
      >
        <div className="p-4">
          <ChartCard
            title={expandedChartTitle || 'Chart'}
            subtitle="Detailed analytical breakdown"
            type="line"
            data={CHART_DATA_TRENDS}
            dataKeys={[
              { key: 'Sales', color: '#0099FF', label: 'Sales ($)' },
              { key: 'CleanRecords', color: '#10B981', label: 'Clean Records' },
            ]}
            height={400}
          />
        </div>
      </Modal>
    </div>
  );
};
