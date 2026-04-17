import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGrades } from '../../context/GradeContext';
import { LogOut, User, Shield, Moon, Trash2, Smartphone } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { targetGPA, setTargetGPA, resetAll } = useGrades();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your grades? This cannot be undone.')) {
      resetAll();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Profile Section */}
      <div className="glass-card stat-card-glow p-6 border-border-accent">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-12 h-12 rounded-full scale-95" referrerPolicy="no-referrer" />
            ) : (
              <User size={24} className="text-neon-cyan" />
            )}
          </div>
          <div>
            <h2 className="text-md font-bold text-white tracking-tight">{user?.displayName || 'Engineer'}</h2>
            <p className="text-[10px] text-muted-text uppercase tracking-[2px] font-mono">{user?.uid.slice(0, 8)}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-white/5">
          <p className="text-[9px] text-muted-text uppercase font-bold mb-2 tracking-widest">Device Integrity</p>
          <div className="flex items-center justify-between text-[10px] text-body-text font-mono">
            <span className="opacity-60">MODEL_A55_PRO</span>
            <span className="text-neon-cyan">ENCRYPTED</span>
          </div>
        </div>
      </div>

      {/* Academic Targets */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-muted-text uppercase tracking-wider pl-1 font-mono">Mission Parameters</h3>
        <div className="glass-card p-4 space-y-4 border-white/5">
           <div className="flex justify-between items-center">
             <div>
               <p className="text-sm font-bold text-white">Target CGPA</p>
               <p className="text-xs text-muted-text">Used for predictive analysis</p>
             </div>
             <div className="flex space-x-2">
               {[3.3, 3.5, 3.7, 4.0].map(val => (
                 <button
                    key={val}
                    onClick={() => setTargetGPA(val)}
                    className={cn(
                      "px-3 py-1 rounded-lg font-mono text-xs border transition-all",
                      targetGPA === val ? "bg-neon-cyan text-black border-neon-cyan" : "bg-black border-white/10 text-body-text"
                    )}
                 >
                   {val.toFixed(1)}
                 </button>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* App Prefs */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-muted-text uppercase tracking-wider pl-1 font-mono">Interface</h3>
        <div className="glass-card divide-y divide-white/5 border-white/5 overflow-hidden">
           <div className="p-4 flex justify-between items-center">
             <div className="flex items-center space-x-3">
               <Moon size={18} className="text-muted-text" />
               <span className="text-sm text-white">Dark Mode (Default)</span>
             </div>
             <div className="w-10 h-6 bg-neon-cyan rounded-full flex items-center justify-end px-1">
               <div className="w-4 h-4 bg-black rounded-full shadow" />
             </div>
           </div>
           <div className="p-4 flex justify-between items-center">
             <div className="flex items-center space-x-3">
               <Shield size={18} className="text-muted-text" />
               <span className="text-sm text-white">Strict Bio-Sign Guard</span>
             </div>
             <div className="w-10 h-6 bg-white/10 rounded-full flex items-center justify-start px-1">
               <div className="w-4 h-4 bg-muted-text rounded-full shadow" />
             </div>
           </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 space-y-4">
        <button
          onClick={handleReset}
          className="w-full p-4 rounded-xl border border-neon-red/20 bg-neon-red/5 flex items-center justify-center space-x-2 active:bg-neon-red/10 transition-colors"
        >
          <Trash2 size={18} className="text-neon-red" />
          <span className="text-sm font-bold text-neon-red uppercase font-mono">Purge Data Storage</span>
        </button>

        <button
          onClick={logout}
          className="w-full p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center space-x-2 active:bg-white/10 transition-colors"
        >
          <LogOut size={18} className="text-white" />
          <span className="text-sm font-bold text-white uppercase font-mono">Sign Out</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-[10px] text-muted-text uppercase tracking-widest">UoP Engineer Command Center</p>
        <p className="text-[8px] text-muted-text mt-1 opacity-50">Build 2026.04.17 • Ver 1.0.4-alpha</p>
      </div>
    </div>
  );
};
