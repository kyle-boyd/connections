"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setStoredAnswers, setSurveyMetadata } from "@/lib/surveyStorage";
import type { SurveyAnswer } from "@/lib/calculateResults";
import type { ProficiencyLevel } from "@/lib/questions";
import {
  fetchIndustrySurveyConfig,
  type Industry,
  type Role,
  type RoleQuestion,
} from "@/lib/industrySurvey";

type Phase = "industry" | "role" | "questions";

function makeQuestionId(industry: Industry, role: Role, question: RoleQuestion) {
  return `${industry.industry}::${role.role}::q${question.id}`;
}

export default function SurveyPage() {
  const router = useRouter();

  useEffect(() => { document.title = "Survey | Guild"; }, []);

  const [phase, setPhase] = useState<Phase>("industry");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [selectedIndustryIndex, setSelectedIndustryIndex] = useState<number | null>(null);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ProficiencyLevel>>({});
  const [selectedOptionByQuestion, setSelectedOptionByQuestion] = useState<Record<string, string>>(
    {}
  );
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [otherIndustryText, setOtherIndustryText] = useState("");
  const [otherSelected, setOtherSelected] = useState(false);
  const [showOtherThanks, setShowOtherThanks] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const config = await fetchIndustrySurveyConfig();
        if (!cancelled) {
          setIndustries(config.industries);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoadError("We couldn't load the survey right now. Please try again later.");
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedIndustry =
    selectedIndustryIndex != null ? industries[selectedIndustryIndex] : undefined;
  const selectedRole =
    selectedIndustry && selectedRoleIndex != null
      ? selectedIndustry.roles[selectedRoleIndex]
      : undefined;

  const currentRoleQuestion: RoleQuestion | undefined = useMemo(() => {
    if (!selectedRole || phase !== "questions") return undefined;
    return selectedRole.questions[currentQuestionIndex];
  }, [phase, selectedRole, currentQuestionIndex]);

  const totalSteps = useMemo(() => {
    const baseSteps = 2; // industry + role
    const questionCount = selectedRole ? selectedRole.questions.length : 0;
    return baseSteps + questionCount;
  }, [selectedRole]);

  const currentStepIndex = useMemo(() => {
    if (phase === "industry") return 0;
    if (phase === "role") return 1;
    return 2 + currentQuestionIndex;
  }, [phase, currentQuestionIndex]);

  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const canProceed = useMemo(() => {
    if (phase === "industry") {
      return selectedIndustryIndex != null || (otherSelected && otherIndustryText.trim() !== "");
    }
    if (phase === "role") {
      return selectedRoleIndex != null;
    }
    if (phase === "questions") {
      if (!selectedIndustry || !selectedRole || !currentRoleQuestion) return false;
      const qid = makeQuestionId(selectedIndustry, selectedRole, currentRoleQuestion);
      return answers[qid] !== undefined;
    }
    return false;
  }, [
    phase,
    selectedIndustryIndex,
    otherSelected,
    otherIndustryText,
    selectedRoleIndex,
    selectedIndustry,
    selectedRole,
    currentRoleQuestion,
    answers,
  ]);

  const isLastQuestion =
    phase === "questions" && selectedRole
      ? currentQuestionIndex === selectedRole.questions.length - 1
      : false;

  const currentQuestionId = useMemo(() => {
    if (!selectedIndustry || !selectedRole || !currentRoleQuestion) return null;
    return makeQuestionId(selectedIndustry, selectedRole, currentRoleQuestion);
  }, [selectedIndustry, selectedRole, currentRoleQuestion]);

  const isCurrentQuestionFlagged = currentQuestionId ? flaggedQuestions.has(currentQuestionId) : false;

  const handleFlagQuestion = () => {
    if (!currentQuestionId) return;
    setFlaggedQuestions((prev) => new Set(prev).add(currentQuestionId));
  };

  const handleSelectIndustry = (index: number) => {
    setSelectedIndustryIndex(index);
    setOtherSelected(false);
    // Reset downstream selections when industry changes
    setSelectedRoleIndex(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedOptionByQuestion({});
  };

  const handleOtherIndustryChange = (text: string) => {
    setOtherIndustryText(text);
    if (text.trim()) {
      setOtherSelected(true);
      setSelectedIndustryIndex(null);
    } else {
      setOtherSelected(false);
    }
  };

  const handleSelectRole = (index: number) => {
    setSelectedRoleIndex(index);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedOptionByQuestion({});
  };

  const handleSelectAnswer = (optionLabel: string, score: ProficiencyLevel) => {
    if (!selectedIndustry || !selectedRole || !currentRoleQuestion) return;
    const qid = makeQuestionId(selectedIndustry, selectedRole, currentRoleQuestion);
    setAnswers((prev) => ({ ...prev, [qid]: score }));
    setSelectedOptionByQuestion((prev) => ({ ...prev, [qid]: optionLabel }));
  };

  const handleBack = () => {
    if (phase === "industry") {
      return;
    }
    if (phase === "role") {
      setPhase("industry");
      return;
    }
    if (phase === "questions") {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((idx) => idx - 1);
      } else {
        setPhase("role");
      }
    }
  };

  const handleNext = () => {
    if (!canProceed) return;

    if (phase === "industry") {
      if (otherSelected) {
        setShowOtherThanks(true);
        return;
      }
      setPhase("role");
      return;
    }

    if (phase === "role") {
      setPhase("questions");
      setCurrentQuestionIndex(0);
      return;
    }

    if (phase === "questions") {
      if (!selectedIndustry || !selectedRole) return;

      if (!isLastQuestion) {
        setCurrentQuestionIndex((idx) => idx + 1);
        return;
      }

      // Finalize answers and navigate to results
      const collectedAnswers: SurveyAnswer[] = [];
      for (const question of selectedRole.questions) {
        const qid = makeQuestionId(selectedIndustry, selectedRole, question);
        const score = answers[qid];
        if (score !== undefined) {
          collectedAnswers.push({ questionId: qid, score });
        }
      }

      setStoredAnswers(collectedAnswers);
      setSurveyMetadata({
        industry: selectedIndustry.industry,
        role: selectedRole.role,
      });
      router.push("/results");
    }
  };

  const primaryButtonLabel =
    phase === "questions" && isLastQuestion ? "See results" : "Next";

  const currentTitle = (() => {
    if (phase === "industry") {
      return "Which industry best describes your work?";
    }
    if (phase === "role") {
      return selectedIndustry
        ? `What is your role in ${selectedIndustry.industry}?`
        : "What is your role?";
    }
    if (phase === "questions") {
      return currentRoleQuestion?.question ?? "";
    }
    return "";
  })();

  const currentDescription = (() => {
    if (phase === "industry") {
      return "Start by telling us which space you work in so we can tailor the questions.";
    }
    if (phase === "role") {
      return "Next, choose the role that best matches what you do day to day.";
    }
    if (phase === "questions") {
      return "Answer based on how AI currently shows up in your workflow.";
    }
    return "";
  })();

  if (showOtherThanks) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-xl px-6 py-12 sm:px-8 sm:py-16">
          <h2 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] sm:font-extrabold sm:text-3xl sm:tracking-[-0.04em]">
            Thanks for letting us know
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            We are hoping to add more industry options, we will take this into consideration.
          </p>
          <div className="mt-12">
            <Link
              href="/match"
              className="inline-block rounded-md px-8 py-4 font-sans text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--cta)" }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-xl px-8 py-24 text-center">
          <p className="text-muted">Loading your survey…</p>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-xl px-8 py-24">
          <h1 className="font-display text-2xl font-medium tracking-[-0.02em]">
            Something went wrong
          </h1>
          <p className="mt-4 leading-relaxed text-muted">{loadError}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 h-1.5 w-full bg-border">
        <div
          className="h-full bg-fill transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto max-w-xl px-6 py-12 sm:px-8 sm:py-16">
        <p className="font-sans text-sm font-medium uppercase tracking-wider text-muted">
          Step {currentStepIndex + 1} of {totalSteps}
        </p>
        <h2 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] sm:font-extrabold sm:text-3xl sm:tracking-[-0.04em]">
          {currentTitle}
        </h2>
        {currentDescription && (
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {currentDescription}
          </p>
        )}

        {phase === "questions" && currentQuestionId && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleFlagQuestion}
              disabled={isCurrentQuestionFlagged}
              className="rounded-md border-2 border-border bg-surface px-3 py-1.5 font-sans text-xs font-medium text-foreground transition-opacity hover:bg-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isCurrentQuestionFlagged ? "Thanks" : "This is a bad question"}
            </button>
            {isCurrentQuestionFlagged && (
              <span className="text-xs text-muted">We logged this and will improve this question.</span>
            )}
          </div>
        )}

        {phase === "industry" && (
          <ul className="mt-10 space-y-3" role="radiogroup" aria-label="Select your industry">
            {industries.map((industry, index) => {
              const isSelected = selectedIndustryIndex === index;
              return (
                <li key={industry.industry}>
                  <button
                    type="button"
                    onClick={() => handleSelectIndustry(index)}
                    className={`w-full rounded-md border-2 px-5 py-4 text-left text-sm transition-colors sm:text-base ${
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-surface text-foreground hover:border-muted hover:bg-background"
                    }`}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    {industry.industry}
                  </button>
                </li>
              );
            })}
            <li key="other">
              <div
                className={`w-full rounded-md border-2 px-5 py-4 text-sm transition-colors sm:text-base ${
                  otherSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-foreground hover:border-muted hover:bg-background"
                }`}
              >
                <p className="mb-2 font-medium">Other</p>
                <input
                  type="text"
                  placeholder="Describe your industry…"
                  value={otherIndustryText}
                  onChange={(e) => handleOtherIndustryChange(e.target.value)}
                  className={`w-full bg-transparent text-sm outline-none ${
                    otherSelected
                      ? "placeholder:text-background/50 text-background"
                      : "placeholder:text-muted"
                  }`}
                />
              </div>
            </li>
          </ul>
        )}

        {phase === "role" && selectedIndustry && (
          <ul
            className="mt-10 space-y-3"
            role="radiogroup"
            aria-label={`Select your role in ${selectedIndustry.industry}`}
          >
            {selectedIndustry.roles.map((role, index) => {
              const isSelected = selectedRoleIndex === index;
              return (
                <li key={role.role}>
                  <button
                    type="button"
                    onClick={() => handleSelectRole(index)}
                    className={`w-full rounded-md border-2 px-5 py-4 text-left text-sm transition-colors sm:text-base ${
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-surface text-foreground hover:border-muted hover:bg-background"
                    }`}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    {role.role}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {phase === "questions" && selectedIndustry && selectedRole && currentRoleQuestion && (
          <ul
            className="mt-10 space-y-3"
            role="radiogroup"
            aria-label={currentRoleQuestion.question}
          >
            {currentRoleQuestion.answers.map((option) => {
              const qid = makeQuestionId(selectedIndustry, selectedRole, currentRoleQuestion);
              const isSelected = selectedOptionByQuestion[qid] === option.text;
              return (
                <li key={option.text}>
                  <button
                    type="button"
                    onClick={() => handleSelectAnswer(option.text, option.score)}
                    className={`w-full rounded-md border-2 px-5 py-4 text-left text-sm transition-colors sm:text-base ${
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-surface text-foreground hover:border-muted hover:bg-background"
                    }`}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    {option.text}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-12 flex flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={phase === "industry"}
            className="rounded-md border-2 border-border bg-surface px-6 py-4 font-sans text-sm font-medium text-foreground transition-opacity hover:bg-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="rounded-md px-6 py-4 font-sans text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[160px]"
            style={{ backgroundColor: "var(--cta)" }}
          >
            {primaryButtonLabel}
          </button>
        </div>
      </div>
    </main>
  );
}

