import React from 'react';
import { useGrades } from '../../context/GradeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';
import { CURRICULUM } from '../../data/curriculum';
import { calculateSGPA, getGPAIncludedCreditsCompleted, getTotalGPACredits } from '../../utils/gpaCalculator';
import { Activity, Target, CheckCircle, ListPlus, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const DashboardScreen: React.FC = () => {
  const { cgpa, targetGPA, grades, predictions, currentSemester, setCurrentSemester } = useGrades();

  const completedCredits = getGPAIncludedCreditsCompleted(grades);
  const totalCredits = getTotalGPACredits();
  const progressPercent = Math.min((cgpa / targetGPA) * 100, 100);

  const activePredictions = Object.entries(predictions).filter(([code]) => !grades[code]);
  const failingToReachTarget = activePredictions.some(([_, g]) => g === 'UNREACHABLE');

  return (
    <div className="flex-1 flex flex-col p-5 pb-24 space-y-5 overflow-y-auto no-scrollbar">
      {/* Header Stat */}
      <div className="text-center pt-2">
        <div className="flex justify-center items-center space-x-2 mb-2">
          <h1 className="font-mono text-[10px] tracking-[3px] text-neon-cyan uppercase">Academic Command Center</h1>
          <div className="flex bg-subtle-surface border border-border-accent rounded-md p-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <button
                key={s}
                onClick={() => setCurrentSemester(s)}
                className={cn(
                  "w-5 h-5 flex items-center justify-center text-[8px] font-bold rounded transition-all",
                  currentSemester === s 
                    ? "bg-neon-cyan text-black shadow-[0_0_8px_#00FFFF]" 
                    : "text-muted-text hover:text-body-text"
                )}
              >
                S{s}
              </button>
            ))}
          </div>
        </div>
        <motion.div
           initial={{ scale: 0.95, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="relative inline-block"
        >
          <span className="text-5xl font-mono font-bold text-body-text cyan-glow">{cgpa.toFixed(2)}</span>
        </motion.div>
        
        <div className="w-3/5 h-0.5 bg-border-accent mx-auto mt-4 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,1)] absolute left-0"
          />
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Target"
          value={targetGPA.toFixed(2)}
          valueColor="text-neon-cyan"
        />
        <StatCard
          label="Gap"
          value={(cgpa - targetGPA).toFixed(2)}
          valueColor={cgpa >= targetGPA ? "text-neon-green" : "text-neon-red"}
        />
        <StatCard
          label="Credits"
          value={`${completedCredits} / ${totalCredits}`}
        />
        <StatCard
          label="Modules"
          value={`${CURRICULUM.filter(m => m.gpaIncluded && !grades[m.code]).length} Rem.`}
        />
      </div>

      {/* Predictive Engine Panel */}
      <div className="bg-surface/80 border border-neon-cyan/10 rounded-[20px] p-5 flex-1 min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
          <span className="font-mono text-[11px] text-neon-cyan tracking-wider">PREDICTIVE ENGINE</span>
          <span className="text-[9px] text-muted-text uppercase font-bold opacity-50">S5 IN-PROGRESS</span>
        </div>
        
        <div className="divide-y divide-border-accent">
          {activePredictions.sort(([a], [b]) => {
            const modA = CURRICULUM.find(m => m.code === a);
            const modB = CURRICULUM.find(m => m.code === b);
            if (modA?.semester === currentSemester) return -1;
            if (modB?.semester === currentSemester) return 1;
            return 0;
          }).slice(0, 5).map(([code, g]) => {
            const module = CURRICULUM.find(m => m.code === code);
            const isCurrent = module?.semester === currentSemester;
            return (
              <div key={code} className={cn(
                "flex justify-between items-center py-3 px-2 -mx-2 transition-colors",
                isCurrent ? "bg-neon-cyan/5 border-l-2 border-neon-cyan" : ""
              )}>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[13px] text-body-text tracking-tight font-bold">{code}</span>
                    {isCurrent && <span className="text-[7px] bg-neon-cyan text-black px-1 rounded font-bold">NOW</span>}
                  </div>
                  <span className="text-[10px] text-muted-text truncate max-w-[120px]">{module?.name}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] text-muted-text uppercase mb-0.5">MIN REQ</span>
                  <span className={cn(
                    "font-mono text-sm font-bold",
                    g === 'UNREACHABLE' ? "text-neon-red" : "text-neon-green"
                  )}>{g}</span>
                </div>
              </div>
            );
          })}
          {activePredictions.length === 0 && (
            <p className="text-center py-10 text-xs text-muted-text italic">No modules in progress</p>
          )}
        </div>
      </div>

      {/* Alert Banner */}
      {failingToReachTarget ? (
        <div className="alert-row">
          <span className="font-mono font-bold text-neon-red">[!]</span>
          <span className="text-[11px] text-body-text leading-tight">High workload detected. A grade required in multiple modules to meet First Class.</span>
        </div>
      ) : (
        <div className="bg-neon-green/5 border border-neon-green/20 rounded-xl p-3 flex items-center gap-3">
          <span className="font-mono font-bold text-neon-green">[✓]</span>
          <span className="text-[11px] text-body-text leading-tight">Academic parameters stable. Maintain current trajectory to meet target.</span>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string, valueColor?: string }> = ({ label, value, valueColor = "text-body-text" }) => (
  <div className="glass-card stat-card-glow p-4 flex flex-col items-center text-center">
    <span className="text-[10px] text-muted-text uppercase font-bold tracking-tight mb-1">{label}</span>
    <span className={cn("font-mono text-lg font-bold", valueColor)}>{value}</span>
  </div>
);
