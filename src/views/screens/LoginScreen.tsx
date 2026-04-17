import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { Shield, Smartphone } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-white">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm flex flex-col items-center text-center space-y-8"
      >
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-neon-cyan/30 rounded-full" />
          <div className="relative w-24 h-24 rounded-2xl bg-surface border-2 border-neon-cyan/20 flex items-center justify-center rotate-45 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
            <Shield size={40} className="text-neon-cyan -rotate-45" />
          </div>
        </div>

        <div>
          <h1 className="font-mono text-[10px] tracking-[3.5px] text-neon-cyan uppercase mb-4">Academic Command Center</h1>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <span className="text-6xl font-mono font-bold text-white cyan-glow tracking-tighter">INIT</span>
          </motion.div>
          <p className="text-muted-text text-[11px] mt-4 leading-relaxed uppercase font-bold tracking-widest opacity-60">
            Biometric Linkage Required
          </p>
        </div>

        <div className="w-full pt-8 space-y-4">
          <button
            onClick={loginWithGoogle}
            className="w-full p-4 bg-neon-cyan text-black font-bold uppercase tracking-widest rounded-xl flex items-center justify-center space-x-3 shadow-[0_0_20px_rgba(0,255,255,0.4)] active:scale-95 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>Access Terminal</span>
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
