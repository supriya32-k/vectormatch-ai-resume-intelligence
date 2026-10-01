
import React from 'react';
import { View, User } from '../types';
import { logout } from '../services/persistenceService';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, user, onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <header className="py-6 px-4 md:px-8 flex items-center justify-between glass-morphism sticky top-0 z-50 shadow-sm">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setView(View.HOME)}
      >
        <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">VectorMatch <span className="text-indigo-600">AI</span></h1>
          <p className="text-xs text-slate-500 font-medium">Professional Candidate Vetting</p>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => setView(View.HOME)}
          className={`text-sm font-semibold transition-colors ${currentView === View.HOME ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
        >
          Home
        </button>
        {user && (
          <>
            <button 
              onClick={() => setView(View.TEAM)}
              className={`text-sm font-semibold transition-colors ${currentView === View.TEAM ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Team
            </button>
            <button 
              onClick={() => setView(View.JD_GEN)}
              className={`text-sm font-semibold transition-colors ${currentView === View.JD_GEN ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              JD Generator
            </button>
            <button 
              onClick={() => setView(View.HISTORY)}
              className={`text-sm font-semibold transition-colors ${currentView === View.HISTORY ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              History
            </button>
          </>
        )}

        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-none">{user.name}</p>
              <button onClick={handleLogout} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest">Sign Out</button>
            </div>
            <button 
              onClick={() => setView(View.SCREENER)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              Analyze
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setView(View.AUTH)}
            className="bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-900 transition-all shadow-lg active:scale-95"
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
