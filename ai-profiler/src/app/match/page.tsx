"use client";

import { useCallback, useEffect, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { calculateResults } from "@/lib/calculateResults";
import { getStoredAnswers, getSurveyMetadata } from "@/lib/surveyStorage";
import { submitMatch, type SubmitMatchState } from "@/lib/actions/match";

function MatchForm({
  proficiencyLevel,
  stageScores,
  industry,
  role,
}: {
  proficiencyLevel: string | null;
  stageScores: string | null;
  industry: string | null;
  role: string | null;
}) {
  const router = useRouter();
  const initialState: SubmitMatchState = { success: false, error: "" };
  const [state, formAction, isPending] = useActionState<SubmitMatchState, FormData>(
    async (_prev, formData) => submitMatch(formData),
    initialState
  );

  useEffect(() => {
    if (state.success === true) {
      router.push("/thankyou");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {proficiencyLevel && (
        <input type="hidden" name="proficiency_level" value={proficiencyLevel} />
      )}
      {stageScores && (
        <input type="hidden" name="stage_scores" value={stageScores} />
      )}
      {industry && (
        <input type="hidden" name="industry" value={industry} />
      )}
      {role && (
        <input type="hidden" name="role" value={role} />
      )}
      <div>
        <label htmlFor="name" className="block font-sans text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-1.5 w-full border border-border bg-surface px-3 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-sans text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 w-full border border-border bg-surface px-3 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>
      <div>
        <label htmlFor="linkedin" className="block font-sans text-sm font-medium text-foreground">
          LinkedIn URL <span className="text-muted">(optional)</span>
        </label>
        <input
          id="linkedin"
          name="linkedin"
          type="url"
          autoComplete="url"
          placeholder="https://linkedin.com/in/..."
          className="mt-1.5 w-full border border-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
        />
      </div>
      <div className="flex items-start gap-3">
        <input
          id="opted_in"
          name="opted_in"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-cta border-muted focus:ring-cta"
        />
        <label htmlFor="opted_in" className="text-sm text-foreground">
          I'm willing to connect with someone less proficient in exchange for
          access to someone more proficient.
        </label>
      </div>
      <p className="text-xs text-muted">
        We'll email you three times only: to confirm your sign-up, when we find
        a match, and one follow-up. That's it.
      </p>
      {state.success === false && state.error && (
        <p className="font-sans text-sm text-red-700">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-md px-6 py-3 font-sans text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: 'var(--cta)' }}
      >
        {isPending ? "Submitting…" : "Join the matching network"}
      </button>
    </form>
  );
}

export default function MatchPage() {
  useEffect(() => { document.title = "Find Your Match | Guild"; }, []);

  const [proficiencyLevel, setProficiencyLevel] = useState<string | null>(null);
  const [stageScores, setStageScores] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadFromStorage = useCallback(() => {
    const answers = getStoredAnswers();
    if (answers && answers.length > 0) {
      const result = calculateResults(answers);
      setProficiencyLevel(result.level);
      setStageScores(JSON.stringify({ averageScore: result.averageScore, minScore: result.minScore, maxScore: result.maxScore }));
    }
    const metadata = getSurveyMetadata();
    if (metadata) {
      setIndustry(metadata.industry);
      setRole(metadata.role);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background px-8 py-24">
        <div className="mx-auto max-w-xl">
          <p className="text-muted">Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-8 py-20">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl font-medium tracking-tight text-foreground">
          Join the matching network
        </h1>
        <p className="mt-4 max-w-lg text-muted">
          Share your details and we'll match you with designers at different
          stages of AI proficiency — so you can learn from someone ahead and help
          someone catching up.
        </p>
        <div className="mt-12">
          <MatchForm
            proficiencyLevel={proficiencyLevel}
            stageScores={stageScores}
            industry={industry}
            role={role}
          />
        </div>
      </div>
    </main>
  );
}
