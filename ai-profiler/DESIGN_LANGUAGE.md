# Design Language: Warm, Renaissance-Inspired

This app uses a warm, Renaissance-inspired visual system. All UI should use the semantic tokens below so the look stays cohesive and theme changes only require editing `globals.css`.

## Intent

- **Warmth:** Cream and charcoal bases; gold/sepia and terracotta accents.
- **Renaissance:** Elegant serif typography, generous spacing, subtle borders, optional decorative touches (dots, dividers).
- **Clarity:** Clean sans for labels and UI chrome; serif for headlines and body.

## Color Tokens

| Token        | Usage |
|-------------|--------|
| `background` | Page and section backgrounds. |
| `foreground` | Primary text. |
| `surface`   | Cards, inputs, raised panels. |
| `border`    | Dividers, input borders, card outlines. |
| `muted`     | Secondary text, captions, hints. |
| `accent`    | Emphasis, navigation highlights, progress fill, optional badges. |
| `cta`       | Primary actions only (e.g. “Start survey”, “Join the matching network”). |
| `fill`      | Progress bars, active states (when not using accent). |

Use Tailwind classes like `bg-background`, `text-foreground`, `text-muted`, `bg-cta`, `border-border`, `bg-surface`, etc. Do not use raw hex or unrelated palettes (e.g. zinc, amber) for core UI.

## Typography

| Role     | CSS variable   | Use for |
|----------|----------------|--------|
| Display  | `--font-display` | Hero titles and key headlines (e.g. “Find your AI proficiency level”, “AI-{level}”). |
| Serif    | `--font-serif`   | Body copy and subheads. Default on `body`. |
| Sans     | `--font-sans`    | Labels, buttons, nav, small UI text. |

Apply with `font-display`, `font-serif`, and `font-sans` in Tailwind. Prefer one serif (different weights/sizes) for display and body for a cohesive Renaissance feel.

## Radius

- `radius-sm` – Small elements (e.g. badges, tags).
- `radius-md` – Cards, inputs, secondary buttons.
- `radius-pill` – Primary CTAs (pill-shaped buttons).

Use `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-pill` (or equivalent theme keys) for consistency.

## Do’s

- Generous spacing; avoid cramped layouts.
- Serif for headlines and body; sans for UI chrome.
- Warm neutrals and semantic tokens everywhere.
- Primary CTAs in `cta` (terracotta) with light text.

## Don’ts

- Cold grays or unrelated Tailwind palettes for core UI.
- Harsh contrast or flat, unstyled buttons.
- Raw hex colors in components; use tokens so dark/light theme works from one place.

## Dark mode

Tokens switch automatically with `prefers-color-scheme: dark`. All four pages use the same tokens so no per-page theme logic is needed.
