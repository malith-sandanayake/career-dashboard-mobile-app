// src/services/courseStorage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course, StreakData } from '../models/Course';

const COURSES_KEY = '@courses';
const STREAK_KEY = '@streak';

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastUpdatedDate: '',
};

export async function loadCourses(): Promise<Course[]> {
  try {
    const raw = await AsyncStorage.getItem(COURSES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Course[];
  } catch {
    return [];
  }
}

export async function saveCourses(courses: Course[]): Promise<void> {
  try {
    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('[courseStorage] saveCourses failed:', e);
  }
}

export async function loadStreak(): Promise<StreakData> {
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    if (!raw) return { ...DEFAULT_STREAK };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { ...DEFAULT_STREAK };
  }
}

export async function saveStreak(streak: StreakData): Promise<void> {
  try {
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  } catch (e) {
    console.error('[courseStorage] saveStreak failed:', e);
  }
}
