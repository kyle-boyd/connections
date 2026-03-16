import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { proficiency_level, stage_scores, industry, role } = body as Record<string, unknown>;

    const supabase = await createServerClient();
    const { error } = await supabase.from("survey_results").insert({
      proficiency_level: typeof proficiency_level === "string" ? proficiency_level : null,
      stage_scores: stage_scores && typeof stage_scores === "object" ? stage_scores : null,
      industry: typeof industry === "string" ? industry : null,
      role: typeof role === "string" ? role : null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
