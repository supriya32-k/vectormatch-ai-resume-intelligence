
import React from 'react';

const PricingPage: React.FC = () => {
  return (
    <div className="py-12 space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Simple, Transparent <span className="text-indigo-600">Pricing.</span></h2>
        <p className="text-slate-500">Choose the plan that fits your career goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <div className="glass-morphism p-8 rounded-3xl flex flex-col">
          <h3 className="text-xl font-bold text-slate-800">Free</h3>
          <p className="text-slate-500 text-sm mt-2">Get started with basics</p>
          <div className="my-8">
            <span className="text-4xl font-black text-slate-800">$0</span>
            <span className="text-slate-400 text-sm"> /mo</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            {['3 Scans per month', 'Basic Score Card', 'Keyword Match', 'Community Support'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {feat}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 border border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">Choose Free</button>
        </div>

        {/* Pro Plan */}
        <div className="bg-indigo-600 p-8 rounded-3xl flex flex-col text-white shadow-2xl shadow-indigo-200 transform md:scale-105 relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-slate-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</div>
          <h3 className="text-xl font-bold">Professional</h3>
          <p className="text-indigo-100 text-sm mt-2">For serious job seekers</p>
          <div className="my-8">
            <span className="text-4xl font-black">$19</span>
            <span className="text-indigo-200 text-sm"> /mo</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            {['Unlimited Scans', 'Deep AI Rewrite Suggestions', 'Skill Gap Analysis', 'LinkedIn Profile Audit', 'Priority AI Processing'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-indigo-50">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {feat}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg">Start Pro Trial</button>
        </div>

        {/* Enterprise Plan */}
        <div className="glass-morphism p-8 rounded-3xl flex flex-col">
          <h3 className="text-xl font-bold text-slate-800">Recruiter</h3>
          <p className="text-slate-500 text-sm mt-2">Scale your hiring pipeline</p>
          <div className="my-8">
            <span className="text-4xl font-black text-slate-800">$99</span>
            <span className="text-slate-400 text-sm"> /mo</span>
          </div>
          <ul className="space-y-4 mb-10 flex-1">
            {['Bulk Resume Uploads', 'ATS Integration', 'Candidate Comparison', 'Team Collaboration', 'API Access'].map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {feat}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 border border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">Talk to Sales</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
