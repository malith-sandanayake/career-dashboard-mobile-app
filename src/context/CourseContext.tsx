// src/context/CourseContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { format, subDays, parseISO, differenceInDays, addDays } from 'date-fns';
import { Course, StreakData, LearningCategory, getCompletionPercent } from '../models/Course';
import {
  loadCourses,
  saveCourses,
  loadStreak,
  saveStreak,
} from '../services/courseStorage';

// ─── ID generator ────────────────────────────────────────────────────────────
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_COURSES: Omit<Course, 'id' | 'createdAt' | 'lastProgressUpdate'>[] = [
  {
    title: 'Google Cybersecurity Certificate',
    platform: 'Google',
    instructor: 'Google Career Certificates',
    url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
    category: 'Cybersecurity',
    totalLessons: 170,
    completedLessons: 45,
    startDate: '2026-04-01',
    targetEndDate: '2026-07-01',
    status: 'InProgress',
    skillsGained: [
      'Network Security',
      'SIEM',
      'Linux',
      'Incident Response',
      'Python Scripting',
    ],
    languagesUsed: ['Python', 'Bash', 'Linux CLI'],
    certificateEarned: false,
    color: '#00FFFF',
    notes: 'Hosted on Coursera. 8 courses total.',
    actualEndDate: null,
  },
  {
    title: 'Cisco Junior Cybersecurity Analyst',
    platform: 'Cisco',
    instructor: 'Cisco Networking Academy',
    url: 'https://www.netacad.com',
    category: 'Cybersecurity',
    totalLessons: 80,
    completedLessons: 24,
    startDate: '2026-03-15',
    targetEndDate: '2026-08-15',
    status: 'InProgress',
    skillsGained: [
      'Network Defense',
      'Threat Analysis',
      'Packet Analysis',
      'Cisco Packet Tracer',
    ],
    languagesUsed: ['Cisco IOS CLI', 'Wireshark'],
    certificateEarned: false,
    color: '#9B59F5',
    notes: 'Cisco NetAcad platform. Junior Cybersecurity Analyst path.',
    actualEndDate: null,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface LanguageEntry {
  name: string;
  usageCount: number;
  isLearning: boolean;
  isMastered: boolean;
}

interface SkillEntry {
  name: string;
  category: LearningCategory;
  earnedInCompleted: boolean;
  inProgressCourses: string[];
}

interface CourseContextType {
  courses: Course[];
  streak: StreakData;
  loading: boolean;

  // Computed
  activeCourses: Course[];
  completedCourses: Course[];
  totalLessonsDone: number;
  overallProgress: number;
  allLanguages: LanguageEntry[];
  allSkills: SkillEntry[];
  upcomingDeadlines: Course[];
  certificatesEarned: Course[];

  // Actions
  addCourse: (
    data: Omit<Course, 'id' | 'createdAt' | 'lastProgressUpdate'>
  ) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  updateProgress: (id: string, newCompletedLessons: number) => void;
  markCompleted: (id: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastUpdatedDate: '',
  });
  const [loading, setLoading] = useState(true);

  // ── Boot ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const [storedCourses, storedStreak] = await Promise.all([
        loadCourses(),
        loadStreak(),
      ]);

      if (!storedCourses || storedCourses.length === 0) {
        // Seed first launch
        const now = new Date().toISOString();
        const seeded: Course[] = SEED_COURSES.map((s) => ({
          ...s,
          id: generateId(),
          createdAt: now,
          lastProgressUpdate: now,
        }));
        setCourses(seeded);
        await saveCourses(seeded);
      } else {
        setCourses(storedCourses);
      }

      setStreak(storedStreak);
      setLoading(false);
    })();
  }, []);

  // ── Streak helper ───────────────────────────────────────────────────────────
  const recalcStreak = useCallback(
    async (currentStreak: StreakData): Promise<StreakData> => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

      let { currentStreak: cur, longestStreak: longest } = currentStreak;

      if (currentStreak.lastUpdatedDate === today) {
        return currentStreak; // already updated today
      }

      if (currentStreak.lastUpdatedDate === yesterday) {
        cur += 1;
      } else {
        cur = 1;
      }

      if (cur > longest) longest = cur;

      const updated: StreakData = {
        currentStreak: cur,
        longestStreak: longest,
        lastUpdatedDate: today,
      };
      await saveStreak(updated);
      return updated;
    },
    []
  );

  // ── Actions ─────────────────────────────────────────────────────────────────
  const addCourse = useCallback(
    (data: Omit<Course, 'id' | 'createdAt' | 'lastProgressUpdate'>) => {
      const now = new Date().toISOString();
      const course: Course = {
        ...data,
        id: generateId(),
        createdAt: now,
        lastProgressUpdate: now,
      };
      setCourses((prev) => {
        const next = [...prev, course];
        saveCourses(next);
        return next;
      });
    },
    []
  );

  const updateCourse = useCallback(
    (id: string, updates: Partial<Course>) => {
      setCourses((prev) => {
        const next = prev.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        );
        saveCourses(next);
        return next;
      });
    },
    []
  );

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCourses(next);
      return next;
    });
  }, []);

  const updateProgress = useCallback(
    async (id: string, newCompletedLessons: number) => {
      const now = new Date().toISOString();
      setCourses((prev) => {
        const next = prev.map((c) =>
          c.id === id
            ? { ...c, completedLessons: newCompletedLessons, lastProgressUpdate: now }
            : c
        );
        saveCourses(next);
        return next;
      });

      const updatedStreak = await recalcStreak(streak);
      setStreak(updatedStreak);
    },
    [streak, recalcStreak]
  );

  const markCompleted = useCallback(
    async (id: string) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const now = new Date().toISOString();
      setCourses((prev) => {
        const next = prev.map((c) => {
          if (c.id !== id) return c;
          return {
            ...c,
            status: 'Completed' as const,
            actualEndDate: today,
            completedLessons: c.totalLessons,
            lastProgressUpdate: now,
          };
        });
        saveCourses(next);
        return next;
      });

      const updatedStreak = await recalcStreak(streak);
      setStreak(updatedStreak);
    },
    [streak, recalcStreak]
  );

  // ── Computed ─────────────────────────────────────────────────────────────────
  const activeCourses = useMemo(
    () => courses.filter((c) => c.status === 'InProgress'),
    [courses]
  );

  const completedCourses = useMemo(
    () => courses.filter((c) => c.status === 'Completed'),
    [courses]
  );

  const totalLessonsDone = useMemo(
    () => courses.reduce((sum, c) => sum + c.completedLessons, 0),
    [courses]
  );

  const overallProgress = useMemo(() => {
    if (activeCourses.length === 0) return 0;
    const avg =
      activeCourses.reduce((sum, c) => sum + getCompletionPercent(c), 0) /
      activeCourses.length;
    return Math.round(avg);
  }, [activeCourses]);

  const allLanguages = useMemo((): LanguageEntry[] => {
    const map = new Map<string, LanguageEntry>();
    for (const course of courses) {
      for (const lang of course.languagesUsed) {
        const existing = map.get(lang);
        const isCompleted = course.status === 'Completed';
        const isInProgress = course.status === 'InProgress';
        if (existing) {
          existing.usageCount += 1;
          if (isCompleted) existing.isMastered = true;
          if (isInProgress) existing.isLearning = true;
        } else {
          map.set(lang, {
            name: lang,
            usageCount: 1,
            isMastered: isCompleted,
            isLearning: isInProgress,
          });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      if (a.isMastered && !b.isMastered) return -1;
      if (!a.isMastered && b.isMastered) return 1;
      if (a.isLearning && !b.isLearning) return -1;
      if (!a.isLearning && b.isLearning) return 1;
      return b.usageCount - a.usageCount;
    });
  }, [courses]);

  const allSkills = useMemo((): SkillEntry[] => {
    const map = new Map<string, SkillEntry>();
    for (const course of courses) {
      for (const skill of course.skillsGained) {
        const existing = map.get(skill);
        const isCompleted = course.status === 'Completed';
        const isInProgress = course.status === 'InProgress';
        if (existing) {
          if (isCompleted) existing.earnedInCompleted = true;
          if (isInProgress) existing.inProgressCourses.push(course.title);
        } else {
          map.set(skill, {
            name: skill,
            category: course.category,
            earnedInCompleted: isCompleted,
            inProgressCourses: isInProgress ? [course.title] : [],
          });
        }
      }
    }
    return Array.from(map.values());
  }, [courses]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const thirtyDays = addDays(now, 30);
    return activeCourses
      .filter((c) => {
        const target = parseISO(c.targetEndDate);
        return target >= now && target <= thirtyDays;
      })
      .sort(
        (a, b) =>
          parseISO(a.targetEndDate).getTime() -
          parseISO(b.targetEndDate).getTime()
      );
  }, [activeCourses]);

  const certificatesEarned = useMemo(
    () => courses.filter((c) => c.certificateEarned),
    [courses]
  );

  return (
    <CourseContext.Provider
      value={{
        courses,
        streak,
        loading,
        activeCourses,
        completedCourses,
        totalLessonsDone,
        overallProgress,
        allLanguages,
        allSkills,
        upcomingDeadlines,
        certificatesEarned,
        addCourse,
        updateCourse,
        deleteCourse,
        updateProgress,
        markCompleted,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourses must be used within CourseProvider');
  return ctx;
};
