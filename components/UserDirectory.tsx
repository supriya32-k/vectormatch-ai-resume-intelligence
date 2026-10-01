
import React, { useState, useEffect } from 'react';
import { getAllUsers, seedDatabase } from '../services/persistenceService';

interface ProfileModalProps {
  user: any;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-40 bg-indigo-600 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div className="px-10 pb-12 -mt-16 relative z-10">
          <div className="flex items-end gap-6 mb-8">
            <div className="w-32 h-32 bg-white p-2 rounded-[2.5rem] shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-inner">
                {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)}
              </div>
            </div>
            <div className="pb-4">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{user.name}</h3>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-50 text-indigo-600 font-bold uppercase tracking-widest text-[10px] px-2 py-1 rounded-md">{user.role || 'System Member'}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Professional Profile
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                  "{user.bio || 'Enterprise recruitment specialist leveraging AI-driven matching algorithms to optimize talent pipelines.'}"
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connectivity</h4>
                <p className="text-slate-800 font-bold text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{user.email}</p>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 space-y-6">
              <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest text-center">AI Performance Index</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm text-center border border-indigo-100/50">
                  <p className="text-2xl font-black text-indigo-600">{user.stats?.scans || 12}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Resumes Audited</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm text-center border border-indigo-100/50">
                  <p className="text-2xl font-black text-emerald-600">{(user.stats?.accuracy || 92)}%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Match Precision</p>
                </div>
              </div>
              <div className="pt-2 border-t border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-400 text-center uppercase tracking-tighter">Account Created: {new Date(user.joinedAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDirectory: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    const init = async () => {
      let data = await getAllUsers();
      // Automatic seed if directory is empty
      if (data.length === 0) {
        data = await seedDatabase();
      }
      
      // Simulate real-time presence
      const enrichedData = data.map((u: any, idx: number) => ({
        ...u,
        status: idx % 3 === 0 ? 'online' : (idx % 3 === 1 ? 'away' : 'offline'),
        lastSeen: idx % 3 === 0 ? 'Active Now' : (idx % 3 === 1 ? '5m ago' : '2h ago')
      }));

      setUsers(enrichedData);
      setLoading(false);
    };
    init();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    const data = await getAllUsers();
    const enrichedData = data.map((u: any, idx: number) => ({
      ...u,
      status: Math.random() > 0.4 ? 'online' : 'away',
      lastSeen: Math.random() > 0.4 ? 'Active Now' : '10m ago'
    }));
    setUsers(enrichedData);
    setTimeout(() => setLoading(false), 600);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const colors = [
    'from-indigo-500 to-indigo-600', 
    'from-emerald-500 to-emerald-600', 
    'from-rose-500 to-rose-600', 
    'from-amber-500 to-amber-600', 
    'from-purple-500 to-purple-600'
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-800 tracking-tight">Team <span className="text-indigo-600">Sync.</span></h2>
          <p className="text-slate-500 font-medium max-w-md">The system automatically displays all active personnel and system administrators.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={handleRefresh}
            className="px-8 py-4 border-2 border-slate-100 text-slate-600 hover:bg-slate-50 transition-all rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 active:scale-95"
          >
            <svg className={`${loading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Refresh Feed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user, idx) => (
            <div key={user.id} className="group bg-white p-8 rounded-[3rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter ${user.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                   <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                   {user.status === 'online' ? 'Live' : 'Away'}
                </div>
              </div>
              
              <div className="flex items-center gap-5 mb-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${colors[idx % colors.length]} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-black text-slate-800 truncate leading-tight">{user.name}</h4>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">{user.role || 'Member'}</p>
                </div>
              </div>
              
              <div className="space-y-5 pt-8 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= (idx % 3 + 3) ? 'bg-indigo-400' : 'bg-slate-100'}`}></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Presence</span>
                  <span className="text-[10px] font-black text-slate-600 uppercase">
                    {user.lastSeen}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedUser(user)}
                className="w-full mt-10 py-5 rounded-[1.5rem] bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.25em] hover:bg-indigo-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <ProfileModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default UserDirectory;
