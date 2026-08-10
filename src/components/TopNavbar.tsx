import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Download,
  Layers,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { ScreenType, Dataset, UserProfile } from '../types';

interface TopNavbarProps {
  activeScreen: ScreenType;
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  onSelectDataset: (dataset: Dataset) => void;
  onOpenMobileMenu: () => void;
  user: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onExportCurrentPage: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeScreen,
  datasets,
  selectedDataset,
  onSelectDataset,
  onOpenMobileMenu,
  user,
  onNavigate,
  onExportCurrentPage,
}) => {
  const [datasetDropdownOpen, setDatasetDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getScreenTitle = (screen: ScreenType) => {
    switch (screen) {
      case 'landing':
        return 'Product Overview';
      case 'auth':
        return 'Account Authentication';
      case 'dashboard':
        return 'Analytics Dashboard';
      case 'upload':
        return 'Upload Dataset';
      case 'preview':
        return 'Dataset Table Preview';
      case 'analysis':
        return 'AI Analysis Workspace';
      case 'visualizations':
        return 'Visualizations Canvas';
      case 'chat':
        return 'AI Data Analyst Chat';
      case 'reports':
        return 'Report Management';
      case 'datasets':
        return 'My Datasets';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'DataPilot AI';
    }
  };

  const notifications = [
    {
      id: 'n1',
      title: 'AI Analysis Complete',
      desc: 'sales_data.csv analyzed with 10 new insights.',
      time: '10 min ago',
      type: 'success',
    },
    {
      id: 'n2',
      title: 'Anomaly Detected',
      desc: '14 high-value revenue spikes found in sales batch.',
      time: '1 hour ago',
      type: 'warning',
    },
    {
      id: 'n3',
      title: 'Report Generated',
      desc: 'Q2 Sales & Revenue PDF report ready for download.',
      time: '2 hours ago',
      type: 'info',
    },
  ];

  return (
    <header className="h-16 bg-[#12141A]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm md:text-base font-bold text-white tracking-tight font-sans flex items-center gap-2">
            {getScreenTitle(activeScreen)}
            {activeScreen === 'analysis' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Live
              </span>
            )}
          </h2>
          <p className="hidden md:block text-[11px] text-slate-400 font-medium">DataPilot AI Decision Engine</p>
        </div>
      </div>

      {/* Middle: Dataset Selector */}
      <div className="relative">
        <button
          onClick={() => setDatasetDropdownOpen(!datasetDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-slate-200 transition-colors shadow-inner"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="max-w-[120px] md:max-w-[180px] truncate">{selectedDataset ? selectedDataset.name : 'Select Dataset'}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {datasetDropdownOpen && (
          <div className="absolute right-0 md:left-0 mt-2 w-64 bg-[#181B22] border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Workspace Datasets</div>
            <div className="space-y-1 my-1 max-h-56 overflow-y-auto">
              {datasets.map((ds) => (
                <button
                  key={ds.id}
                  onClick={() => {
                    onSelectDataset(ds);
                    setDatasetDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-colors text-left ${
                    selectedDataset?.id === ds.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{ds.name}</span>
                  <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">{ds.rows.toLocaleString()} rows</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                onNavigate('upload');
                setDatasetDropdownOpen(false);
              }}
              className="w-full mt-1 pt-1.5 border-t border-white/10 text-center text-xs text-cyan-400 hover:text-cyan-300 font-semibold py-1 transition-colors"
            >
              + Upload New Dataset
            </button>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Search */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 w-44 focus-within:w-60 focus-within:border-cyan-500/50 transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search insights..." className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-slate-500" />
        </div>

        {/* Quick Export Button */}
        <button
          onClick={onExportCurrentPage}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 font-medium transition-colors"
          title="Export analysis & reports"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#12141A]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#181B22] border border-white/15 rounded-2xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-cyan-400 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors flex items-start gap-2.5">
                    {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                    {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                    {n.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-xs font-semibold text-white">{n.title}</p>
                      <p className="text-[11px] text-slate-400">{n.desc}</p>
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center gap-2 p-1 rounded-full hover:ring-2 ring-cyan-500/50 transition-all">
            <img src={user?.avatarUrl || ''} alt={user?.name || 'User'} className="w-7 h-7 rounded-full object-cover border border-cyan-500/30" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#181B22] border border-white/15 rounded-2xl shadow-2xl p-2 z-50">
              <div className="p-2 border-b border-white/10">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <div className="py-1 space-y-0.5 text-xs">
                <button onClick={() => { onNavigate('settings'); setProfileDropdownOpen(false); }} className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/5 rounded-lg flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Account Settings
                </button>
                <button onClick={() => { onNavigate('auth'); setProfileDropdownOpen(false); }} className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
