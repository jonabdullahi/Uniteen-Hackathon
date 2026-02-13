import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import {
  FALLBACK_SUBJECTS,
  buildQuiz,
  splitSubjects,
  uniqueSubjects,
} from "@/lib/ai-quiz";

export default function AiQuizTake() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("subjects") || "";
    const subjects = uniqueSubjects(splitSubjects(fromQuery));
    return buildQuiz(subjects.length ? subjects : FALLBACK_SUBJECTS);
  }, []);

  const totalAnswered = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];
  const answeredCurrent = answers[currentQuestion.id] !== undefined;

  const correctCount = questions.reduce((acc, question) => {
    return answers[question.id] === question.answerIndex ? acc + 1 : acc;
  }, 0);

  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  const subjectBreakdown = questions.reduce<Record<string, { total: number; correct: number }>>(
    (acc, question) => {
      if (!acc[question.subject]) {
        acc[question.subject] = { total: 0, correct: 0 };
      }
      acc[question.subject].total += 1;
      if (answers[question.id] === question.answerIndex) {
        acc[question.subject].correct += 1;
      }
      return acc;
    },
    {}
  );

  const weakSubjects = Object.entries(subjectBreakdown)
    .filter(([, stats]) => stats.correct < stats.total)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .map(([subject]) => subject);

  const overallFeedback =
    score >= 85
      ? "Excellent work. Your answers show strong understanding and consistency."
      : score >= 65
      ? "Good effort. You have solid foundations with a few target areas to strengthen."
      : "Nice attempt. You are building momentum, and focused practice will raise your results quickly.";

  const nextStepTips =
    weakSubjects.length === 0
      ? [
          "Increase challenge by doing timed mixed-topic sets.",
          "Teach one concept to a friend to lock in understanding.",
          "Review mistakes weekly to keep your performance stable.",
        ]
      : weakSubjects.slice(0, 3).map((subject) => {
          return `For ${subject}: do 15-20 minutes of active recall, then solve 5 focused practice questions and review every mistake.`;
        });

  const handleNext = () => {
    if (!answeredCurrent) return;
    if (isLastQuestion) {
      setFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <Layout>
      <header className="mb-8">
        <Link href="/ai-quiz">
          <Button variant="ghost" className="mb-3 text-[#005b96]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz Setup
          </Button>
        </Link>
        <h1 className="text-3xl font-display font-bold text-[#011f4b]">Complete Your Quiz</h1>
        <p className="text-gray-500 mt-2">Answer all questions, then submit to see your score.</p>
      </header>

      <Card className="border-0 shadow-md mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 mb-5" />

          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="font-semibold text-[#011f4b]">{currentQuestion.prompt}</h2>
              <Badge variant="secondary" className="bg-[#b3cde0]/30 text-[#03396c]">
                {currentQuestion.subject}
              </Badge>
            </div>

            <RadioGroup
              value={answers[currentQuestion.id]?.toString()}
              onValueChange={(value) =>
                setAnswers((prev) => ({ ...prev, [currentQuestion.id]: Number(value) }))
              }
              className="space-y-3"
              disabled={finished}
            >
              {currentQuestion.options.map((option, optionIndex) => {
                const optionValue = optionIndex.toString();

                return (
                  <div
                    key={optionValue}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 transition-colors hover:border-blue-200"
                  >
                    <RadioGroupItem value={optionValue} id={`${currentQuestion.id}-opt-${optionValue}`} />
                    <Label
                      htmlFor={`${currentQuestion.id}-opt-${optionValue}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </motion.div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button type="button" variant="outline" onClick={handleBack} disabled={currentIndex === 0 || finished}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <p className="text-sm text-gray-500">
              {totalAnswered}/{questions.length} questions answered
            </p>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!answeredCurrent || finished}
              className="bg-[#005b96] hover:bg-[#03396c]"
            >
              {isLastQuestion ? "Finish Quiz" : "Next"}
              {isLastQuestion ? <Check className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {finished && (
        <Card className="mt-6 border-0 shadow-md bg-[#b3cde0]/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-[#011f4b]">Quiz Result: {score}%</h3>
            <p className="text-gray-700 mt-2 mb-4">
              You answered {correctCount} out of {questions.length} correctly.
            </p>
            <p className="text-[#03396c] font-medium mb-3">{overallFeedback}</p>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#011f4b]">How to improve:</p>
              {nextStepTips.map((tip) => (
                <p key={tip} className="text-sm text-gray-700">- {tip}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}
