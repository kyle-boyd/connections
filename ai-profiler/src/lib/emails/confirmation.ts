function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

type ProficiencyLabel = "Curious" | "Adopter" | "Integrated" | "Native";

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

export function buildConfirmationEmail({
  name,
  proficiencyLevel,
  industry,
  role,
}: {
  name: string;
  proficiencyLevel: string;
  industry: string | null;
  role: string | null;
}) {
  const levelCopy = LEVEL_COPY[proficiencyLevel as ProficiencyLabel] ?? "";
  const safeName = escapeHtml(name);
  const safeLevel = escapeHtml(proficiencyLevel);
  const scorecardLine =
    industry && role
      ? `${escapeHtml(industry)} &middot; ${escapeHtml(role)}`
      : industry ? escapeHtml(industry) : role ? escapeHtml(role) : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the list</title>
</head>
<body style="margin:0;padding:0;background:#f5f2eb;font-family:Georgia,serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2eb;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fdfcf9;border:1px solid #d4cfc7;border-radius:12px;padding:48px;">
          <tr>
            <td>
              <!-- Header -->
              <p style="margin:0 0 32px;font-family:Georgia,serif;font-size:14px;color:#6b6560;">
                AI Proficiency Network
              </p>

              <!-- Greeting -->
              <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:28px;font-weight:700;letter-spacing:-0.03em;color:#1a1a1a;">
                You're on the list, ${safeName}.
              </h1>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.6;color:#6b6560;">
                Thanks for joining the matching network. Here's a summary of where you stand.
              </p>

              <!-- Scorecard -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2eb;border:1px solid #d4cfc7;border-radius:8px;padding:24px;margin-bottom:32px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:12px;color:#6b6560;text-transform:uppercase;letter-spacing:0.08em;">Your AI personality</p>
                    <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:36px;font-weight:800;letter-spacing:-0.04em;color:#53776C;line-height:1;">
                      AI-${safeLevel}
                    </p>
                    ${scorecardLine ? `<p style="margin:0 0 16px;font-size:14px;color:#6b6560;">${scorecardLine}</p>` : ""}
                    ${levelCopy ? `<p style="margin:0;font-size:15px;line-height:1.6;color:#1a1a1a;">${levelCopy}</p>` : ""}
                  </td>
                </tr>
              </table>

              <!-- What happens next -->
              <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:18px;font-weight:700;color:#1a1a1a;">What happens next</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#6b6560;">
                When we find a good match for you — someone a step ahead in your role, and someone you can help level up — we'll reach out with an introduction. That's it.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#6b6560;">
                We'll only ever email you three times: this confirmation, a match introduction if we find one, and one follow-up. Nothing else.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #d4cfc7;margin:0 0 24px;" />

              <!-- Footer -->
              <p style="margin:0;font-size:13px;color:#6b6560;line-height:1.5;">
                You received this because you signed up at the AI Proficiency Network.<br />
                If this wasn't you, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `You're on the list, ${name}.

Thanks for joining the matching network.

YOUR SCORECARD
AI-${proficiencyLevel}${scorecardLine ? `\n${scorecardLine.replace("&middot;", "·")}` : ""}
${levelCopy}

WHAT HAPPENS NEXT
When we find a good match for you — someone a step ahead in your role, and someone you can help level up — we'll reach out with an introduction.

We'll only ever email you three times: this confirmation, a match introduction if we find one, and one follow-up. Nothing else.`;

  return { html, text };
}
