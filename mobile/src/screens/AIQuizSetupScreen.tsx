import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { splitSubjects, uniqueSubjects } from "../lib/aiQuiz";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "AIQuizSetup">;

export function AIQuizSetupScreen({ navigation }: Props) {
  const initialSurvey = useAppStore((state) => state.initialSurvey);
  const defaultSubjects = React.useMemo(() => {
    const surveySubjects = [...splitSubjects(initialSurvey?.favoriteSubjects || ""), ...splitSubjects(initialSurvey?.weakSubjects || "")];
    return uniqueSubjects(surveySubjects);
  }, [initialSurvey]);

  const [subjectInput, setSubjectInput] = React.useState(defaultSubjects.join(", "));
  const activeSubjects = uniqueSubjects(splitSubjects(subjectInput));

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Personalized Practice</Text>
        <Text style={styles.title}>AI Subject Quiz</Text>
        <Text style={styles.subtitle}>Generate a quiz from your subjects and get instant feedback.</Text>
      </View>
      <Card>
        <InputField label="Subjects (comma-separated)" placeholder="Math, Biology, History" value={subjectInput} onChangeText={setSubjectInput} />
        <Text style={styles.label}>Subjects in this quiz</Text>
        <View style={styles.choiceWrap}>
          {activeSubjects.map((subject) => <ChoiceChip key={subject} selected={false} onPress={() => undefined}>{subject}</ChoiceChip>)}
        </View>
        <PrimaryButton onPress={() => navigation.navigate("AIQuizTake", { subjects: activeSubjects })} disabled={!activeSubjects.length}>
          Start Quiz
        </PrimaryButton>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  eyebrow: { color: colors.softBlue, fontWeight: "700", textTransform: "uppercase", fontSize: 12, letterSpacing: 1 },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800", marginTop: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 22, marginTop: 8 },
  label: { color: colors.text, fontWeight: "700", marginBottom: 10 },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
});
