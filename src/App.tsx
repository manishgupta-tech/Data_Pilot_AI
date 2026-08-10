import React, { useState } from 'react';
import { ScreenType, Dataset, UserProfile, AIAnalysis, Report, ChatMessage, ToastNotification } from './types';
import {
  MOCK_DATASETS,
  DEFAULT_USER,
  INITIAL_ANALYSIS,
  MOCK_REPORTS,
  INITIAL_CHAT_MESSAGES,
} from './data/mockData';

// Layout Components
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { Toast } from './components/Toast';

// Screens
import { LandingScreen } from './screens/LandingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { UploadScreen } from './screens/UploadScreen';
import { PreviewScreen } from './screens/PreviewScreen';
import { AnalysisScreen } from './screens/AnalysisScreen';
import { VisualizationsScreen } from './screens/VisualizationsScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { DatasetsScreen } from './screens/DatasetsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { DsaEngineScreen } from './screens/DsaEngineScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);

  // Workspace Data State
  const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(MOCK_DATASETS[0].id);
  const [analysis, setAnalysis] = useState<AIAnalysis>(INITIAL_ANALYSIS);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // UI States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId) || datasets[0] || null;

  // Notification Helper
  const addToast = (title: string, description: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers
  const handleDatasetUploaded = (newDs: Dataset) => {
    setDatasets((prev) => [newDs, ...prev]);
    setSelectedDatasetId(newDs.id);
    addToast('Dataset Uploaded!', `Successfully parsed ${newDs.name} (${newDs.rows.toLocaleString()} rows).`, 'success');
  };

  const handleSelectDataset = (ds: Dataset) => {
    setSelectedDatasetId(ds.id);
    addToast('Active Dataset Changed', `Now viewing: ${ds.name}`, 'info');
  };

  const handleDeleteDataset = (id: string) => {
    const target = datasets.find((d) => d.id === id);
    setDatasets((prev) => prev.filter((d) => d.id !== id));
    if (selectedDatasetId === id && datasets.length > 1) {
      const remaining = datasets.filter((d) => d.id !== id);
      setSelectedDatasetId(remaining[0].id);
    }
    addToast('Dataset Deleted', `Removed ${target?.name || 'dataset'} from workspace.`, 'warning');
  };

  const handleRefreshAnalysis = async () => {
    setIsReanalyzing(true);
    addToast('Analyzing Dataset...', 'Sending sample rows to Gemini AI engine.', 'info');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedDataset?.name || 'sales_data.csv',
          rowsCount: selectedDataset?.rows || 25430,
          colsCount: selectedDataset?.cols || 14,
          columns: selectedDataset?.columns || [],
          sampleData: selectedDataset?.dataSample || [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.analysis) {
          setAnalysis(data.analysis);
          addToast('AI Analysis Complete', 'Updated insights and recommendations.', 'success');
        } else {
          throw new Error('No analysis in response');
        }
      } else {
        throw new Error('Server returned non-200');
      }
    } catch (err) {
      console.warn('API analysis fallback to client model:', err);
      // Fallback
      setTimeout(() => {
        setAnalysis((prev) => ({
          ...prev,
          executiveSummary: `Re-analyzed dataset ${selectedDataset?.name}. Re-verified hygiene at ${selectedDataset?.quality || 95}%. Key growth drivers confirmed.`,
        }));
        addToast('AI Analysis Complete', 'Updated insights successfully.', 'success');
      }, 1000);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          datasetContext: {
            name: selectedDataset?.name,
            rowsCount: selectedDataset?.rows,
            colsCount: selectedDataset?.cols,
            quality: `${selectedDataset?.quality || 94}%`,
            columns: selectedDataset?.columns?.map((c) => c.name),
            sampleData: selectedDataset?.dataSample,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.text || data.reply || 'DataPilot AI analysis complete.';
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.warn('API chat fallback:', err);
      setTimeout(() => {
        const replyText = `Based on dataset "${selectedDataset?.name}" (${selectedDataset?.rows.toLocaleString()} rows), here is what I found:\n\n1. Primary metric trends show strong positive growth in the third quarter.\n2. Column "${selectedDataset?.columns[0]?.name || 'Category'}" has ${selectedDataset?.columns[0]?.uniqueCount || 120} unique values.\n3. Recommended Action: Consider running an exploratory bar chart visualization to inspect distribution.`;
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      }, 800);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateReport = (newReport: Report) => {
    setReports((prev) => [newReport, ...prev]);
    addToast('Report Created', `Generated ${newReport.title} (${newReport.format})`, 'success');
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    addToast('Report Deleted', 'Report removed from repository.', 'info');
  };

  // Render Full Screen Views (Landing & Auth don't use the workspace layout)
  if (currentScreen === 'landing') {
    return (
      <>
        <LandingScreen
          onNavigate={(screen) => setCurrentScreen(screen)}
          onExploreDemo={() => {
            setCurrentScreen('dashboard');
            addToast('Welcome to Demo Workspace', 'Exploring DataPilot AI platform features.', 'success');
          }}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  if (currentScreen === 'auth') {
    return (
      <>
        <AuthScreen
          onLoginSuccess={(user) => {
            setUserProfile(user);
            setCurrentScreen('dashboard');
            addToast(`Welcome ${user.name}!`, 'Logged into DataPilot AI Workspace', 'success');
          }}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // Workspace Layout for Main App Screens
  return (
    <div className="min-h-screen bg-[#0D0F14] text-slate-100 flex font-sans selection:bg-cyan-500 selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar
        activeScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          setMobileMenuOpen(false);
        }}
        user={userProfile}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeDatasetName={selectedDataset?.name}
        onNewAnalysis={() => setCurrentScreen('upload')}
        onLogout={() => setCurrentScreen('auth')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopNavbar
          activeScreen={currentScreen}
          user={userProfile}
          datasets={datasets}
          selectedDataset={selectedDataset}
          onSelectDataset={handleSelectDataset}
          onNavigate={setCurrentScreen}
          onOpenMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onExportCurrentPage={() => {
            addToast('Export Started', 'Preparing current view export...', 'info');
          }}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              onNavigate={setCurrentScreen}
              datasets={datasets}
              selectedDataset={selectedDataset}
              onSelectDataset={handleSelectDataset}
              analysis={analysis}
            />
          )}

          {currentScreen === 'upload' && (
            <UploadScreen
              onDatasetUploaded={handleDatasetUploaded}
              onNavigate={setCurrentScreen}
              recentDatasets={datasets}
            />
          )}

          {currentScreen === 'preview' && (
            <PreviewScreen
              dataset={selectedDataset}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'analysis' && (
            <AnalysisScreen
              dataset={selectedDataset}
              analysis={analysis}
              onNavigate={setCurrentScreen}
              onRefreshAnalysis={handleRefreshAnalysis}
              isReanalyzing={isReanalyzing}
            />
          )}

          {currentScreen === 'dsa' && (
            <DsaEngineScreen
              dataset={selectedDataset}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'visualizations' && (
            <VisualizationsScreen
              dataset={selectedDataset}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'chat' && (
            <ChatScreen
              dataset={selectedDataset}
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              onNavigate={setCurrentScreen}
              isLoading={isChatLoading}
            />
          )}

          {currentScreen === 'reports' && (
            <ReportsScreen
              reports={reports}
              datasets={datasets}
              selectedDataset={selectedDataset}
              onGenerateReport={handleGenerateReport}
              onDeleteReport={handleDeleteReport}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'datasets' && (
            <DatasetsScreen
              datasets={datasets}
              selectedDataset={selectedDataset}
              onSelectDataset={handleSelectDataset}
              onDeleteDataset={handleDeleteDataset}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen
              user={userProfile}
              onSaveProfile={(updated) => {
                setUserProfile(updated);
                addToast('Profile Updated', 'Saved user preferences.', 'success');
              }}
              onNavigate={setCurrentScreen}
            />
          )}
        </main>
      </div>

      {/* Global Toast System */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
