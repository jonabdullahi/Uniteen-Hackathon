export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    text: "When facing a difficult math problem, what is your first instinct?",
    options: [
      "Look for a similar example in the textbook",
      "Draw a diagram to visualize it",
      "Ask a friend or teacher immediately",
      "Try to break it down into smaller parts on my own",
    ],
  },
  {
    id: 2,
    text: "How do you typically prepare for a history exam?",
    options: [
      "Memorize dates and names using flashcards",
      "Create a timeline of events",
      "Read the chapters again",
      "Discuss the events with a study group",
    ],
  },
  {
    id: 3,
    text: "Which environment helps you focus best?",
    options: [
      "Complete silence in a library",
      "Coffee shop with background noise",
      "My room with music playing",
      "Outdoors in nature",
    ],
  },
  {
    id: 4,
    text: "When reading a complex text, you usually...",
    options: [
      "Highlight almost everything",
      "Take notes in the margins",
      "Summarize each paragraph in my head",
      "Read it out loud",
    ],
  },
  {
    id: 5,
    text: "What motivates you most to study?",
    options: [
      "Getting good grades",
      "Understanding how things work",
      "Competitive spirit",
      "Fear of falling behind",
    ],
  },
];

export const FALLBACK_PLAN = {
  weeklyGoals: [
    "Complete 3 math practice sets",
    "Review history timeline for Chapter 4",
    "Spend 20 mins daily on active recall",
  ],
  recommendedMethod: "Pomodoro Technique (25m work / 5m break)",
  practiceBlocks: [
    { subject: "Mathematics", duration: "45 mins", task: "Calculus Limits - Practice Set A" },
    { subject: "History", duration: "30 mins", task: "WWII Timeline Construction" },
    { subject: "Physics", duration: "45 mins", task: "Force Diagrams Review" },
  ],
};
