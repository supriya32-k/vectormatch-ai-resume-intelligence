
import React, { useState, useEffect } from 'react';
import { SavedAnalysis } from '../types';
import { getAllHistory, deleteAnalysis } from '../services/persistenceService';

interface HistoryViewProps {
  onViewDetails: (analysis: SavedAnalysis) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onViewDetails }) => {
  const [history, setHistory] = useState<SavedAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    const data = await getAllHistory();
    setHistory(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this record from the cloud?')) {
      try {
        await deleteAnalysis(id);
        await loadHistory();
      } catch (err) {
        alert("Failed to delete record. Check your connection.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 glass-morphism rounded-3xl space-y-4">
        <div className="flex justify-center">
          <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-slate-500 font-medium">Syncing with MongoDB...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20 glass-morphism rounded-3xl space-y-4">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Cloud Archive Empty</h3>
        <p className="text-slate-500 max-w-xs mx-auto">Upload a resume in the Screener section to sync results to your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black text-slate-800">Audit <span className="text-indigo-600">Archive</span></h2>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase border border-emerald-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Connected to Cloud
          </div>
        </div>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{history.length} Records</span>
      </div>

      <div className="glass-morphism rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate/File</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Target Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Match</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                onClick={() => onViewDetails(item)}
              >
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">{item.fileName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{item.result.jobTitleMatch}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full" 
                        style={{ width: `${item.matchPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">{item.matchPercentage}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryView;
