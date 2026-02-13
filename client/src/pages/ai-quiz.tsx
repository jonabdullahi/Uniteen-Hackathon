import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { FALLBACK_SUBJECTS, splitSubjects, uniqueSubjects } from "@/lib/ai-quiz";

export default function AiQuiz() {
  const initialSurvey = useStore((state) => state.initialSurvey);
  const [, setLocation] = useLocation();

  const defaultSubjects = useMemo(() => {
    const surveySubjects = [
      ...splitSubjects(initialSurvey?.favoriteSubjects || ""),
      ...splitSubjects(initialSurvey?.weakSubjects || ""),
    ];
    const subjects = uniqueSubjects(surveySubjects);
    return subjects.length ? subjects : FALLBACK_SUBJECTS;
  }, [initialSurvey]);

  const [subjectInput, setSubjectInput] = useState(defaultSubjects.join(", "));
  const selectedSubjects = uniqueSubjects(splitSubjects(subjectInput));
  const activeSubjects = selectedSubjects.length ? selectedSubjects : FALLBACK_SUBJECTS;

  const handleStartQuiz = () => {
    const subjects = uniqueSubjects(splitSubjects(subjectInput));
    const params = new URLSearchParams({
      subjects: (subjects.length ? subjects : FALLBACK_SUBJECTS).join(","),
    });
    setLocation(`/ai-quiz/take?${params.toString()}`);
  };

  return (
    <Layout>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#6497b1]">Personalized Practice</p>
        <h1 className="text-3xl font-display font-bold text-[#011f4b] mt-2">AI Subject Quiz</h1>
        <p className="text-gray-500 mt-2">
          Generate a quiz from your subjects and get instant feedback.
        </p>
      </header>

      <Card className="mb-6 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#011f4b]">
            <Brain className="h-5 w-5 text-[#005b96]" />
            Quiz Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects (comma-separated)</Label>
            <Input
              id="subjects"
              value={subjectInput}
              onChange={(event) => setSubjectInput(event.target.value)}
              placeholder="Math, Biology, History"
              className="bg-white border-slate-200"
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-medium text-[#011f4b] mb-2">Subjects in this quiz</p>
            <div className="flex flex-wrap gap-2">
              {activeSubjects.map((subject) => (
                <Badge
                  key={subject}
                  variant="secondary"
                  className="bg-[#b3cde0]/40 text-[#03396c] hover:bg-[#b3cde0]/60"
                >
                  {subject}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              You will get 6 adaptive questions with instant scoring and improvement feedback.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-3 bg-white">
              <p className="text-xs uppercase tracking-wide text-[#6497b1]">Quiz Format</p>
              <p className="text-sm text-gray-700 mt-1">One question at a time, like your survey flow.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 bg-white">
              <p className="text-xs uppercase tracking-wide text-[#6497b1]">Goal</p>
              <p className="text-sm text-gray-700 mt-1">Identify weak topics and get clear next study steps.</p>
            </div>
          </div>
          <Button onClick={handleStartQuiz} className="bg-[#005b96] hover:bg-[#03396c]">
            <Sparkles className="h-4 w-4 mr-2" />
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    </Layout>
  );
}
