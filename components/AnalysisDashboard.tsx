
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalysisDashboardProps {
  result: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'prep'>('analysis');
  
  const chartData = [
    { name: 'Match', value: result.matchPercentage },
    { name: 'Gap', value: 100 - result.matchPercentage }
  ];

  const COLORS = ['#4f46e5', '#e2e8f0'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('analysis')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'analysis' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Comprehensive Analysis
        </button>
        <button 
          onClick={() => setActiveTab('prep')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'prep' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Interview Prep
        </button>
      </div>

      {activeTab === 'analysis' ? (
        <>
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 glass-morphism p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Overall Fit</h3>
              <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-1">
                  <span className="text-4xl font-bold text-slate-800">{result.matchPercentage}%</span>
                </div>
              </div>
              <p className="text-slate-600 font-medium mt-2">{result.jobTitleMatch}</p>
            </div>

            <div className="md:col-span-2 glass-morphism p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Executive Summary</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {result.overallSummary}
              </p>
              <div className="flex gap-4 mt-4">
                <div className="bg-slate-50 p-4 rounded-2xl flex-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Experience Match</span>
                  <p className={`text-xl font-bold ${result.experienceMatch === 'High' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {result.experienceMatch}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl flex-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Action Items</span>
                  <p className="text-xl font-bold text-indigo-600">
                    {result.actionableRecommendations.length} Tasks
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-morphism p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-emerald-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Matching Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.topSkillsFound.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-morphism p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-rose-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Missing Gaps
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingCriticalSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold border border-rose-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Feedback */}
          <div className="glass-morphism p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Strategic Improvement Plan</h3>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Action Items</h4>
              <ul className="space-y-3">
                {result.actionableRecommendations.map((rec, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <p className="text-slate-700 text-sm pt-0.5">{rec}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Optimized Bullet Point Suggestions</h4>
              <div className="grid grid-cols-1 gap-4">
                {result.suggestedBulletPoints.map((bullet, i) => (
                  <div key={i} className="bg-white/50 border border-indigo-100 p-4 rounded-2xl italic text-slate-600 text-sm leading-relaxed">
                    "{bullet}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="glass-morphism p-8 rounded-3xl space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">Master Your <span className="text-indigo-600">Interview.</span></h3>
              <p className="text-slate-500 text-sm">Tailored questions based on your specific skills and the role requirements.</p>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                Technical Deep Dive
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {result.interviewPrep.technicalQuestions.map((q, i) => (
                  <div key={i} className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl space-y-3">
                    <p className="font-bold text-slate-800">Q: {q.question}</p>
                    <div className="bg-white p-4 rounded-xl text-sm text-slate-600 border border-slate-100">
                      <span className="font-bold text-indigo-600 text-[10px] uppercase block mb-1">Target Answer Key</span>
                      {q.targetAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Behavioral Strategy
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {result.interviewPrep.behavioralQuestions.map((q, i) => (
                  <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm">
                    <p className="font-bold text-slate-800">Q: {q.question}</p>
                    <div className="flex gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-amber-100 text-amber-600 rounded flex items-center justify-center text-[10px] font-black">TIP</span>
                      <p className="text-sm text-slate-500 italic">{q.strategy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
