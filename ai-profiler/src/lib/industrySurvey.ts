import type { ProficiencyLevel } from "./questions";

export interface RoleAnswerOption {
  text: string;
  score: ProficiencyLevel;
  proficiencyLabel: string;
}

export interface RoleQuestion {
  id: number;
  question: string;
  answers: RoleAnswerOption[];
}

export interface Role {
  role: string;
  questions: RoleQuestion[];
}

export interface Industry {
  industry: string;
  roles: Role[];
}

interface RawAnswerOption {
  text: string;
  proficiency: string;
  score: number;
}

interface RawQuestion {
  id: number;
  question: string;
  answers: RawAnswerOption[];
}

interface RawRole {
  role: string;
  questions: RawQuestion[];
}

interface RawIndustry {
  industry: string;
  roles: RawRole[];
}

interface RawSurveyConfig {
  proficiency_levels: Record<string, string>;
  industries: RawIndustry[];
}

export interface IndustrySurveyConfig {
  industries: Industry[];
  proficiencyLevels: Record<string, string>;
}

function isRawSurveyConfig(value: unknown): value is RawSurveyConfig {
  if (!value || typeof value !== "object") return false;
  const config = value as Partial<RawSurveyConfig>;
  return Array.isArray(config.industries) && !!config.proficiency_levels;
}

/**
 * Fetches and normalizes the industry/role/question survey configuration
 * from the JSON file exposed via the /api/industry-survey endpoint.
 */
export async function fetchIndustrySurveyConfig(): Promise<IndustrySurveyConfig> {
  const response = await fetch("/api/industry-survey");
  if (!response.ok) {
    throw new Error("Failed to load survey configuration");
  }

  const raw = (await response.json()) as unknown;
  if (!isRawSurveyConfig(raw)) {
    throw new Error("Survey configuration has unexpected shape");
  }

  const industries: Industry[] = raw.industries.map((industry): Industry => ({
    industry: industry.industry,
    roles: industry.roles.map((role): Role => ({
      role: role.role,
      questions: role.questions.map(
        (question): RoleQuestion => ({
          id: question.id,
          question: question.question,
          answers: question.answers.map(
            (answer): RoleAnswerOption => ({
              text: answer.text,
              // Trust the numeric score from JSON, clamped into the ProficiencyLevel range
              score: Math.min(4, Math.max(1, answer.score)) as ProficiencyLevel,
              proficiencyLabel: answer.proficiency,
            })
          ),
        })
      ),
    })),
  }));

  return {
    industries,
    proficiencyLevels: raw.proficiency_levels,
  };
}

