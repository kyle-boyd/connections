import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const VALID_PROFICIENCY_LEVELS = new Set(["Curious", "Adopter", "Integrated", "Native"]);
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = (await req.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { proficiency_level, stage_scores, industry, role } = body as Record<string, unknown>;

    const safeLevel =
      typeof proficiency_level === "string" && VALID_PROFICIENCY_LEVELS.has(proficiency_level)
        ? proficiency_level
        : null;
    const safeIndustry =
      typeof industry === "string" ? industry.slice(0, 200) : null;
    const safeRole =
      typeof role === "string" ? role.slice(0, 200) : null;
    const safeScores =
      stage_scores && typeof stage_scores === "object" && !Array.isArray(stage_scores)
        ? stage_scores
        : null;

    const supabase = await createServerClient();
    const { error } = await supabase.from("survey_results").insert({
      proficiency_level: safeLevel,
      stage_scores: safeScores,
      industry: safeIndustry,
      role: safeRole,
    });

    if (error) {
      console.error("survey_results insert error:", error.message);
      return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
