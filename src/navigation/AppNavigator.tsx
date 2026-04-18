import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardScreen } from '../views/screens/DashboardScreen';
import { CurriculumScreen } from '../views/screens/CurriculumScreen';
import { SettingsScreen } from '../views/screens/SettingsScreen';
import { LoginScreen } from '../views/screens/LoginScreen';
import { Layout, List, Settings, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = 'An unexpected error occurred.';
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error) errorMessage = `System Error: ${parsed.error}`;
      } catch {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="text-neon-red mb-4" size={48} />
          <h2 className="text-white font-mono text-xl mb-2 uppercase">Command Fail</h2>
          <p className="text-muted-text text-sm mb-6 max-w-xs">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-neon-cyan text-black font-bold uppercase text-xs rounded-lg"
          >
            Reboot Terminal
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const tabs = [
    { title: 'Dashboard', path: '/dashboard', icon: Layout },
    { title: 'Curriculum', path: '/curriculum', icon: List },
    { title: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-screen sm:h-[720px] w-full sm:max-w-[380px] bg-background overflow-hidden mx-auto sm:border-[8px] sm:border-border-accent sm:rounded-[40px] relative sm:shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_2px_#00FFFF] sm:my-8 shadow-none border-none rounded-none">
      {/* Simulated Status Bar */}
      <div className="h-11 flex justify-between items-center px-6 text-[10px] text-muted-text font-mono z-50 pointer-events-none">
        <span className="tracking-widest capitalize">E23-CMD</span>
        <span className="tracking-tighter">120Hz | 09:41</span>
      </div>

      <div className="flex-1 overflow-y-auto w-full pb-20 no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 h-[70px] bg-background border-t border-border-accent flex items-center justify-around px-4 pb-2 z-40">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center justify-center space-y-1 relative group py-2 flex-1"
            >
              <div className={clsx(
                "transition-all duration-300 flex items-center justify-center w-5 h-5 border-[1.5px] rounded border-current p-0.5",
                isActive ? "text-neon-cyan bg-neon-cyan/15" : "text-muted-text hover:text-white"
              )}>
                <tab.icon size={12} strokeWidth={2.5} />
              </div>
              <span className={clsx(
                "text-[9px] font-bold uppercase tracking-tight transition-all",
                isActive ? "text-neon-cyan opacity-100" : "text-muted-text opacity-50"
              )}>
                {tab.title.slice(0, 4)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/dashboard" />} />

          {user ? (
            <Route path="/*" element={<AppLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardScreen />} />
                <Route path="curriculum" element={<CurriculumScreen />} />
                <Route path="settings" element={<SettingsScreen />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </AppLayout>} />
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
