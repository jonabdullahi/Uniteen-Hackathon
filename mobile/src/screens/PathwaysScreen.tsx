import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

function splitCsv(value?: string): string[] {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function withThreeItems(items: string[], fallback: string[]): string[] {
  const normalized = Array.from(new Set(items));
  const combined = [...normalized, ...fallback.filter((item) => !normalized.includes(item))];
  return combined.slice(0, 3);
}

export function PathwaysScreen() {
  const { initialSurvey, studyPlan, userSettings, updateUserSettings } = useAppStore();
  const [topic, setTopic] = React.useState("Algebra");
  const [level, setLevel] = React.useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");

  const pathways = React.useMemo(() => {
    const favorites = splitCsv(initialSurvey?.favoriteSubjects);
    const interests = splitCsv(initialSurvey?.interests);
    return {
      nextCourses: withThreeItems(favorites.map((subject) => `${subject} Foundations`), ["Academic Writing Essentials", "Data Basics for Students", "Public Speaking Lab"]),
      projectTracks: withThreeItems(interests.map((interest) => `${interest} Showcase Project`), ["Community Problem-Solving Project", "Personal Learning Blog", "Mini Research Portfolio"]),
      careerSteps: withThreeItems(interests.map((interest) => `${interest} Career Exploration`), ["Education Technology", "Data and Analytics", "Digital Product Design"]),
    };
  }, [initialSurvey]);

  const explanationByLevel = {
    Beginner: `Start with a plain-language explanation of ${topic}. Focus on one key rule and one small example.`,
    Intermediate: `Break ${topic} into steps and compare two problem types. Explain why each step works.`,
    Advanced: `Connect ${topic} to edge cases and tradeoffs. Analyze where the method can fail and how to recover.`,
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Smart Pathways</Text>
        <Text style={styles.title}>Pathways Studio</Text>
        <Text style={styles.subtitle}>Personalized recommendations, portfolio building, AI study support, and safety settings.</Text>
      </View>
      <Card>
        <Text style={styles.sectionTitle}>Personalized Pathway Engine</Text>
        <PathwayColumn title="Next Courses" items={pathways.nextCourses} />
        <PathwayColumn title="Project Tracks" items={pathways.projectTracks} />
        <PathwayColumn title="Career Directions" items={pathways.careerSteps} />
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>AI Study Assistant</Text>
        <InputField label="Topic" value={topic} onChangeText={setTopic} placeholder="Algebra" />
        <View style={styles.choiceWrap}>
          {(["Beginner", "Intermediate", "Advanced"] as const).map((option) => (
            <ChoiceChip key={option} selected={level === option} onPress={() => setLevel(option)}>{option}</ChoiceChip>
          ))}
        </View>
        <Text style={styles.body}>{explanationByLevel[level]}</Text>
        <PrimaryButton onPress={() => undefined}>Save Study Direction</PrimaryButton>
      </Card>
      <Card>
        <Text style={styles.sectionTitle}>Trust, Safety, and Accessibility</Text>
        <View style={styles.choiceWrap}>
          <ChoiceChip selected={userSettings.privacyMode} onPress={() => updateUserSettings({ privacyMode: !userSettings.privacyMode })}>Privacy Mode</ChoiceChip>
          <ChoiceChip selected={userSettings.highContrast} onPress={() => updateUserSettings({ highContrast: !userSettings.highContrast })}>High Contrast</ChoiceChip>
          <ChoiceChip selected={userSettings.textScale === "normal"} onPress={() => updateUserSettings({ textScale: "normal" })}>Normal</ChoiceChip>
          <ChoiceChip selected={userSettings.textScale === "large"} onPress={() => updateUserSettings({ textScale: "large" })}>Large</ChoiceChip>
        </View>
        <Text style={styles.body}>Current study plan blocks: {studyPlan?.practiceBlocks.length ?? 0}</Text>
      </Card>
    </Screen>
  );
}

function PathwayColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.column}>
      <Text style={styles.itemType}>{title}</Text>
      {items.map((item) => <Text key={item} style={styles.body}>{item}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  eyebrow: { color: colors.softBlue, fontWeight: "700", textTransform: "uppercase", fontSize: 12, letterSpacing: 1 },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800", marginTop: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 22, marginTop: 8 },
  sectionTitle: { color: colors.navy, fontSize: 20, fontWeight: "800", marginBottom: 12 },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  column: { marginBottom: 12, padding: 14, borderRadius: 16, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
  itemType: { color: colors.softBlue, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
  body: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginBottom: 4 },
});
