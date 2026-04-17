import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firestoreService';
import { calculateCGPA, calculateSGPA } from '../utils/gpaCalculator';
import { calculateRequiredGrade } from '../utils/predictiveEngine';

interface GradeContextType {
  grades: Record<string, string>;
  targetGPA: number;
  setTargetGPA: (val: number) => void;
  updateGrade: (code: string, grade: string | null) => Promise<void>;
  resetAll: () => Promise<void>;
  cgpa: number;
  predictions: Record<string, string>;
}

const GradeContext = createContext<GradeContextType | undefined>(undefined);

export const GradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [targetGPA, setTargetGPAState] = useState(3.7);

  useEffect(() => {
    if (!user) {
      setGrades({});
      return;
    }

    const unsubGrades = firestoreService.subscribeToGrades(user.uid, (data) => {
      const gMap: Record<string, string> = {};
      data.forEach(item => {
        if (item.grade) gMap[item.moduleCode] = item.grade;
      });
      setGrades(gMap);
    });

    const unsubProfile = firestoreService.subscribeToProfile(user.uid, (profile) => {
      if (profile?.targetGPA) setTargetGPAState(profile.targetGPA);
    });

    return () => {
      unsubGrades();
      unsubProfile();
    };
  }, [user]);

  const updateGrade = async (code: string, grade: string | null) => {
    if (!user) return;
    await firestoreService.updateGrade(user.uid, code, {
      moduleCode: code,
      grade,
      status: grade ? 'Completed' : 'InProgress'
    });
  };

  const setTargetGPA = async (val: number) => {
    if (!user) return;
    setTargetGPAState(val);
    await firestoreService.updateProfile(user.uid, { targetGPA: val });
  };

  const resetAll = async () => {
    if (!user) return;
    await firestoreService.resetGrades(user.uid, Object.keys(grades));
  };

  const cgpa = useMemo(() => calculateCGPA(grades), [grades]);
  const predictions = useMemo(() => calculateRequiredGrade(targetGPA, grades), [targetGPA, grades]);

  return (
    <GradeContext.Provider value={{
      grades,
      targetGPA,
      setTargetGPA,
      updateGrade,
      resetAll,
      cgpa,
      predictions
    }}>
      {children}
    </GradeContext.Provider>
  );
};

export const useGrades = () => {
  const context = useContext(GradeContext);
  if (!context) throw new Error('useGrades must be used within GradeProvider');
  return context;
};
