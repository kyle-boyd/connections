import type { SurveyAnswer } from "./calculateResults";

export const SURVEY_ANSWERS_KEY = "ai-profiler-answers";
export const SURVEY_METADATA_KEY = "ai-profiler-metadata";

export interface SurveyMetadata {
  industry: string;
  role: string;
}

export function getStoredAnswers(): SurveyAnswer[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SURVEY_ANSWERS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as SurveyAnswer[];
  } catch {
    return null;
  }
}

export function setStoredAnswers(answers: SurveyAnswer[]): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SURVEY_ANSWERS_KEY, JSON.stringify(answers));
}

export function getSurveyMetadata(): SurveyMetadata | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SURVEY_METADATA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const { industry, role } = parsed as Partial<SurveyMetadata>;
    if (!industry || !role) return null;
    return { industry, role };
  } catch {
    return null;
  }
}

export function setSurveyMetadata(metadata: SurveyMetadata): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SURVEY_METADATA_KEY, JSON.stringify(metadata));
}

