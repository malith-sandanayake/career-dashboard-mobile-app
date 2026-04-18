import React, { useState } from 'react';
import { CURRICULUM } from '../../data/curriculum';
import { useGrades } from '../../context/GradeContext';
import { ChevronDown, ChevronUp, BookOpen, ExternalLink, Youtube, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GRADELIST } from '../../utils/gradeScale';
import { cn } from '../../lib/utils';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#00FFFF', '#00FF88', '#FF003C', '#78716C', '#0E7490'];

const AssessmentChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={5}
            dataKey="percentage"
            nameKey="label"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface)', 
              border: '1px solid var(--border-accent)', 
              borderRadius: '12px', 
              fontSize: '10px',
              color: 'var(--body-text)'
            }}
            itemStyle={{ color: 'var(--neon-cyan)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-[9px] text-muted-text uppercase truncate font-mono">{item.label} ({item.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CurriculumScreen: React.FC = () => {
  const [expandedYear, setExpandedYear] = useState<number | null>(1);
  const [selectedSem, setSelectedSem] = useState<number | null>(null);
  const { grades } = useGrades();

  const years = [1, 2, 3, 4];

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 no-scrollbar">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-body-text">Curriculum</h1>
        {selectedSem && (
           <button 
             onClick={() => setSelectedSem(null)}
             className="text-[10px] font-mono font-bold text-neon-cyan border border-neon-cyan/30 px-2 py-1 rounded hover:bg-neon-cyan/10"
           >
             RESET FILTER
           </button>
        )}
      </div>

      {years.map(year => {
        const yearSems = [(year - 1) * 2 + 1, (year - 1) * 2 + 2];
        const isYearVisible = !selectedSem || yearSems.includes(selectedSem);

        if (!isYearVisible) return null;

        return (
          <div key={year} className="space-y-2">
            <button
              onClick={() => setExpandedYear(expandedYear === year ? null : year)}
              className="w-full flex items-center justify-between p-4 glass-card border-border-accent"
            >
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-body-text font-mono uppercase tracking-[2px]">Year {year}</span>
                <div className="flex space-x-1">
                  {yearSems.map(s => (
                    <button
                      key={s}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSem(selectedSem === s ? null : s);
                        setExpandedYear(year);
                      }}
                      className={cn(
                        "text-[9px] font-mono font-bold w-6 h-6 rounded flex items-center justify-center transition-all",
                        selectedSem === s 
                          ? "bg-neon-cyan text-black" 
                          : "bg-surface text-muted-text border border-border-accent hover:border-neon-cyan/30"
                      )}
                    >
                      S{s}
                    </button>
                  ))}
                </div>
              </div>
              {expandedYear === year ? <ChevronUp size={16} className="text-neon-cyan" /> : <ChevronDown size={16} className="text-muted-text" />}
            </button>

            <AnimatePresence>
              {(expandedYear === year || selectedSem && yearSems.includes(selectedSem)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  {yearSems.map(sem => {
                    if (selectedSem && sem !== selectedSem) return null;

                    const semOffset = sem % 2 === 0 ? 2 : 1;
                    const semModules = CURRICULUM.filter(m => {
                      if (m.code === 'CO4060') {
                        return sem === 7 || sem === 8;
                      }
                      return m.semester === sem;
                    });
                    
                    if (semModules.length === 0) return null;

                    return (
                      <div key={sem} className="pl-2 space-y-2 mt-2">
                        <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-widest px-2 opacity-60">
                          Semester {semOffset} (Full S{sem})
                        </h3>
                        {semModules.map(module => (
                          <ModuleRow key={module.code} module={module} />
                        ))}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Industrial Training */}
      <div className="space-y-2 mt-4">
        <div className="p-4 glass-card border-none bg-subtle-surface">
           <div className="flex justify-between items-center">
             <div>
               <h3 className="text-body-text font-bold">Industrial Training</h3>
               <p className="text-xs text-muted-text">EF4010 • 6 Credits • NON-GPA</p>
             </div>
             <span className="px-2 py-1 bg-subtle-surface border border-border-accent rounded text-[10px] text-body-text">READY</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const ContentTopicRow: React.FC<{ topic: any }> = ({ topic }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-start space-x-3 p-3 bg-subtle-surface rounded-xl border border-border-accent/10 transition-all hover:border-neon-cyan/30 text-left w-full group"
      >
        <div className={cn(
          "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#00FFFF] transition-all",
          isOpen ? "bg-neon-cyan scale-125 shadow-[0_0_12px_#00FFFF]" : "bg-muted-text opacity-40 group-hover:bg-neon-cyan/50"
        )} />
        <div className="flex-1 flex justify-between items-center pr-2">
          <span className={cn(
            "text-[11px] font-bold transition-colors",
            isOpen ? "text-neon-cyan" : "text-body-text"
          )}>
            {topic.title}
          </span>
          <ChevronDown 
            size={12} 
            className={cn(
              "text-muted-text transition-transform duration-300",
              isOpen ? "rotate-180 text-neon-cyan" : ""
            )} 
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-5 pl-4 border-l border-neon-cyan/20 space-y-2 py-1"
          >
            {topic.subtopics.map((sub: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-2 py-1">
                <div className="w-1 h-1 bg-neon-cyan/40 rounded-full" />
                <span className="text-[10px] text-muted-text leading-snug">{sub}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ModuleRow: React.FC<{ module: any }> = ({ module }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { grades, updateGrade, predictions } = useGrades();
  const [localGrade, setLocalGrade] = useState<string | null>(grades[module.code] || null);
  const [isSaving, setIsSaving] = useState(false);
  
  const currentGrade = grades[module.code] || null;
  const prediction = predictions[module.code];

  const handleSave = async () => {
    setIsSaving(true);
    await updateGrade(module.code, localGrade);
    setIsSaving(false);
  };

  return (
    <>
      <motion.div
        layout
        onClick={() => {
          setShowDetails(true);
          setLocalGrade(grades[module.code] || null);
        }}
        className="p-4 glass-card stat-card-glow cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-neon-cyan leading-none">{module.code}</span>
              {!module.gpaIncluded && <span className="text-[8px] px-1 bg-muted-text/20 text-muted-text rounded leading-none">NON-GPA</span>}
            </div>
            <h4 className="text-body-text text-[12px] font-bold leading-tight mt-1">{module.name}</h4>
          </div>
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-[10px] font-mono font-bold px-2 py-0.5 rounded",
              currentGrade ? "text-neon-green" : "text-muted-text"
            )}>
              {currentGrade || 'PENDING'}
            </span>
            <span className="text-[9px] text-muted-text mt-1">{module.credits} CR</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg glass-card rounded-t-3xl p-6 pb-12 border-neon-cyan/20"
            >
              <div className="w-12 h-1.5 bg-muted-text/30 rounded-full mx-auto mb-6" onClick={() => setShowDetails(false)} />

              <div className="max-h-[70vh] overflow-y-auto pr-2 no-scrollbar space-y-8">
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-bold text-neon-cyan">{module.code}</span>
                    {!module.gpaIncluded && <span className="text-[10px] px-2 bg-muted-text/20 text-muted-text rounded">NON-GPA</span>}
                  </div>
                  <h2 className="text-2xl font-bold text-body-text mt-1">{module.name}</h2>
                  <p className="text-muted-text text-xs leading-relaxed opacity-80">{module.aim}</p>
                  <p className="text-muted-text text-[10px] mt-2 uppercase tracking-widest font-mono">Credits: {module.credits} | Semester: {module.semester}</p>
                </div>

                {module.content && (
                  <div>
                    <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-widest mb-3 flex items-center">
                      <div className="w-4 h-[1px] bg-neon-cyan mr-2" />
                      Module Content
                      <span className="ml-2 lowercase opacity-50 italic">(Tap to expand)</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {module.content.map((item: any, idx: number) => (
                        <ContentTopicRow key={idx} topic={item} />
                      ))}
                    </div>
                  </div>
                )}

                {module.assessment && (
                  <div>
                    <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-widest mb-3 flex items-center">
                      <div className="w-4 h-[1px] bg-neon-green mr-2" />
                      Assessment breakdown
                    </h3>
                    <div className="p-4 bg-black/20 rounded-2xl border border-border-accent/10">
                      <AssessmentChart data={module.assessment} />
                    </div>
                  </div>
                )}

                {module.gpaIncluded && (
                  <div className="p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info size={14} className="text-neon-cyan" />
                      <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">Predictive Engine</span>
                    </div>
                    <p className="text-sm text-body-text">
                      Required Grade for Target: <span className={cn(
                        "font-bold font-mono",
                        prediction === 'UNREACHABLE' ? "text-neon-red" : "text-neon-cyan"
                      )}>{prediction || 'N/A'}</span>
                    </p>
                    {prediction === 'UNREACHABLE' && (
                      <p className="text-[10px] text-neon-red mt-1">Target unreachable without improving past grades</p>
                    )}
                    {prediction === 'AHEAD' && (
                      <p className="text-[10px] text-neon-green mt-1">You're ahead of target — aim higher!</p>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-widest mb-3 flex justify-between items-center">
                    <span>Grade Selection</span>
                    {localGrade !== currentGrade && (
                      <span className="text-[9px] text-neon-cyan italic">Unsaved changes</span>
                    )}
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {GRADELIST.map(g => (
                      <button
                        key={g}
                        onClick={() => setLocalGrade(g)}
                        className={cn(
                          "py-2 rounded-lg font-mono font-bold text-sm border transition-all",
                          localGrade === g
                            ? "bg-neon-cyan text-background border-neon-cyan shadow-lg scale-105"
                            : "bg-surface text-body-text border-border-accent hover:border-neon-cyan/50"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                    <button
                      onClick={() => setLocalGrade(null)}
                      className={cn(
                        "col-span-4 py-2 mt-2 rounded-lg font-bold text-xs border transition-all",
                        !localGrade
                          ? "bg-muted-text text-black border-muted-text shadow-inner"
                          : "bg-surface text-muted-text border-white/10"
                      )}
                    >
                      NOT GRADED
                    </button>
                  </div>

                  <button
                    disabled={localGrade === currentGrade || isSaving}
                    onClick={handleSave}
                    className={cn(
                      "w-full mt-4 py-4 rounded-xl font-bold text-xs uppercase tracking-[4px] transition-all",
                      localGrade === currentGrade || isSaving
                        ? "bg-muted-text/10 text-muted-text/50 border border-transparent cursor-not-allowed"
                        : "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan hover:text-black shadow-[0_0_20px_rgba(0,255,255,0.1)]"
                    )}
                  >
                    {isSaving ? "Synchronizing Data..." : "Apply & Save Results"}
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Study Resources</h3>
                  <div className="flex space-x-3">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(module.name)}+University+of+Peradeniya+lecture+notes`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 p-3 glass-card bg-subtle-surface border-none hover:bg-muted-text/10"
                    >
                      <BookOpen size={16} className="text-neon-cyan" />
                      <span className="text-xs font-bold text-body-text">Notes</span>
                      <ExternalLink size={12} className="text-muted-text" />
                    </a>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(module.name)}+tutorial`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 p-3 glass-card bg-subtle-surface border-none hover:bg-muted-text/10"
                    >
                      <Youtube size={16} className="text-neon-red" />
                      <span className="text-xs font-bold text-body-text">Tutorials</span>
                      <ExternalLink size={12} className="text-muted-text" />
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="w-full mt-8 p-4 text-sm font-bold text-muted-text uppercase tracking-widest hover:text-body-text"
              >
                Close Commander Detail
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
