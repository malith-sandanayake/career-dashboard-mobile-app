import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Smartphone } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, loading, error } = useAuth();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background text-body-text">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm flex flex-col items-center text-center space-y-8"
      >
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-neon-cyan/30 rounded-full" />
          <div className="relative w-24 h-24 rounded-2xl bg-surface border-2 border-neon-cyan/20 flex items-center justify-center rotate-45 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
            <Shield size={40} className={cn("text-neon-cyan -rotate-45", loading && "animate-pulse")} />
          </div>
        </div>

        <div>
          <h1 className="font-mono text-[10px] tracking-[3.5px] text-neon-cyan uppercase mb-4">Academic Command Center</h1>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <span className="text-6xl font-mono font-bold text-body-text cyan-glow tracking-tighter">
              {loading ? 'BUSY' : 'INIT'}
            </span>
          </motion.div>
          {error ? (
             <div className="p-3 bg-neon-red/10 border border-neon-red/30 rounded-lg mb-4">
               <p className="text-[10px] text-neon-red uppercase font-mono leading-tight">{error}</p>
             </div>
          ) : (
            <p className="text-muted-text text-[11px] mt-4 leading-relaxed uppercase font-bold tracking-widest opacity-60">
              Biometric Linkage Required
            </p>
          )}
        </div>

        <div className="w-full pt-8 space-y-4">
          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className={cn(
              "w-full p-4 text-black font-bold uppercase tracking-widest rounded-xl flex items-center justify-center space-x-3 transition-all",
              loading ? "bg-muted-text/30 cursor-not-allowed opacity-50" : "bg-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.4)] active:scale-95"
            )}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            )}
            <span>{loading ? 'Establishing Link...' : 'Access Terminal'}</span>
          </button>

          <p className="text-[10px] text-muted-text uppercase tracking-widest flex items-center justify-center space-x-2">
            <Smartphone size={10} />
            <span>Optimized for Galaxy A55</span>
          </p>
        </div>

        <div className="pt-12 text-[9px] text-muted-text opacity-40 uppercase tracking-tighter">
          Secure Biometric Loop Active • End-to-End Encryption Enabled
        </div>
      </motion.div>
    </div>
  );
};
