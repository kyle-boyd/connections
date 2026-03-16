import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Profiler | Guild",
};

const steps = [
  {
    step: 1,
    title: "Take the survey",
    description:
      "An 8-question survey that takes about two minutes. Get a clear picture of how you use AI today and where you stand.",
    detail: "See where you land: AI-Curious, AI-Adopter, AI-Integrated, or AI-Native.",
    cta: "Start survey",
    href: "/survey",
    accent: "bg-accent/10 text-accent border-accent/30",
  },
  {
    step: 2,
    title: "Get your results",
    description:
      "Receive your AI proficiency level and specific resources tailored to help you level up—curated for your stage.",
    detail: "Actionable next steps and links to learn more, so you know exactly where to go from here.",
    cta: null,
    href: null,
    accent: "bg-accent/10 text-accent border-accent/30",
  },
  {
    step: 3,
    title: "Get connected (optional)",
    description:
      "Connect with people in your role a little ahead of you to accelerate your AI adoption and learn from those who've already done it. Also connect with people who can level up from you!",
    detail: null,
    cta: null,
    href: null,
    accent: "bg-accent/10 text-accent border-accent/30",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-serif">
      <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-16">
        {/* Hero */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-4xl">
            Find your AI proficiency level
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted">
            A short survey for UI/UX designers. See where you land and get resources and connections to level up.
          </p>
        </div>

        {/* Onboarding steps */}
        <div className="mt-16 w-full">
          <h2 className="mb-8 text-center font-display text-xl font-medium tracking-[-0.02em] text-foreground">
            How it works
          </h2>
          <ul className="grid grid-cols-3 gap-6">
            {steps.map((s) => (
              <li key={s.step}>
                <article
                  className={`h-full rounded-lg border border-border bg-surface p-6 transition-shadow hover:shadow-md ${s.accent}`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fill text-sm font-semibold text-white font-sans"
                        aria-hidden
                      >
                        {s.step}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-muted">
                      {s.description}
                    </p>
                    <p className="text-sm text-muted">
                      {s.detail}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link
              href="/survey"
              className="rounded-full px-6 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 font-sans"
              style={{ backgroundColor: 'var(--cta)' }}
            >
              Start survey
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
