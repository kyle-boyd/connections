"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { calculateResults } from "@/lib/calculateResults";
import type { CalculateResultsOutput, ProficiencyLabel } from "@/lib/calculateResults";
import { getStoredAnswers, getSurveyMetadata } from "@/lib/surveyStorage";

const LEVELS: ProficiencyLabel[] = ["Curious", "Adopter", "Integrated", "Native"];

const LEVEL_COPY: Record<ProficiencyLabel, string> = {
  Curious:
    "You're at the beginning of your AI journey. You're aware of the tools and curious how they might fit into your work. There's plenty of room to experiment when you're ready.",
  Adopter:
    "You've started weaving AI into your workflow. You use it for specific tasks—summaries, quick feedback, documentation—and you're building comfort with a few tools.",
  Integrated:
    "AI is part of your daily practice. You rely on it across key parts of your workflow and you've developed repeatable ways to get value from it.",
  Native:
    "You're ahead of the curve. You're testing tools early, shaping how your team or community uses AI, and your process has evolved around it.",
};

export default function ResultsPage() {
  useEffect(() => { document.title = "Your Results | Guild"; }, []);

  const [result, setResult] = useState<CalculateResultsOutput | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const recorded = useRef(false);

  const loadResults = useCallback(() => {
    const answers = getStoredAnswers();
    let calcResult: CalculateResultsOutput | null = null;
    if (!answers || answers.length === 0) {
      setResult(null);
    } else {
      calcResult = calculateResults(answers);
      setResult(calcResult);
    }

    const metadata = getSurveyMetadata();
    if (metadata) {
      setIndustry(metadata.industry);
      setRole(metadata.role);
    }

    setLoaded(true);

    // Record survey result once (even without contact info)
    if (calcResult && !recorded.current) {
      recorded.current = true;
      void fetch("/api/survey-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proficiency_level: calcResult.level,
          stage_scores: {
            averageScore: calcResult.averageScore,
            minScore: calcResult.minScore,
            maxScore: calcResult.maxScore,
          },
          industry: metadata?.industry ?? null,
          role: metadata?.role ?? null,
        }),
      });
    }
  }, []);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-2xl px-10 py-24 text-center">
          <p className="text-muted">Loading your results…</p>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-2xl px-10 py-24">
          <h1
            className="font-display font-extrabold leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 5rem)", letterSpacing: "-0.04em" }}
          >
            No results yet
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            Complete the survey to see your AI proficiency level.
          </p>
          <Link
            href="/survey"
            className="mt-8 inline-block rounded-md border border-foreground px-5 py-2.5 font-sans text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Take the survey
          </Link>
        </div>
      </main>
    );
  }

  const { level } = result;
  const copy = LEVEL_COPY[level];
  const currentLevelIndex = LEVELS.indexOf(level);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl flex-1 px-10 pb-16 pt-20">
        <p className="font-sans text-base text-foreground">Your AI personality:</p>

        <h1
          className="mt-1 font-display font-extrabold leading-[0.9]"
          style={{ fontSize: "clamp(4.5rem, 10vw, 6rem)", letterSpacing: "-0.04em" }}
        >
          AI-{level}
        </h1>

        {industry && role && (
          <p className="mt-3 font-sans text-lg text-foreground">
            {industry} · {role}
          </p>
        )}

        <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">{copy}</p>

        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
          Level up by joining our matching network to connect with others in your industry who are
          also leveling up their AI skills.
        </p>

        <div className="mt-12">
          <Link
            href="/match"
            className="inline-flex items-center gap-8 rounded-lg px-8 py-5 font-sans text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--cta)" }}
          >
            Join the matching network
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Level progression timeline */}
      <div className="mx-auto w-full max-w-2xl px-10 pb-14">
        <div className="relative flex items-start justify-between">
          {/* Horizontal connecting line at circle center */}
          <div
            className="absolute left-4 right-4 h-px"
            style={{ top: "1rem", backgroundColor: "var(--border)" }}
          />

          {LEVELS.map((lvl, i) => {
            const isActive = i === currentLevelIndex;
            return (
              <div key={lvl} className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className="h-8 w-8 rounded-full border-2"
                  style={{
                    backgroundColor: isActive ? "var(--cta)" : "var(--background)",
                    borderColor: isActive ? "var(--cta)" : "var(--border)",
                  }}
                />
                <span
                  className="font-display font-extrabold text-sm"
                  style={{
                    letterSpacing: "-0.02em",
                    color: isActive ? "var(--cta)" : "var(--muted)",
                  }}
                >
                  AI-{lvl}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
