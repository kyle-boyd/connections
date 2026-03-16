"use client";

import { useEffect } from "react";
import Link from "next/link";

const LINKEDIN_SHARE_URL =
  "https://www.linkedin.com/sharing/share-offsite/?url=" +
  encodeURIComponent("https://aiconnectorguild.com");

export default function ThankYouPage() {
  useEffect(() => { document.title = "Thank You | Guild"; }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-8">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-foreground">
          You're on the list.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Thanks for signing up. Check your email for a confirmation — we'll
          reach out when there's a match, and we won't email you again after
          that.
        </p>

        <div className="mt-10 rounded-lg border border-border bg-surface p-6 text-left">
          <p className="font-sans text-sm font-semibold text-foreground">
            Help us reach critical mass
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            This network only gets valuable when enough people join. If you
            think it's useful, we'd love for you to share it — directly with
            someone who'd benefit, or on LinkedIn.
          </p>
          <div className="mt-4 flex flex-col gap-2 font-sans text-sm">
            <a
              href={LINKEDIN_SHARE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--cta)" }}
            >
              Share on LinkedIn
            </a>
            <button
              onClick={() => {
                void navigator.clipboard.writeText("https://aiconnectorguild.com");
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-surface"
            >
              Copy link
            </button>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/survey"
            className="font-sans text-sm text-muted underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Retake the survey
          </Link>
        </div>
      </div>
    </main>
  );
}
