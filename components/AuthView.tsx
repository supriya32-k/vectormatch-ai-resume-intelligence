
import React, { useState } from 'react';
import { login, signup } from '../services/persistenceService';
import { User } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Using a micro-timeout just to allow the UI to show a "click" state
    // but the actual logic is now 100% local and instant.
    try {
      const user = isLogin 
        ? await login(email, password) 
        : await signup(name, email, password);
      
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Access denied.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-in fade-in zoom-in-95 duration-200">
      <div className="glass-morphism p-10 rounded-[2.5rem] shadow-2xl border border-white">
        <div className="text-center mb-10 space-y-2">
          <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 text-sm">Instant access to AI career intelligence.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white/50"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white/50"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Security Password</label>
            <input
              type="password"
              required
              className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold animate-shake text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </span>
            ) : (isLogin ? 'Sign In' : 'Instant Sign Up')}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all"
          >
            {isLogin ? "No account? Join instantly" : "Have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
