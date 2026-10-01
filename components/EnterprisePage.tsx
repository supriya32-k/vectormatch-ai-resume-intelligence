
import React from 'react';

const EnterprisePage: React.FC = () => {
  return (
    <div className="py-12 space-y-20 animate-in fade-in slide-in-from-right-4 duration-700">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h2 className="text-5xl font-black text-slate-800 leading-tight">Elite Intelligence for <span className="text-indigo-600">High-Growth Teams.</span></h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Stop manually filtering thousands of candidates. Our enterprise-grade API and platform allow you to instantly rank talent with 99.9% accuracy compared to human experts.
          </p>
          <div className="flex gap-4">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100">Schedule Demo</button>
            <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50">View API Docs</button>
          </div>
        </div>
        <div className="glass-morphism p-1 rounded-3xl shadow-2xl rotate-1">
          <div className="bg-slate-900 rounded-[calc(1.5rem-4px)] p-8 aspect-video flex items-center justify-center text-indigo-400 overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
            <code className="text-sm font-mono whitespace-pre text-indigo-300">
{`{
  "request": "analyze_candidate",
  "data": {
    "resume_id": "8x-921",
    "role": "Senior Engineer",
    "depth": "executive"
  },
  "response": {
    "fit_score": 0.94,
    "top_skill": "Distributed Systems",
    "potential": "High"
  }
}`}
            </code>
          </div>
        </div>
      </section>

      <section className="glass-morphism p-12 rounded-[3rem] text-center space-y-12">
        <h3 className="text-3xl font-bold text-slate-800">Trusted by Global Leaders</h3>
        <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
          <div className="text-2xl font-black tracking-tighter">TECHCORP</div>
          <div className="text-2xl font-black tracking-tighter">FINANCE.IO</div>
          <div className="text-2xl font-black tracking-tighter">CLOUDSTRAT</div>
          <div className="text-2xl font-black tracking-tighter">NEXUSLABS</div>
        </div>
      </section>
    </div>
  );
};

export default EnterprisePage;
