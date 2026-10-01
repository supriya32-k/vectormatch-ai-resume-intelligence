
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Screener from './components/Screener';
import JDGenerator from './components/JDGenerator';
import HistoryView from './components/HistoryView';
import UserDirectory from './components/UserDirectory';
import AnalysisDashboard from './components/AnalysisDashboard';
import AuthView from './components/AuthView';
import { View, SavedAnalysis, User } from './types';
import { exportAnalysis } from './services/exportService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SavedAnalysis | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('vm_auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('vm_auth_user');
      }
    }
  }, []);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setCurrentView(View.SCREENER);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(View.HOME);
  };

  const navigateTo = (view: View) => {
    setSelectedHistoryItem(null);
    setCurrentView(view);
  };

  const renderView = () => {
    if (selectedHistoryItem) {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <button 
            onClick={() => setSelectedHistoryItem(null)}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Audit History
          </button>
          <div className="p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Archived Intelligence Report</p>
              <h3 className="text-xl font-bold text-slate-800">{selectedHistoryItem.fileName}</h3>
              <p className="text-xs text-slate-400 font-medium">Synced on {new Date(selectedHistoryItem.timestamp).toLocaleString()}</p>
            </div>
            <div className="relative w-full md:w-auto text-right">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
              >
                Export Report
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100 text-left">
                    <button 
                      onClick={() => {
                        exportAnalysis(selectedHistoryItem.fileName, selectedHistoryItem.result, 'md');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                      Export as Markdown (.md)
                    </button>
                    <button 
                      onClick={() => {
                        exportAnalysis(selectedHistoryItem.fileName, selectedHistoryItem.result, 'json');
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>
                      Export as JSON (.json)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <AnalysisDashboard result={selectedHistoryItem.result} />
        </div>
      );
    }

    switch (currentView) {
      case View.HOME:
        return <LandingPage onGetStarted={() => user ? navigateTo(View.SCREENER) : navigateTo(View.AUTH)} />;
      case View.AUTH:
        return <AuthView onAuthSuccess={handleAuthSuccess} />;
      case View.SCREENER:
        return user ? <Screener /> : <AuthView onAuthSuccess={handleAuthSuccess} />;
      case View.TEAM:
        return user ? <UserDirectory /> : <AuthView onAuthSuccess={handleAuthSuccess} />;
      case View.JD_GEN:
        return user ? <JDGenerator /> : <AuthView onAuthSuccess={handleAuthSuccess} />;
      case View.HISTORY:
        return user ? <HistoryView onViewDetails={setSelectedHistoryItem} /> : <AuthView onAuthSuccess={handleAuthSuccess} />;
      default:
        return <LandingPage onGetStarted={() => navigateTo(View.SCREENER)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Header 
        currentView={currentView} 
        setView={navigateTo} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-5xl">
        {renderView()}
      </main>

      <footer className="py-12 px-4 border-t border-slate-200 mt-20 bg-white/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 opacity-50">
          <div className="flex items-center gap-3 grayscale">
            <div className="bg-slate-800 p-2 rounded-lg text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <span className="font-black text-slate-800 text-sm tracking-tight uppercase">VectorMatch AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <button onClick={() => navigateTo(View.HOME)} className="hover:text-indigo-600 transition-colors">Overview</button>
            <button className="hover:text-indigo-600 transition-colors">Global Privacy</button>
            <button className="hover:text-indigo-600 transition-colors">Status: Operational</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
