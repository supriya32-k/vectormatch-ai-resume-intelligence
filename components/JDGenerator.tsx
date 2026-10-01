
import React, { useState } from 'react';
import { generateJobDescription } from '../services/geminiService';

const JDGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [reqs, setReqs] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title || !reqs) return;
    setIsLoading(true);
    try {
      const jd = await generateJobDescription(title, company, reqs);
      setResult(jd);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">AI Job <span className="text-indigo-600">Architect.</span></h2>
        <p className="text-slate-500">Draft high-conversion job descriptions in seconds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
            <input 
              className="w-full p-3 rounded-xl border border-slate-200 glass-morphism outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g. Senior Frontend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Name</label>
            <input 
              className="w-full p-3 rounded-xl border border-slate-200 glass-morphism outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g. VectorMatch AI"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Core Requirements</label>
            <textarea 
              className="w-full p-3 h-40 rounded-xl border border-slate-200 glass-morphism outline-none focus:ring-2 focus:ring-indigo-500 resize-none" 
              placeholder="Skills, experience level, culture fit..."
              value={reqs}
              onChange={(e) => setReqs(e.target.value)}
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !title || !reqs}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-all active:scale-95"
          >
            {isLoading ? 'Architecting...' : 'Generate Description'}
          </button>
        </div>

        <div className="md:col-span-2">
          {result ? (
            <div className="glass-morphism p-8 rounded-3xl border border-slate-200 min-h-[500px] relative">
              <div className="absolute top-4 right-4 flex gap-2">
                 <button 
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors shadow-sm"
                  title="Copy to clipboard"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                 </button>
              </div>
              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed font-normal">
                {result}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <p className="font-medium">Output will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JDGenerator;
