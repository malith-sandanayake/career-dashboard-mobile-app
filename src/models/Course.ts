// src/models/Course.ts

export type CourseCategory =
  | 'Udemy'
  | 'Coursera'
  | 'YouTube'
  | 'Google'
  | 'Cisco'
  | 'AWS'
  | 'Microsoft'
  | 'CompTIA'
  | 'Other Certification'
  | 'Other Online';

export type CourseStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'Paused';

export type LearningCategory =
  | 'Cybersecurity'
  | 'AI/ML'
  | 'Web Development'
  | 'Mobile Development'
  | 'Cloud/DevOps'
  | 'Data Engineering'
  | 'Embedded/IoT'
  | 'Algorithms/DSA'
  | 'Networking'
  | 'Other';

export interface Course {
  id: string;
  title: string;
  platform: CourseCategory;
  instructor?: string;
  url?: string;
  totalLessons: number;
  completedLessons: number;
  startDate: string;          // ISO date "2026-04-01"
  targetEndDate: string;      // ISO date "2026-07-01"
  actualEndDate?: string | null;
  status: CourseStatus;
  category: LearningCategory;
  skillsGained: string[];
  languagesUsed: string[];
  certificateEarned: boolean;
  certificateUrl?: string;
  notes?: string;
  color: string;              // hex color string
  createdAt: string;          // ISO timestamp
  lastProgressUpdate: string; // ISO timestamp
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastUpdatedDate: string;    // ISO date string "2026-04-19"
}

/**
 * Derived — never stored, always computed on the fly.
 */
export function getCompletionPercent(course: Course): number {
  if (course.totalLessons === 0) return 0;
  return Math.round((course.completedLessons / course.totalLessons) * 100);
}
