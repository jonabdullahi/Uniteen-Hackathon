import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { Screen } from "../components/Screen";
import { SecondaryButton } from "../components/SecondaryButton";
import { buildQuiz, FALLBACK_SUBJECTS } from "../lib/aiQuiz";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "AIQuizTake">;

export function AIQuizTakeScreen({ navigation, route }: Props) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [finished, setFinished] = React.useState(false);

  const questions = React.useMemo(() => buildQuiz(route.params.subjects.length ? route.params.subjects : FALLBACK_SUBJECTS), [route.params.subjects]);
  const currentQuestion = questions[currentIndex];
  const answeredCurrent = answers[currentQuestion.id] !== undefined;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const correctCount = questions.reduce((acc, question) => (answers[question.id] === question.answerIndex ? acc + 1 : acc), 0);
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Complete Your Quiz</Text>
        <Text style={styles.meta}>Question {currentIndex + 1} of {questions.length}</Text>
        <ProgressBar value={progress} />
        <Text style={styles.subject}>{currentQuestion.subject}</Text>
        <Text style={styles.question}>{currentQuestion.prompt}</Text>
        <View style={styles.choiceWrap}>
          {currentQuestion.options.map((option, index) => (
            <ChoiceChip key={option} selected={answers[currentQuestion.id] === index} onPress={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: index }))}>
              {option}
            </ChoiceChip>
          ))}
        </View>
        <View style={styles.footer}>
          <SecondaryButton onPress={() => (currentIndex > 0 ? setCurrentIndex((prev) => prev - 1) : navigation.goBack())}>Back</SecondaryButton>
          <PrimaryButton
            onPress={() => {
              if (!answeredCurrent) return;
              if (isLastQuestion) setFinished(true);
              else setCurrentIndex((prev) => prev + 1);
            }}
            disabled={!answeredCurrent || finished}
          >
            {isLastQuestion ? "Finish Quiz" : "Next"}
          </PrimaryButton>
        </View>
      </Card>
      {finished && (
        <Card>
          <Text style={styles.title}>Quiz Result: {score}%</Text>
          <Text style={styles.resultBody}>
            You answered {correctCount} out of {questions.length} correctly.
          </Text>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.navy, fontSize: 28, fontWeight: "800", marginBottom: 8 },
  meta: { color: colors.textMuted, marginBottom: 10 },
  subject: { color: colors.blue, fontWeight: "700", textTransform: "uppercase", fontSize: 12, letterSpacing: 1, marginTop: 14, marginBottom: 8 },
  question: { color: colors.text, fontSize: 20, fontWeight: "700", lineHeight: 28, marginBottom: 14 },
  choiceWrap: { gap: 10, marginTop: 6 },
  footer: { gap: 10, marginTop: 18 },
  resultBody: { color: colors.textMuted, lineHeight: 22 },
});
