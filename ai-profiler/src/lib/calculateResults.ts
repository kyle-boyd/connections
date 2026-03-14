import type { ProficiencyLevel } from "./questions";

export type ProficiencyLabel =
  | "Curious"
  | "Adopter"
  | "Integrated"
  | "Native";

export interface SurveyAnswer {
  questionId: string;
  score: ProficiencyLevel;
}

export interface CalculateResultsOutput {
  level: ProficiencyLabel;
  averageScore: number;
  minScore: ProficiencyLevel;
  maxScore: ProficiencyLevel;
}

function scoreToLabel(score: number): ProficiencyLabel {
  const clamped = Math.max(1, Math.min(4, Math.round(score)));
  const labels: Record<ProficiencyLevel, ProficiencyLabel> = {
    1: "Curious",
    2: "Adopter",
    3: "Integrated",
    4: "Native",
  };
  return labels[clamped as ProficiencyLevel];
}

/**
 * Computes overall proficiency level from all scored answers.
 * Every role-specific question contributes equally to the average.
 */
export function calculateResults(answers: SurveyAnswer[]): CalculateResultsOutput {
  if (!answers.length) {
    return {
      level: "Curious",
      averageScore: 1,
      minScore: 1,
      maxScore: 1,
    };
  }

  let sum = 0;
  let min: ProficiencyLevel = 4;
  let max: ProficiencyLevel = 1;

  for (const answer of answers) {
    const score = answer.score;
    sum += score;
    if (score < min) min = score;
    if (score > max) max = score;
  }

  const average = sum / answers.length;
  const level = scoreToLabel(average);

  return {
    level,
    averageScore: average,
    minScore: min,
    maxScore: max,
  };
}

