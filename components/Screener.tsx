
import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import AnalysisDashboard from './AnalysisDashboard';
import { AppState, ResumeData, AnalysisResult } from '../types';
import { analyzeResume } from '../services/geminiService';
import { saveAnalysis } from '../services/persistenceService';
import { exportAnalysis } from '../services/exportService';

const STAGES = [
  "Initializing Engine...",
  "Parsing Career Path...",
  "Evaluating Skills...",
  "Mapping Gaps...",
  "Finalizing Audit..."
];

const Screener: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    let interval: any;
    if (state === AppState.ANALYZING) {
      interval = setInterval(() => {
        setStageIndex(prev => (prev < STAGES.length - 1 ? prev + 1 : prev));
      }, 800); // Accelerated stage transitions
    } else {
      setStageIndex(0);
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleFileLoaded = (data: ResumeData) => {
    setResumeData(data);
    setError(null);
  };

  const handleStartAnalysis = async () => {
    if (!resumeData || !jobDescription.trim()) {
      setError("Resume and Job requirements are mandatory.");
      return;
    }

    setState(AppState.ANALYZING);
    setError(null);

    try {
      const result = await analyzeResume(resumeData.content, jobDescription);
      await saveAnalysis(resumeData.fileName, jobDescription, result);
      setAnalysis(result);
      setState(AppState.COMPLETED);
    } catch (err: any) {
      setError(err.message || "Audit failed. Check connectivity.");
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setState(AppState.IDLE);
    setResumeData(null);
    setAnalysis(null);
    setJobDescription('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {state !== AppState.COMPLETED ? (
        <div className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              Rapid <span className="text-indigo-600">Resume Audit.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Candidate File</h3>
                <FileUploader onFileLoaded={handleFileLoaded} isLoading={state === AppState.ANALYZING} />
                {resumeData && (
                  <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
                    <div className="bg-indigo-600 p-2 rounded text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-700 truncate">{resumeData.fileName}</p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase">File Verified</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Job Description</h3>
                <textarea
                  placeholder="Paste Job Description here..."
                  className="w-full h-40 p-5 rounded-3xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 resize-none bg-white transition-all outline-none text-sm text-slate-700 font-medium"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={state === AppState.ANALYZING}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 lg:sticky top-32 space-y-8 shadow-2xl shadow-indigo-50/30">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800">Execute Analysis</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Our engine identifies semantic matches and technical gaps in seconds.</p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleStartAnalysis}
                  disabled={state === AppState.ANALYZING || !resumeData || !jobDescription}
                  className={`
                    w-full py-5 rounded-2xl font-black text-lg transition-all
                    ${state === AppState.ANALYZING 
                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-xl shadow-indigo-100'}
                  `}
                >
                  {state === AppState.ANALYZING ? (
                    <div className="flex flex-col items-center">
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                      <span className="text-[10px] uppercase tracking-tighter opacity-50">{STAGES[stageIndex]}</span>
                    </div>
                  ) : 'Audit Candidate Now'}
                </button>
                
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 glass-morphism p-4 rounded-3xl">
            <button onClick={handleReset} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              New Scan
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
              >
                Export
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100">
                    <button 
                      onClick={() => {
                        if (analysis) {
                          exportAnalysis(resumeData?.fileName || 'resume', analysis, 'md');
                        }
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                      Export as Markdown (.md)
                    </button>
                    <button 
                      onClick={() => {
                        if (analysis) {
                          exportAnalysis(resumeData?.fileName || 'resume', analysis, 'json');
                        }
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
          {analysis && <AnalysisDashboard result={analysis} />}
        </div>
      )}
    </div>
  );
};

export default Screener;
