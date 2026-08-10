import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Database,
  Sparkles,
  BarChart3,
  MessageSquareCode,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu,
  PlusCircle,
  Layers,
  Workflow,
} from 'lucide-react';
import { ScreenType, UserProfile } from '../types';

interface SidebarProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  user: UserProfile;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeDatasetName?: string;
  onNewAnalysis: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  user,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  activeDatasetName,
  onNewAnalysis,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard' as ScreenType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload' as ScreenType, label: 'Upload Dataset', icon: UploadCloud },
    { id: 'datasets' as ScreenType, label: 'My Datasets', icon: Database },
    { id: 'analysis' as ScreenType, label: 'AI Analysis', icon: Sparkles, badge: 'AI' },
    { id: 'dsa' as ScreenType, label: 'DSA Engine', icon: Workflow, badge: 'Core' },
    { id: 'visualizations' as ScreenType, label: 'Visualizations', icon: BarChart3 },
    { id: 'chat' as ScreenType, label: 'AI Chat', icon: MessageSquareCode, badge: 'Live' },
    { id: 'reports' as ScreenType, label: 'Reports', icon: FileSpreadsheet },
    { id: 'settings' as ScreenType, label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#12141A] text-slate-200 border-r border-white/10 select-none">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div
          onClick={() => {
            onNavigate('dashboard');
            onCloseMobile();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#12141A] rounded-[10px] flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          {(!collapsed || mobileOpen) && (
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide flex items-center gap-1.5 font-sans">
                DataPilot <span className="text-cyan-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">AI</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Data Intelligence</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button (Desktop) */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Action Button */}
      {(!collapsed || mobileOpen) && (
        <div className="p-3">
          <button
            onClick={() => {
              onNewAnalysis();
              onCloseMobile();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload & Analyze</span>
          </button>
        </div>
      )}

      {/* Active Dataset Context Badge */}
      {activeDatasetName && (!collapsed || mobileOpen) && (
        <div className="mx-3 my-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-mono truncate text-[11px]">{activeDatasetName}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all relative group ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}

              {item.badge && (!collapsed || mobileOpen) && (
                <span
                  className={`ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    item.badge === 'AI'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / User Settings */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {(!collapsed || mobileOpen) && (
          <button
            onClick={() => {
              onNavigate('landing');
              onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Landing & Product Tour</span>
          </button>
        )}

        {/* User Card */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={user?.avatarUrl || ''} alt={user?.name || 'User'} className="w-8 h-8 rounded-full object-cover border border-cyan-500/40 shrink-0" />
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-cyan-400 font-mono truncate">{user?.plan}</p>
              </div>
            )}
          </div>

          {(!collapsed || mobileOpen) && (
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block fixed top-0 left-0 z-30 h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
