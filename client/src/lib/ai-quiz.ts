export type QuizQuestion = {
  id: string;
  subject: string;
  prompt: string;
  options: string[];
  answerIndex: number;
};

export const FALLBACK_SUBJECTS = ["Mathematics", "Science", "English"];

const SUBJECT_PROMPTS = [
  {
    prompt: (subject: string) => `In ${subject}, what should you do first when a question looks difficult?`,
    options: [
      "Skip it immediately",
      "Break it into smaller parts",
      "Memorize random facts",
      "Copy someone else's answer",
    ],
    answerIndex: 1,
  },
  {
    prompt: (subject: string) => `Which study method is best for long-term success in ${subject}?`,
    options: [
      "One long cram session",
      "Active recall and spaced review",
      "Reading notes once",
      "Only watching videos at 2x speed",
    ],
    answerIndex: 1,
  },
  {
    prompt: (subject: string) => `What is the most useful way to check your understanding in ${subject}?`,
    options: [
      "Explain the concept in your own words",
      "Highlight every sentence",
      "Rewriting the title many times",
      "Avoiding practice questions",
    ],
    answerIndex: 0,
  },
  {
    prompt: (subject: string) => `Before an exam in ${subject}, which strategy helps most?`,
    options: [
      "Review mistakes from past practice",
      "Study only what feels easy",
      "Sleep less to get extra time",
      "Start new topics the night before",
    ],
    answerIndex: 0,
  },
  {
    prompt: (subject: string) => `When learning ${subject}, which habit improves accuracy the fastest?`,
    options: [
      "Trying timed practice with feedback",
      "Ignoring wrong answers",
      "Only doing multiple-choice questions",
      "Studying without breaks",
    ],
    answerIndex: 0,
  },
  {
    prompt: (subject: string) => `For ${subject}, which action best builds confidence over time?`,
    options: [
      "Set a small daily target and track progress",
      "Study only when you feel motivated",
      "Compare yourself constantly with others",
      "Stop after one mistake",
    ],
    answerIndex: 0,
  },
];

export function splitSubjects(text: string): string[] {
  return text
    .split(/[,\n/]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function normalizeSubject(subject: string): string {
  return subject
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function uniqueSubjects(input: string[]): string[] {
  return Array.from(new Set(input.map(normalizeSubject).filter(Boolean)));
}

export function buildQuiz(subjects: string[]): QuizQuestion[] {
  const pool = subjects.length ? subjects : FALLBACK_SUBJECTS;

  return SUBJECT_PROMPTS.map((template, index) => {
    const subject = pool[index % pool.length];
    return {
      id: `q-${index + 1}`,
      subject,
      prompt: template.prompt(subject),
      options: template.options,
      answerIndex: template.answerIndex,
    };
  });
}
