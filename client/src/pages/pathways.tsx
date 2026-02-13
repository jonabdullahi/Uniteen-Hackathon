import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bot, FileText, Route, ShieldCheck, Sparkles } from "lucide-react";

type QuizQuestion = {
  id: string;
  focus: string;
  prompt: string;
  options: string[];
  answerIndex: number;
};

function splitCsv(value?: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function withThreeItems(items: string[], fallback: string[]): string[] {
  const normalized = Array.from(new Set(items));
  const combined = [...normalized, ...fallback.filter((item) => !normalized.includes(item))];
  return combined.slice(0, 3);
}

function createQuiz(topic: string): QuizQuestion[] {
  return [
    {
      id: "core",
      focus: "Core concept",
      prompt: `What is the best definition of ${topic}?`,
      options: [
        "A fixed list of facts to memorize one time.",
        "A concept you can explain, apply, and adapt in new situations.",
        "A topic that only matters in exams.",
        "A skill used only in one subject.",
      ],
      answerIndex: 1,
    },
    {
      id: "apply",
      focus: "Application",
      prompt: `How should you apply ${topic} when solving new problems?`,
      options: [
        "Use one memorized template without checking context.",
        "Skip steps and guess to save time.",
        "Break the problem down and test the concept step by step.",
        "Wait until someone gives the full answer.",
      ],
      answerIndex: 2,
    },
    {
      id: "reflect",
      focus: "Self-check",
      prompt: `After practicing ${topic}, what is the most useful review habit?`,
      options: [
        "Log mistakes and rewrite one improved method.",
        "Move on immediately without checking errors.",
        "Re-read notes only once and stop.",
        "Avoid difficult questions.",
      ],
      answerIndex: 0,
    },
  ];
}

export default function Pathways() {
  const { initialSurvey, studyPlan, userSettings, updateUserSettings } = useStore();
  const [topic, setTopic] = useState("Algebra");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const pathways = useMemo(() => {
    const favorites = splitCsv(initialSurvey?.favoriteSubjects);
    const interests = splitCsv(initialSurvey?.interests);

    const nextCourses = withThreeItems(
      favorites.map((subject) => `${subject} Foundations`),
      ["Academic Writing Essentials", "Data Basics for Students", "Public Speaking Lab"]
    );
    const projectTracks = withThreeItems(
      interests.map((interest) => `${interest} Showcase Project`),
      ["Community Problem-Solving Project", "Personal Learning Blog", "Mini Research Portfolio"]
    );
    const careerSteps = withThreeItems(
      interests.map((interest) => `${interest} Career Exploration`),
      ["Education Technology", "Data and Analytics", "Digital Product Design"]
    );

    return { nextCourses, projectTracks, careerSteps };
  }, [initialSurvey]);

  const portfolioItems = useMemo(() => {
    const fromStudyPlan = (studyPlan?.practiceBlocks || []).map((block) => ({
      title: `${block.subject}: ${block.task}`,
      type: "Project Evidence",
      impact: `Completed focused ${block.duration} practice with reflection notes.`,
    }));
    const fallback = [
      {
        title: "Learning Reflection Journal",
        type: "Writing Sample",
        impact: "Weekly reflection on what improved and what to practice next.",
      },
      {
        title: "Skill Growth Snapshot",
        type: "Progress Report",
        impact: "Tracked consistency, streak, and method feedback over time.",
      },
      {
        title: "Capstone Outline",
        type: "Project Plan",
        impact: "Defined a real problem, timeline, and success metrics.",
      },
    ];

    return [...fromStudyPlan, ...fallback].slice(0, 3);
  }, [studyPlan]);

  const quiz = useMemo(() => createQuiz(topic.trim() || "this topic"), [topic]);
  const score = quiz.reduce((acc, question) => (answers[question.id] === question.answerIndex ? acc + 1 : acc), 0);
  const allQuizAnswered = quiz.every((question) => answers[question.id] !== undefined);

  const weakAreas = useMemo(() => {
    const fromQuiz = quiz
      .filter((question) => showResults && answers[question.id] !== question.answerIndex)
      .map((question) => question.focus);
    const fromSurvey = splitCsv(initialSurvey?.weakSubjects);
    return withThreeItems(fromQuiz.length ? fromQuiz : fromSurvey, [
      "Core concept clarity",
      "Application practice",
      "Review and reflection",
    ]);
  }, [answers, initialSurvey, quiz, showResults]);

  const explanationByLevel: Record<typeof level, string> = {
    Beginner: `Start with a plain-language explanation of ${topic}. Focus on one key rule and one small example.`,
    Intermediate: `Break ${topic} into steps and compare two problem types. Explain why each step works.`,
    Advanced: `Connect ${topic} to edge cases and tradeoffs. Analyze where the method can fail and how to recover.`,
  };

  const exportPortfolio = () => {
    const lines = [
      `EduBridge Portfolio Snapshot`,
      `Topic Focus: ${topic}`,
      `Created: ${new Date().toISOString()}`,
      "",
      "Highlights:",
      ...portfolioItems.map((item, index) => `${index + 1}. ${item.title} (${item.type}) - ${item.impact}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "edubridge-portfolio.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#6497b1]">Smart Pathways</p>
        <h1 className="text-3xl font-display font-bold text-[#011f4b] mt-2">Pathways Studio</h1>
        <p className="text-gray-500 mt-2">
          Personalized recommendations, portfolio building, AI study support, and safety settings.
        </p>
      </header>

      <div className="grid gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#011f4b]">
              <Route className="h-5 w-5 text-[#005b96]" />
              Personalized Pathway Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs uppercase tracking-wide text-[#6497b1] mb-2">Next Courses</p>
              {pathways.nextCourses.map((course) => (
                <p key={course} className="text-sm text-slate-700 mb-2">{course}</p>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs uppercase tracking-wide text-[#6497b1] mb-2">Project Tracks</p>
              {pathways.projectTracks.map((project) => (
                <p key={project} className="text-sm text-slate-700 mb-2">{project}</p>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs uppercase tracking-wide text-[#6497b1] mb-2">Career Directions</p>
              {pathways.careerSteps.map((career) => (
                <p key={career} className="text-sm text-slate-700 mb-2">{career}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#011f4b]">
              <FileText className="h-5 w-5 text-[#005b96]" />
              Portfolio Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              {portfolioItems.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <p className="text-xs uppercase tracking-wide text-[#6497b1]">{item.type}</p>
                  <p className="font-medium text-[#011f4b] mt-1">{item.title}</p>
                  <p className="text-sm text-slate-600 mt-2">{item.impact}</p>
                </div>
              ))}
            </div>
            <Button className="bg-[#005b96] hover:bg-[#03396c]" onClick={exportPortfolio}>
              Export Portfolio Snapshot
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#011f4b]">
              <Bot className="h-5 w-5 text-[#005b96]" />
              AI Study Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input id="topic" value={topic} onChange={(event) => setTopic(event.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label>Explain Level</Label>
                <div className="flex gap-2 mt-2">
                  {(["Beginner", "Intermediate", "Advanced"] as const).map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={level === option ? "default" : "outline"}
                      className={level === option ? "bg-[#005b96] hover:bg-[#03396c]" : ""}
                      onClick={() => setLevel(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs uppercase tracking-wide text-[#6497b1]">Concept Explanation</p>
              <p className="text-sm text-slate-700 mt-2">{explanationByLevel[level]}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {quiz.map((question) => (
                <div key={question.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-[#6497b1] mb-2">{question.focus}</p>
                  <p className="text-sm font-medium text-[#011f4b] mb-2">{question.prompt}</p>
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <label key={`${question.id}-${index}`} className="flex items-start gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name={question.id}
                          checked={answers[question.id] === index}
                          onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: index }))}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className="bg-[#005b96] hover:bg-[#03396c]"
                disabled={!allQuizAnswered}
                onClick={() => setShowResults(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Check Quiz
              </Button>
              {!allQuizAnswered && <p className="text-sm text-red-500">Answer all 3 questions before checking.</p>}
              {showResults && (
                <p className="text-sm text-slate-700">
                  Score: <span className="font-semibold">{score}/3</span>
                </p>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-[#6497b1] mb-2">Top 3 Weak Areas</p>
              <div className="flex flex-wrap gap-2">
                {weakAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="bg-[#b3cde0]/40 text-[#03396c]">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#011f4b]">
              <ShieldCheck className="h-5 w-5 text-[#005b96]" />
              Trust, Safety, and Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-4 bg-white">
              <div className="flex items-center justify-between">
                <Label htmlFor="privacy-mode">Privacy Mode</Label>
                <Switch
                  id="privacy-mode"
                  checked={userSettings?.privacyMode ?? false}
                  onCheckedChange={(checked) => updateUserSettings({ privacyMode: checked })}
                />
              </div>
              <p className="text-xs text-slate-600 mt-2">Hides student identity on the sidebar profile card.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-white">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast">High Contrast</Label>
                <Switch
                  id="high-contrast"
                  checked={userSettings?.highContrast ?? false}
                  onCheckedChange={(checked) => updateUserSettings({ highContrast: checked })}
                />
              </div>
              <p className="text-xs text-slate-600 mt-2">Boosts contrast for easier reading.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-white">
              <p className="text-sm font-medium text-[#011f4b] mb-2">Reading Options</p>
              <div className="flex gap-2 mb-2">
                <Button
                  size="sm"
                  variant={userSettings?.textScale === "normal" ? "default" : "outline"}
                  className={userSettings?.textScale === "normal" ? "bg-[#005b96] hover:bg-[#03396c]" : ""}
                  onClick={() => updateUserSettings({ textScale: "normal" })}
                >
                  Normal
                </Button>
                <Button
                  size="sm"
                  variant={userSettings?.textScale === "large" ? "default" : "outline"}
                  className={userSettings?.textScale === "large" ? "bg-[#005b96] hover:bg-[#03396c]" : ""}
                  onClick={() => updateUserSettings({ textScale: "large" })}
                >
                  Large
                </Button>
              </div>
              <Label htmlFor="language" className="text-xs text-slate-600">Language</Label>
              <select
                id="language"
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={userSettings?.language ?? "English"}
                onChange={(event) =>
                  updateUserSettings({ language: event.target.value as "English" | "French" | "Spanish" })
                }
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
