"use server";

import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase";
import { buildConfirmationEmail } from "@/lib/emails/confirmation";

export type SubmitMatchState =
  | { success: true }
  | { success: false; error: string };

export async function submitMatch(formData: FormData): Promise<SubmitMatchState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const linkedin = formData.get("linkedin");
  const optedIn = formData.get("opted_in") === "on" || formData.get("opted_in") === "true";
  const proficiencyLevel = formData.get("proficiency_level");
  const stageScoresRaw = formData.get("stage_scores");
  const industry = formData.get("industry");
  const role = formData.get("role");

  if (!name || typeof name !== "string" || !name.trim()) {
    return { success: false, error: "Name is required." };
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    return { success: false, error: "Email is required." };
  }
  if (!optedIn) {
    return { success: false, error: "You must agree to connect with someone less proficient in exchange for access to someone more proficient." };
  }

  let stageScores: Record<string, number> | null = null;
  if (stageScoresRaw && typeof stageScoresRaw === "string") {
    try {
      const parsed = JSON.parse(stageScoresRaw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        stageScores = parsed as Record<string, number>;
      }
    } catch {
      // ignore invalid JSON
    }
  }

  const supabase = await createServerClient();
  const { error } = await supabase.from("matches").insert({
    name: name.trim(),
    email: email.trim(),
    linkedin: linkedin && typeof linkedin === "string" ? linkedin.trim() || null : null,
    proficiency_level: proficiencyLevel && typeof proficiencyLevel === "string" ? proficiencyLevel : null,
    stage_scores: stageScores,
    industry: industry && typeof industry === "string" ? industry : null,
    role: role && typeof role === "string" ? role : null,
    opted_in: optedIn,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Send confirmation email
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const { html, text } = buildConfirmationEmail({
        name: name.trim(),
        proficiencyLevel: typeof proficiencyLevel === "string" ? proficiencyLevel : "Curious",
        industry: typeof industry === "string" ? industry : null,
        role: typeof role === "string" ? role : null,
      });
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "AI Proficiency Network <onboarding@resend.dev>",
        to: email.trim(),
        subject: `You're on the list, ${name.trim()}`,
        html,
        text,
      });
    } catch {
      // Don't fail the signup if email sending fails
    }
  }

  return { success: true };
}
