import { GRADE_POINTS } from './gradeScale';
import { CURRICULUM } from '../data/curriculum';
import { GradeEntry } from '../models/types';

export function calculateSGPA(semester: number, grades: Record<string, string>) {
  const semesterModules = CURRICULUM.filter(m => m.semester === semester && m.gpaIncluded);
  let totalPoints = 0;
  let totalCredits = 0;

  semesterModules.forEach(m => {
    const grade = grades[m.code];
    if (grade && GRADE_POINTS[grade] !== undefined) {
      totalPoints += GRADE_POINTS[grade] * m.credits;
      totalCredits += m.credits;
    }
  });

  return totalCredits === 0 ? 0 : totalPoints / totalCredits;
}

export function calculateCGPA(grades: Record<string, string>) {
  let totalPoints = 0;
  let totalCredits = 0;

  CURRICULUM.forEach(m => {
    if (m.gpaIncluded) {
      const grade = grades[m.code];
      if (grade && GRADE_POINTS[grade] !== undefined) {
        totalPoints += GRADE_POINTS[grade] * m.credits;
        totalCredits += m.credits;
      }
    }
  });

  return totalCredits === 0 ? 0 : totalPoints / totalCredits;
}

export function getGPAIncludedCreditsCompleted(grades: Record<string, string>) {
  let credits = 0;
  CURRICULUM.forEach(m => {
    if (m.gpaIncluded && grades[m.code]) {
      credits += m.credits;
    }
  });
  return credits;
}

export function getTotalGPACredits() {
  return CURRICULUM.reduce((acc, m) => m.gpaIncluded ? acc + m.credits : acc, 0);
}
