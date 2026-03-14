export type ProficiencyLevel = 1 | 2 | 3 | 4;

export interface AnswerOption {
  label: string;
  text: string;
  score: ProficiencyLevel;
}

export interface Question {
  id: string;
  questionText: string;
  options: AnswerOption[];
}

export const PROFICIENCY_LABELS: Record<ProficiencyLevel, string> = {
  1: "AI-Curious",
  2: "AI-Adopter",
  3: "AI-Integrated",
  4: "AI-Native",
};

export const questions: Question[] = [
  {
    id: "q1",
    questionText: "What best describes your role?",
    options: [
      { label: "UX Designer", text: "UX Designer", score: 1 },
      { label: "UI Designer", text: "UI Designer", score: 1 },
      { label: "Product Designer", text: "Product Designer (UX + UI)", score: 1 },
      { label: "Design Lead / Manager / Other", text: "Design Lead / Manager / Other", score: 1 },
    ],
  },
  {
    id: "q2",
    questionText: "What best describes your work environment?",
    options: [
      { label: "Customer / Retail", text: "Customer / Retail", score: 1 },
      { label: "Enterprise", text: "Enterprise", score: 1 },
      { label: "Agency", text: "Agency", score: 1 },
      { label: "Startup", text: "Startup", score: 1 },
    ],
  },
  {
    id: "q3",
    questionText: "When a new project kicks off, how do you handle discovery and competitive research?",
    options: [
      { label: "Curious", text: "I do it manually — browsing, screenshotting, taking notes", score: 1 },
      { label: "Adopter", text: "I use AI to summarize findings or help write up a brief", score: 2 },
      { label: "Integrated", text: "I use AI throughout — generating landscape overviews, spotting patterns, structuring insights", score: 3 },
      { label: "Native", text: "I've built or use an automated workflow that pulls and synthesizes competitive research for me", score: 4 },
    ],
  },
  {
    id: "q4",
    questionText: "When exploring concepts and directions early on, what does that look like?",
    options: [
      { label: "Curious", text: "Sketching, moodboards, references — mostly manual", score: 1 },
      { label: "Adopter", text: "I'll ask Claude or ChatGPT to suggest directions or critique an idea", score: 2 },
      { label: "Integrated", text: "AI is part of my ideation loop — generating, reacting, pushing directions fast", score: 3 },
      { label: "Native", text: "I use AI to generate multiple full concepts quickly and use them as real starting points", score: 4 },
    ],
  },
  {
    id: "q5",
    questionText: "How do wireframes and flows get made in your process?",
    options: [
      { label: "Curious", text: "I build them from scratch in Figma or on paper", score: 1 },
      { label: "Adopter", text: "I use AI for content, copy, or structure — but I'm still building in Figma", score: 2 },
      { label: "Integrated", text: "I use AI tools to generate layout options or flows that I then refine", score: 3 },
      { label: "Native", text: "I'm bypassing traditional wireframing — going straight to code-based prototypes or AI-generated screens", score: 4 },
    ],
  },
  {
    id: "q6",
    questionText: "When you need feedback on a design, what do you do?",
    options: [
      { label: "Curious", text: "I share with teammates or a lead and wait for a review", score: 1 },
      { label: "Adopter", text: "I'll paste a screenshot into Claude or Figma AI for a quick gut check", score: 2 },
      { label: "Integrated", text: "I regularly prompt AI with context — user goals, constraints — to get specific, useful critique", score: 3 },
      { label: "Native", text: "I have a repeatable prompt system or workflow that gives me structured design feedback on demand", score: 4 },
    ],
  },
  {
    id: "q7",
    questionText: "How do you handle design-to-development handoff and documentation?",
    options: [
      { label: "Curious", text: "I write specs, annotate Figma files, and communicate manually", score: 1 },
      { label: "Adopter", text: "I use AI to help write or clean up documentation", score: 2 },
      { label: "Integrated", text: "I use AI to generate component specs, copy, or handoff notes as part of my regular process", score: 3 },
      { label: "Native", text: "I'm working in tools or workflows where design and code are closer together — AI reduces the handoff gap significantly", score: 4 },
    ],
  },
  {
    id: "q8",
    questionText: "How do you stay current with AI tools relevant to design?",
    options: [
      { label: "Curious", text: "I hear about things when they come up", score: 1 },
      { label: "Adopter", text: "I follow the space and try things when something looks useful", score: 2 },
      { label: "Integrated", text: "I experiment regularly and have a go-to set of tools that changed how I work", score: 3 },
      { label: "Native", text: "I'm testing new tools before most people, sharing what works, and shaping how my team or community uses them", score: 4 },
    ],
  },
];
