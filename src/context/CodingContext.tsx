import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfWeek,
  subDays,
  subWeeks,
} from 'date-fns';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firestoreService';
import {
  CodingSession,
  DailyLog,
  CodingStreakData,
  CodingUserSettings,
} from '../models/CodingSession';

const SESSIONS_KEY = '@coding_sessions';
const DAILY_LOGS_KEY = '@coding_daily_logs';
const STREAK_KEY = '@coding_streak';
const SETTINGS_KEY = '@coding_settings';
const ACTIVE_TIMER_KEY = '@coding_active_timer';

const DEFAULT_SETTINGS: CodingUserSettings = {
  dailyGoalMinutes: 60,
};

const DEFAULT_STREAK: CodingStreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
};

interface ActiveTimerCache {
  timerStartTime: number;
  language: string;
  project: string;
}

interface CodingContextType {
  sessions: CodingSession[];
  dailyLogs: Record<string, DailyLog>;
  streak: CodingStreakData;
  settings: CodingUserSettings;
  loading: boolean;
  isTimerRunning: boolean;
  timerStartTime: Date | null;
  currentLanguage: string;
  currentProject: string;
  todayLog: DailyLog | null;
  todayMinutes: number;
  goalProgress: number;
  topLanguages: Array<{ name: string; minutes: number }>;
  topProjects: Array<{ name: string; minutes: number }>;
  weeklyMinutes: number[];
  recentSessions: CodingSession[];
  allLanguages: string[];
  allProjects: string[];
  startTimer: (language: string, project: string) => void;
  stopTimer: (notes?: string) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  setDailyGoal: (minutes: number) => Promise<void>;
  setCurrentLanguage: (lang: string) => void;
  setCurrentProject: (proj: string) => void;
}

const CodingContext = createContext<CodingContextType | undefined>(undefined);

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

const sortSessions = (sessions: CodingSession[]) =>
  [...sessions].sort((a, b) => {
    const timeDiff = new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
    if (timeDiff !== 0) return timeDiff;
    return b.id.localeCompare(a.id);
  });

const emptyDailyLog = (date: string, goalMet = false): DailyLog => ({
  date,
  totalMinutes: 0,
  goalMet,
  languages: {},
  projects: {},
});

const buildDailyLogForDate = (
  date: string,
  sessions: CodingSession[],
  goalMinutes: number
): DailyLog => {
  const matched = sessions.filter((session) => session.date === date);
  const languages: Record<string, number> = {};
  const projects: Record<string, number> = {};
  let totalMinutes = 0;

  for (const session of matched) {
    totalMinutes += session.durationMinutes;
    languages[session.language] = (languages[session.language] ?? 0) + session.durationMinutes;
    projects[session.project] = (projects[session.project] ?? 0) + session.durationMinutes;
  }

  return {
    date,
    totalMinutes,
    goalMet: totalMinutes >= goalMinutes,
    languages,
    projects,
  };
};

const rebuildDailyLogsFromSessions = (
  sessions: CodingSession[],
  goalMinutes: number
): Record<string, DailyLog> => {
  const logs: Record<string, DailyLog> = {};
  for (const session of sessions) {
    if (!logs[session.date]) {
      logs[session.date] = emptyDailyLog(session.date);
    }
    const log = logs[session.date];
    log.totalMinutes += session.durationMinutes;
    log.goalMet = log.totalMinutes >= goalMinutes;
    log.languages[session.language] = (log.languages[session.language] ?? 0) + session.durationMinutes;
    log.projects[session.project] = (log.projects[session.project] ?? 0) + session.durationMinutes;
  }
  return logs;
};

const rebuildStreakFromSessions = (sessions: CodingSession[]): CodingStreakData => {
  const uniqueDates = Array.from(new Set(sessions.map((session) => session.date))).sort();
  if (uniqueDates.length === 0) {
    return { ...DEFAULT_STREAK };
  }

  let currentStreak = 1;
  let longestStreak = 1;
  let previousDate = uniqueDates[0];

  for (let index = 1; index < uniqueDates.length; index += 1) {
    const date = uniqueDates[index];
    if (differenceInCalendarDays(parseISO(date), parseISO(previousDate)) === 1) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    previousDate = date;
  }

  return {
    currentStreak,
    longestStreak,
    lastActiveDate: uniqueDates[uniqueDates.length - 1],
  };
};

const normalizeSessions = (sessions: CodingSession[]) => sortSessions(sessions);

const parseCache = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const CodingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<CodingSession[]>([]);
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>({});
  const [streak, setStreak] = useState<CodingStreakData>({ ...DEFAULT_STREAK });
  const [settings, setSettings] = useState<CodingUserSettings>({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);
  const [currentLanguage, setCurrentLanguageState] = useState('Python');
  const [currentProject, setCurrentProjectState] = useState('');

  useEffect(() => {
    const boot = async () => {
      const [storedSessions, storedDailyLogs, storedStreak, storedSettings, activeTimer] =
        await Promise.all([
          AsyncStorage.getItem(SESSIONS_KEY),
          AsyncStorage.getItem(DAILY_LOGS_KEY),
          AsyncStorage.getItem(STREAK_KEY),
          AsyncStorage.getItem(SETTINGS_KEY),
          AsyncStorage.getItem(ACTIVE_TIMER_KEY),
        ]);

      const parsedSessions = parseCache<CodingSession[]>(storedSessions, []);
      const parsedDailyLogs = parseCache<Record<string, DailyLog>>(storedDailyLogs, {});
      const parsedStreak = parseCache<CodingStreakData>(storedStreak, DEFAULT_STREAK);
      const parsedSettings = parseCache<CodingUserSettings>(storedSettings, DEFAULT_SETTINGS);
      const parsedTimer = parseCache<ActiveTimerCache | null>(activeTimer, null);

      setSessions(normalizeSessions(parsedSessions));
      setDailyLogs(parsedDailyLogs);
      setStreak(parsedStreak);
      setSettings(parsedSettings);

      if (parsedTimer && parsedTimer.timerStartTime > 0) {
        setIsTimerRunning(true);
        setTimerStartTime(new Date(parsedTimer.timerStartTime));
        setCurrentLanguageState(parsedTimer.language || 'Python');
        setCurrentProjectState(parsedTimer.project || '');
      }

      setLoading(false);
    };

    boot();
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      return undefined;
    }

    const unsubSessions = firestoreService.subscribeToCodingSessions(user.uid, (remoteSessions) => {
      if (remoteSessions.length === 0) {
        return;
      }
      setSessions(normalizeSessions(remoteSessions));
    });

    const unsubDailyLogs = firestoreService.subscribeToDailyLogs(user.uid, (remoteLogs) => {
      if (remoteLogs.length === 0) {
        return;
      }
      const nextLogs: Record<string, DailyLog> = {};
      for (const log of remoteLogs) {
        nextLogs[log.date] = log;
      }
      setDailyLogs(nextLogs);
    });

    const unsubStreak = firestoreService.subscribeToCodingStreak(user.uid, (remoteStreak) => {
      if (!remoteStreak) {
        return;
      }
      setStreak((current) => ({
        currentStreak: remoteStreak.currentStreak ?? current.currentStreak,
        longestStreak: remoteStreak.longestStreak ?? current.longestStreak,
        lastActiveDate: remoteStreak.lastActiveDate ?? current.lastActiveDate,
      }));
    });

    const unsubSettings = firestoreService.subscribeToProfile(user.uid, (profile) => {
      if (!profile || typeof profile.dailyGoalMinutes !== 'number') {
        return;
      }
      setSettings((current) => ({
        dailyGoalMinutes: profile.dailyGoalMinutes ?? current.dailyGoalMinutes,
      }));
    });

    return () => {
      unsubSessions();
      unsubDailyLogs();
      unsubStreak();
      unsubSettings();
    };
  }, [user?.uid]);

  const today = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  const todayLog = useMemo(() => {
    return dailyLogs[today] ?? null;
  }, [dailyLogs, today]);

  const todayMinutes = useMemo(() => todayLog?.totalMinutes ?? 0, [todayLog]);

  const goalProgress = useMemo(() => {
    if (settings.dailyGoalMinutes <= 0) {
      return 0;
    }
    return Math.min(Math.round((todayMinutes / settings.dailyGoalMinutes) * 100), 100);
  }, [settings.dailyGoalMinutes, todayMinutes]);

  const topLanguages = useMemo(() => {
    const threshold = format(subDays(new Date(), 29), 'yyyy-MM-dd');
    const map = new Map<string, number>();

    for (const log of Object.values(dailyLogs)) {
      if (log.date < threshold) {
        continue;
      }
      for (const [name, minutes] of Object.entries(log.languages)) {
        map.set(name, (map.get(name) ?? 0) + minutes);
      }
    }

    return Array.from(map.entries())
      .map(([name, minutes]) => ({ name, minutes }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [dailyLogs]);

  const topProjects = useMemo(() => {
    const threshold = format(subDays(new Date(), 29), 'yyyy-MM-dd');
    const map = new Map<string, number>();

    for (const log of Object.values(dailyLogs)) {
      if (log.date < threshold) {
        continue;
      }
      for (const [name, minutes] of Object.entries(log.projects)) {
        map.set(name, (map.get(name) ?? 0) + minutes);
      }
    }

    return Array.from(map.entries())
      .map(([name, minutes]) => ({ name, minutes }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [dailyLogs]);

  const weeklyMinutes = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, index) => {
      const date = format(addDays(weekStart, index), 'yyyy-MM-dd');
      return dailyLogs[date]?.totalMinutes ?? 0;
    });
  }, [dailyLogs]);

  const recentSessions = useMemo(() => sessions.slice(0, 10), [sessions]);

  const allLanguages = useMemo(() => {
    return Array.from(new Set(sessions.map((session) => session.language))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [sessions]);

  const allProjects = useMemo(() => {
    return Array.from(new Set(sessions.map((session) => session.project))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [sessions]);

  const persistLocalState = useCallback(
    async (nextSessions: CodingSession[], nextLogs: Record<string, DailyLog>, nextStreak: CodingStreakData, nextSettings: CodingUserSettings) => {
      await Promise.all([
        AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(nextSessions)),
        AsyncStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(nextLogs)),
        AsyncStorage.setItem(STREAK_KEY, JSON.stringify(nextStreak)),
        AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings)),
      ]);
    },
    []
  );

  const startTimer = useCallback((language: string, project: string) => {
    const nextLanguage = language.trim() || 'Python';
    const nextProject = project.trim() || 'General';
    const startedAt = new Date();

    setCurrentLanguageState(nextLanguage);
    setCurrentProjectState(nextProject);
    setTimerStartTime(startedAt);
    setIsTimerRunning(true);

    void AsyncStorage.setItem(
      ACTIVE_TIMER_KEY,
      JSON.stringify({
        timerStartTime: startedAt.getTime(),
        language: nextLanguage,
        project: nextProject,
      } satisfies ActiveTimerCache)
    );
  }, []);

  const setCurrentLanguage = useCallback((lang: string) => {
    setCurrentLanguageState(lang);
  }, []);

  const setCurrentProject = useCallback((proj: string) => {
    setCurrentProjectState(proj);
  }, []);

  const stopTimer = useCallback(async (notes?: string) => {
    if (!isTimerRunning || !timerStartTime) {
      return;
    }

    const todayDate = format(new Date(), 'yyyy-MM-dd');
    const startedAtIso = timerStartTime.toISOString();
    const durationMinutes = Math.max(
      1,
      Math.round((Date.now() - timerStartTime.getTime()) / 60000)
    );
    const language = currentLanguage.trim() || 'Python';
    const project = currentProject.trim() || 'General';
    const session: CodingSession = {
      id: generateId(),
      startedAt: startedAtIso,
      durationMinutes,
      language,
      project,
      notes: notes?.trim() || undefined,
      date: todayDate,
    };

    const nextSessions = normalizeSessions([session, ...sessions]);
    const nextDailyLog = buildDailyLogForDate(todayDate, nextSessions, settings.dailyGoalMinutes);
    const nextLogs = {
      ...dailyLogs,
      [todayDate]: nextDailyLog,
    };

    let nextStreak = { ...streak };
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    if (streak.lastActiveDate === todayDate) {
      nextStreak = {
        ...streak,
        longestStreak: Math.max(streak.longestStreak, streak.currentStreak),
        lastActiveDate: todayDate,
      };
    } else if (streak.lastActiveDate === yesterday) {
      const currentStreak = streak.currentStreak + 1;
      nextStreak = {
        currentStreak,
        longestStreak: Math.max(streak.longestStreak, currentStreak),
        lastActiveDate: todayDate,
      };
    } else {
      nextStreak = {
        currentStreak: 1,
        longestStreak: Math.max(streak.longestStreak, 1),
        lastActiveDate: todayDate,
      };
    }

    setSessions(nextSessions);
    setDailyLogs(nextLogs);
    setStreak(nextStreak);
    setIsTimerRunning(false);
    setTimerStartTime(null);

    await AsyncStorage.removeItem(ACTIVE_TIMER_KEY);
    await persistLocalState(nextSessions, nextLogs, nextStreak, settings);

    if (user?.uid) {
      await Promise.all([
        firestoreService.saveCodingSession(user.uid, session),
        firestoreService.updateDailyLog(user.uid, todayDate, nextDailyLog),
        firestoreService.saveCodingStreak(user.uid, nextStreak),
      ]);
    }
  }, [
    currentLanguage,
    currentProject,
    dailyLogs,
    isTimerRunning,
    persistLocalState,
    sessions,
    settings,
    streak,
    timerStartTime,
    user?.uid,
  ]);

  const deleteSession = useCallback(async (id: string) => {
    const existing = sessions.find((session) => session.id === id);
    if (!existing) {
      return;
    }

    const remainingSessions = sessions.filter((session) => session.id !== id);
    const nextSessions = normalizeSessions(remainingSessions);
    const affectedDate = existing.date;
    const nextDailyLog = buildDailyLogForDate(affectedDate, nextSessions, settings.dailyGoalMinutes);
    const nextLogs = {
      ...dailyLogs,
      [affectedDate]: nextDailyLog,
    };
    const nextStreak = rebuildStreakFromSessions(nextSessions);

    setSessions(nextSessions);
    setDailyLogs(nextLogs);
    setStreak(nextStreak);

    await persistLocalState(nextSessions, nextLogs, nextStreak, settings);

    if (user?.uid) {
      await Promise.all([
        firestoreService.deleteCodingSession(user.uid, id),
        firestoreService.updateDailyLog(user.uid, affectedDate, nextDailyLog),
        firestoreService.saveCodingStreak(user.uid, nextStreak),
      ]);
    }
  }, [dailyLogs, persistLocalState, sessions, settings, user?.uid]);

  const setDailyGoal = useCallback(async (minutes: number) => {
    const nextSettings = { dailyGoalMinutes: Math.max(1, Math.round(minutes)) };
    setSettings(nextSettings);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
    await persistLocalState(sessions, dailyLogs, streak, nextSettings);

    if (user?.uid) {
      await firestoreService.saveCodingSettings(user.uid, nextSettings);
    }
  }, [dailyLogs, persistLocalState, sessions, streak, user?.uid]);

  return (
    <CodingContext.Provider
      value={{
        sessions,
        dailyLogs,
        streak,
        settings,
        loading,
        isTimerRunning,
        timerStartTime,
        currentLanguage,
        currentProject,
        todayLog,
        todayMinutes,
        goalProgress,
        topLanguages,
        topProjects,
        weeklyMinutes,
        recentSessions,
        allLanguages,
        allProjects,
        startTimer,
        stopTimer,
        deleteSession,
        setDailyGoal,
        setCurrentLanguage,
        setCurrentProject,
      }}
    >
      {children}
    </CodingContext.Provider>
  );
};

export const useCoding = () => {
  const context = useContext(CodingContext);
  if (!context) {
    throw new Error('useCoding must be used within a CodingProvider');
  }
  return context;
};
