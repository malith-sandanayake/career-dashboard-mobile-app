export interface CodingSession {
  id: string;
  startedAt: string;
  durationMinutes: number;
  language: string;
  project: string;
  notes?: string;
  date: string;
}

export interface DailyLog {
  date: string;
  totalMinutes: number;
  goalMet: boolean;
  languages: Record<string, number>;
  projects: Record<string, number>;
}

export interface CodingStreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export interface CodingUserSettings {
  dailyGoalMinutes: number;
}
