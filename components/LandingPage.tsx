
import React from 'react';
import { View } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="space-y-32 py-10 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="text-center space-y-10 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-black uppercase tracking-[0.2em] mb-4">
           <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
           Next-Gen Talent Intelligence
        </div>
        <h2 className="text-6xl md:text-8xl font-black text-slate-800 tracking-tight leading-[1.1] mb-8">
          Hiring with <span className="text-indigo-600 italic">Precision.</span>
        </h2>
        <p className="text-slate-500 text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
          The elite standard for resume screening. Analyze candidates, generate roles, and sync with your global team in real-time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto px-16 py-6 bg-indigo-600 text-white font-black rounded-[2rem] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-2 active:scale-95 text-xl tracking-tight"
          >
            Launch Core Audit
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
