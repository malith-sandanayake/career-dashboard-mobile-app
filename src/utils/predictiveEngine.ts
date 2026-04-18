import { GRADE_POINTS, GRADELIST } from './gradeScale';
import { CURRICULUM } from '../data/curriculum';
import { getTotalGPACredits } from './gpaCalculator';

export function calculateRequiredGrade(
  targetGPA: number,
  grades: Record<string, string>
): Record<string, string> {
  const totalGPACredits = getTotalGPACredits();
  let completedWeightedSum = 0;
  let remainingCredits = 0;

  CURRICULUM.forEach(m => {
    if (m.gpaIncluded) {
      const grade = grades[m.code];
      if (grade && GRADE_POINTS[grade] !== undefined) {
        completedWeightedSum += GRADE_POINTS[grade] * m.credits;
      } else {
        remainingCredits += m.credits;
      }
    }
  });

  const predictions: Record<string, string> = {};

  if (remainingCredits === 0) return predictions;

  // Target Sum: targetGPA * totalGPACredits
  const targetWeightedSum = targetGPA * totalGPACredits;
  const requiredRemainingWeightedSum = targetWeightedSum - completedWeightedSum;
  const requiredAverageGP = requiredRemainingWeightedSum / remainingCredits;

  CURRICULUM.forEach(m => {
    if (m.gpaIncluded && !grades[m.code]) {
      if (requiredAverageGP > 4.0) {
        predictions[m.code] = 'UNREACHABLE';
      } else if (requiredAverageGP <= 1.0) {
        predictions[m.code] = 'AHEAD';
      } else {
        // Find nearest grade letter
        let bestGrade = 'E';
        for (const grade of GRADELIST) {
          if (GRADE_POINTS[grade] >= requiredAverageGP) {
            // We want the minimum grade that meets the target
            if (bestGrade === 'E' || GRADE_POINTS[grade] < GRADE_POINTS[bestGrade]) {
                bestGrade = grade;
            }
          }
        }
        predictions[m.code] = bestGrade;
      }
    }
  });

  return predictions;
}
