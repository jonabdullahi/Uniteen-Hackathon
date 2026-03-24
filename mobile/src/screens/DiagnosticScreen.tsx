import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { Screen } from "../components/Screen";
import { SecondaryButton } from "../components/SecondaryButton";
import { DIAGNOSTIC_QUESTIONS, FALLBACK_PLAN } from "../data/diagnostic";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "Diagnostic">;

export function DiagnosticScreen({ navigation }: Props) {
  const updateStudyPlan = useAppStore((state) => state.updateStudyPlan);
  const [currentQ, setCurrentQ] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});

  const progress = ((currentQ + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;
  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentQ];
  const isLast = currentQ === DIAGNOSTIC_QUESTIONS.length - 1;

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Diagnostic Assessment</Text>
        <Text style={styles.subtitle}>Analyzing your study habits and generating your first plan.</Text>
        <Text style={styles.meta}>Question {currentQ + 1} of {DIAGNOSTIC_QUESTIONS.length}</Text>
        <ProgressBar value={progress} />
        <Text style={styles.question}>{currentQuestion.text}</Text>
        <View style={styles.choiceWrap}>
          {currentQuestion.options.map((option) => (
            <ChoiceChip key={option} selected={answers[currentQ] === option} onPress={() => setAnswers((prev) => ({ ...prev, [currentQ]: option }))}>
              {option}
            </ChoiceChip>
          ))}
        </View>
        <View style={styles.footer}>
          <SecondaryButton onPress={() => (currentQ > 0 ? setCurrentQ((prev) => prev - 1) : navigation.goBack())}>Back</SecondaryButton>
          <PrimaryButton
            onPress={() => {
              if (!answers[currentQ]) return;
              if (isLast) {
                updateStudyPlan(FALLBACK_PLAN);
                navigation.replace("MainTabs");
              } else {
                setCurrentQ((prev) => prev + 1);
              }
            }}
          >
            {isLast ? "Generate My Plan" : "Next Question"}
          </PrimaryButton>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.navy, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.textMuted, marginTop: 8, marginBottom: 16, lineHeight: 22 },
  meta: { color: colors.textMuted, marginBottom: 10 },
  question: { color: colors.text, fontSize: 20, fontWeight: "700", lineHeight: 28, marginTop: 16, marginBottom: 16 },
  choiceWrap: { gap: 10 },
  footer: { gap: 10, marginTop: 18 },
});
